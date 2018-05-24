package cz.inqool.uas.indihu.service;


import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.indihu.entity.domain.Registration;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.RegistrationStatusEnum;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.enums.UserState;
import cz.inqool.uas.indihu.repository.RegistrationRepository;
import cz.inqool.uas.indihu.repository.UserRepository;
import cz.inqool.uas.indihu.security.service.LdapCredentialsHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import static cz.inqool.uas.util.Utils.notNull;

/**
 * Created by Michal on 26. 7. 2017.
 */
@Service
public class RegistrationService {

    private SettingsService settings;

    private RegistrationRepository repository;

    private UserRepository userRepository;

    private IndihuNotificationService indihuNotificationService;

    private PasswordEncoder passwordEncoder;

    private HelperService helperService;

    private LdapCredentialsHandler ldapCredentialsHandler;

    private CollaboratorService collaboratorService;

    private final Logger log = LoggerFactory.getLogger("Api");

    private static final Marker MARKER = MarkerFactory.getMarker("API");

    /**
     * Method to accept multiple registrations at once
     *
     * @param registrations {@link List} of ids of registrations
     */
    @Transactional
    public void accept(List<String> registrations) {
        Collection<Registration> registrations1 = repository.findAllInList(registrations);
        if (registrations1.size() > 0) {
            registrations1.forEach(this::acceptRegistration);
        }
    }

    /**
     * Method to accept a single registration
     *
     * @param registration {@link Registration} to accept
     */
    @Transactional
    public User acceptRegistration(Registration registration) {
        User toAccept = registration.getToAccept();
        toAccept.setAccepted(true);
        toAccept.setState(UserState.ACCEPTED);
        indihuNotificationService.notifyAccepted(toAccept.getEmail());
        toAccept = userRepository.save(toAccept);
        registration.setToAccept(null);
        repository.delete(registration);
        return toAccept;
    }

    /**
     * Method to create a registration for user defined in params
     *
     * @return {@link RegistrationStatusEnum} where true means accepted
     * false means created
     * null means not allowed currently
     */
    @Transactional
    public RegistrationStatusEnum register(String userName, String firstName, String surname, String email, String institution, String password) {
        Registration registration = fromUserDto(userName, firstName, surname, email, institution, password);
        if (registration == null) {
            log.info(MARKER, "Registration: User or registration with email: " + email + " already exists in system.");
            return RegistrationStatusEnum.EMAIL_EXISTS;
        }
        if (ldapCredentialsHandler.exists(userName)) {
            log.info(MARKER, "Registration: User with email: " + email + " found in LDAP.");
            return RegistrationStatusEnum.IN_LDAP;
        }
        if (settings.isRegistrationAllowed()) {
            registration.setSecret(UUID.randomUUID().toString());
            indihuNotificationService.verifyEmail(registration);
            registration.getToAccept().setState(UserState.NOT_VERIFIED);
            userRepository.save(registration.getToAccept());
            repository.save(registration);
            log.info(MARKER, "Registration: Created registration with email: " + email);
            return RegistrationStatusEnum.CREATED;
        }
        log.warn(MARKER, "Registration is not allowed." );
        return RegistrationStatusEnum.FORBIDDEN;
    }

    /**
     * Converts fields into {@link Registration}
     *
     * @return {@link Registration} created
     */
    private Registration fromUserDto(String userName, String firstName, String surname, String email, String institution, String password) {
        Registration registration = new Registration();
        User found = userRepository.findByEmail(email);
        if (found == null) {
            User toAccept = new User();
            toAccept.setAccepted(false);

            toAccept.setVerifiedEmail(false);
            toAccept.setUserName(userName);
            toAccept.setEmail(email);
            toAccept.setFirstName(firstName);
            toAccept.setSurname(surname);
            toAccept.setInstitution(institution);
            toAccept.setPassword(passwordEncoder.encode(password));
            toAccept.setRole(UserRole.ROLE_EDITOR);

            registration.setIssued(Instant.now());
            registration.setToAccept(toAccept);
            return registration;
        }
        return null;
    }

    /**
     * verifies email of registering user,
     *
     * @param secret
     * @param response
     * @return
     */
    @Transactional
    public RegistrationStatusEnum verify(String secret, HttpServletResponse response) {
        Registration registration = repository.findBySecret(secret);
        notNull(registration, () -> new MissingObject(Registration.class, "Secret: " + secret));
        if (settings.isRegistrationAutomatic()) {
            User user = registration.getToAccept();
            user.setVerifiedEmail(true);
            user.setAccepted(true);
            user.setState(UserState.ACCEPTED);
            userRepository.save(user);
            registration.setToAccept(null);
            repository.delete(registration);
            helperService.loggIn(user, response);
            collaboratorService.mapCollaborator(user);
            return RegistrationStatusEnum.AUTOMATIC;
        } else {
            User user = registration.getToAccept();
            user.setVerifiedEmail(true);
            user.setState(UserState.TO_ACCEPT);
            userRepository.save(user);
            registration.setToAccept(user);
            registration = repository.save(registration);
            indihuNotificationService.notifyNewRegistration(registration);
            return RegistrationStatusEnum.IN_QUEUED;
        }
    }

    @Inject
    public void setRepository(RegistrationRepository repository) {
        this.repository = repository;
    }

    @Inject
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Inject
    public void setNotificationService(IndihuNotificationService indihuNotificationService) {
        this.indihuNotificationService = indihuNotificationService;
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
    public void setLdapCredentialsHandler(LdapCredentialsHandler ldapCredentialsHandler) {
        this.ldapCredentialsHandler = ldapCredentialsHandler;
    }

    @Inject
    public void setSettings(SettingsService settings) {
        this.settings = settings;
    }

    @Inject
    public void setCollaboratorService(CollaboratorService collaboratorService) {
        this.collaboratorService = collaboratorService;
    }
}
