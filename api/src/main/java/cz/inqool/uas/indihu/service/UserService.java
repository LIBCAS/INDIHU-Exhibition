package cz.inqool.uas.indihu.service;

import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.enums.UserState;
import cz.inqool.uas.indihu.repository.UserRepository;
import cz.inqool.uas.security.password.GoodPasswordGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;

import static cz.inqool.uas.util.Utils.notNull;

@Service
public class UserService {

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    private HelperService helperService;

    private GoodPasswordGenerator goodPasswordGenerator;

    private IndihuNotificationService indihuNotificationService;

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
            indihuNotificationService.notifyPasswordReset(user, password);
            return true;
        }
        indihuNotificationService.notifyLdapReset(user.getEmail());
        return false;
    }

    /**
     * Method to reactivate an {@link User} account
     *
     * @param id of user to reactivate
     */
    @Transactional
    public void reactivateUser(String id) {
        User user = userRepository.find(id);
        notNull(user, () -> new MissingObject("User with id: ", id));
        user.setDeleted(null);
        user.setState(UserState.ACCEPTED);
        userRepository.save(user);
        indihuNotificationService.notifyReactivated(user.getEmail());
    }

    /**
     * deletes user with given id
     */
    public void deleteUser(String userId) {
        User user = userRepository.find(userId);
        notNull(user, () -> new MissingObject("User with id: ", userId));
        if (user.getEmail() != null) {
            indihuNotificationService.notifyDeletedByAdmin(user.getEmail());
        }
        user.setState(UserState.DELETED);
        user = userRepository.save(user);
        userRepository.delete(user);
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
    public void setNotificationService(IndihuNotificationService indihuNotificationService) {
        this.indihuNotificationService = indihuNotificationService;
    }
}
