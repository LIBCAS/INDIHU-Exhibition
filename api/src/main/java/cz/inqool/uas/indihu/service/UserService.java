package cz.inqool.uas.indihu.service;

import cz.inqool.uas.exception.MissingAttribute;
import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.indihu.entity.domain.Registration;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.enums.UserState;
import cz.inqool.uas.indihu.repository.RegistrationRepository;
import cz.inqool.uas.indihu.repository.UserRepository;
import cz.inqool.uas.indihu.security.oauth.OAuthProfileDetails;
import cz.inqool.uas.indihu.service.exposition.ExpositionRemovalService;
import cz.inqool.uas.indihu.service.notification.IndihuNotificationService;
import cz.inqool.uas.indihu.service.oauth.OAuthLoginException;
import cz.inqool.uas.security.password.GoodPasswordGenerator;
import cz.inqool.uas.util.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;

import static cz.inqool.uas.indihu.entity.enums.UserState.*;
import static cz.inqool.uas.indihu.service.oauth.OAuthLoginException.ErrorCode.AWAITING_ADMIN_APPROVAL;
import static cz.inqool.uas.indihu.service.oauth.OAuthLoginException.ErrorCode.REGISTRATION_NOT_ALLOWED;
import static cz.inqool.uas.util.Utils.notNull;

@Service
public class UserService {

    private UserRepository userRepository;

    private RegistrationRepository registrationRepository;

    private PasswordEncoder passwordEncoder;

    private HelperService helperService;

    private ExpositionRemovalService expositionRemovalService;

    private GoodPasswordGenerator goodPasswordGenerator;

    private IndihuNotificationService notificationService;

    private SettingsService settingsService;

    /**
     * Updates user information of {@link User}
     *
     * @param toUpdate {@link User} to update
     */
    @Transactional
    public void update(User toUpdate) {
        User withPass = userRepository.find(toUpdate.getId());
        if (toUpdate.getPassword() != null) {
            toUpdate.setPassword(passwordEncoder.encode(toUpdate.getPassword()));
        } else {
            toUpdate.setPassword(withPass.getPassword());
        }
        if (helperService.getCurrent().getRole().equals(UserRole.ROLE_ADMIN)) {
            if (toUpdate.getRole() == null) {
                toUpdate.setRole(withPass.getRole());
            }
        } else {
            toUpdate.setRole(withPass.getRole());
        }
        toUpdate = userRepository.save(toUpdate);

        if (toUpdate.getId().equals(helperService.getCurrent().getId())) {
            helperService.setCurrent(toUpdate);
        }
    }

    /**
     * Method registers/retrieves user upon oauth login
     *
     * @param oAuthProfile retrieved profile from external IdP should always include email
     * @return user
     * @throws OAuthLoginException in case registration is disabled, or email can't be obtained
     */
    @Transactional
    public User createOrRetrieveOAuthUser(OAuthProfileDetails oAuthProfile) throws OAuthLoginException {
        if (oAuthProfile.getEmail() == null) {
            throw new OAuthLoginException(OAuthLoginException.ErrorCode.MISSING_EMAIL, "Can't register user with name: "
                    + oAuthProfile.getEmail() + " external IdP did not return email.");
        }

        User existingEmail = userRepository.findByEmail(oAuthProfile.getEmail());
        if (existingEmail != null) {
            if (TO_ACCEPT.equals(existingEmail.getState())) {
                throw new OAuthLoginException(AWAITING_ADMIN_APPROVAL, "Account is pending confirmation from administrator");
            }
            return existingEmail;
        }

        if (settingsService.isRegistrationAllowed()) {
            return userRepository.save(createUser(oAuthProfile));
        } else {
            throw new OAuthLoginException(REGISTRATION_NOT_ALLOWED, "Registration of new users is currently not allowed");
        }
    }

    private User createUser(OAuthProfileDetails oAuthProfile) {
        User user = new User();
        user.setRole(UserRole.ROLE_EDITOR);
        user.setVerifiedEmail(true);
        if (settingsService.isRegistrationAutomatic()) {
            user.setState(UserState.ACCEPTED);
        } else {
            user.setState(TO_ACCEPT);
        }
        user.setEmail(oAuthProfile.getEmail());
        if (user.getUserName() != null) {
            user.setUserName(oAuthProfile.getUsername());
        } else {
            user.setUserName(oAuthProfile.getEmail());
        }
        return user;
    }


    /**
     * Resets user password for {@link User} and send mail notificaation to user with new password
     *
     * @param email of {@link User} to reset password for
     * @return true if reset is for internal user
     */
    @Transactional
    public boolean resetPassword(String email) {
        User user = userRepository.findByEmail(email);
        notNull(user, () -> new MissingObject("User with email: ", email));
        if (!user.isLdapUser()) {
            String password = goodPasswordGenerator.generate();
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            notificationService.notifyPasswordReset(user, password);
            return true;
        }
        notificationService.notifyLdapReset(user.getEmail());
        return false;
    }

    /**
     * Method to reactivate an {@link User} account
     *
     * @param id of user to reactivate
     */
    @Transactional
    public void reactivateUser(String id) {
        User user = userRepository.findUser(id);
        notNull(user, () -> new MissingObject("User with id: ", id));
        user.setDeleted(null);
        userRepository.restore(user.getId());
        userRepository.save(user);
        notificationService.notifyReactivated(user.getEmail());
    }

    /**
     * deletes user with given id
     */
    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.find(userId);
        notNull(user, () -> new MissingObject("User with id: ", userId));
        if (user.getEmail() != null) {
            notificationService.notifyDeletedByAdmin(user.getEmail());
        }
        user = userRepository.save(user);
        userRepository.delete(user);
    }

    @Transactional
    public void reject(String userId) {
        User user = checkUserState(userId);

        user.setAccepted(false);
        user.setState(UserState.REJECTED);
        notificationService.notifyRejected(user.getEmail());
        userRepository.save(user);
        if (user.getRegistration() != null) {
            Registration registration = user.getRegistration();
            registration.setToAccept(null);
            registrationRepository.delete(registration);
        }
    }

    private User checkUserState(String userId) {
        User user = userRepository.findNotDeleted(userId);

        if (user.getState() == null) {
            throw new MissingAttribute(User.class, "state");
        }

        if (!Utils.asSet(TO_ACCEPT, REJECTED, ACCEPTED).contains(user.getState())) {
            throw new IllegalStateException("User of id: " + userId + " is not in state TO_ACCEPT, current state: " + user.getState());
        }

        return user;
    }

    @Transactional
    public void accept(String userId) {
        User user = checkUserState(userId);

        user.setAccepted(true);
        user.setState(UserState.ACCEPTED);
        notificationService.notifyAccepted(user.getEmail());
        userRepository.save(user);
        if (user.getRegistration() != null) {
            Registration registration = user.getRegistration();
            registration.setToAccept(null);
            registrationRepository.delete(registration);
        }
    }

    @Transactional
    public void restore(String id) {
        User user = userRepository.findUser(id);

        if (user.getDeleted() == null) {
            throw new IllegalStateException("User of id: " + user + " is not deleted, cannot restore");
        }

        user.setDeleted(null);
        userRepository.save(user);

        if (user.getEmail() != null) {
            notificationService.notifyReactivated(user.getEmail());
        }
    }

    /**
     * Method permanently deletes currently logged-in users data
     */
    @Transactional
    public void removeCurrentUser() {
        User user = helperService.getCurrent();
        notificationService.notifyDeleted(user.getEmail());
        expositionRemovalService.removeAllFromUser(user);
        if (user.getRegistration() != null) {
            registrationRepository.remove(user.getRegistration());
        }
        userRepository.deleteUser(user);
        helperService.setCurrent(null);
    }

    @Inject
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Inject
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Inject
    public void setHelperService(HelperService helperService) {
        this.helperService = helperService;
    }

    @Inject
    public void setGoodPasswordGenerator(GoodPasswordGenerator goodPasswordGenerator) {
        this.goodPasswordGenerator = goodPasswordGenerator;
    }

    @Inject
    public void setNotificationService(IndihuNotificationService notificationSerivce) {
        this.notificationService = notificationSerivce;
    }

    @Autowired
    public void setRegistrationRepository(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    @Autowired
    public void setSettingsService(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @Autowired
    public void setExpositionRemovalService(ExpositionRemovalService expositionRemovalService) {
        this.expositionRemovalService = expositionRemovalService;
    }
}
