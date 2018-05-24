package cz.inqool.uas.helper;

import com.querydsl.jpa.impl.JPAQueryFactory;
import cz.inqool.uas.audit.AuditLogger;
import cz.inqool.uas.config.PasswordEncoderProducer;
import cz.inqool.uas.file.FileRepository;
import cz.inqool.uas.indihu.entity.domain.*;
import cz.inqool.uas.indihu.entity.enums.CollaborationType;
import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.enums.UserState;
import cz.inqool.uas.indihu.repository.*;
import cz.inqool.uas.indihu.security.UserDelegate;
import cz.inqool.uas.indihu.security.jwt.IndihuJwtHandler;
import cz.inqool.uas.indihu.security.service.LdapCredentialsHandler;
import cz.inqool.uas.indihu.service.*;
import cz.inqool.uas.mail.AsyncMailSender;
import cz.inqool.uas.security.UserDetails;
import cz.inqool.uas.security.password.GoodPasswordGenerator;
import cz.inqool.uas.service.Templater;
import org.apache.velocity.app.VelocityEngine;
import org.junit.Before;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.time.Instant;

import static cz.inqool.uas.util.Utils.asSet;

public class SetUpTests extends DbTest {
    @InjectMocks
    protected AsyncMailSender sender = new AsyncMailSender();

    @InjectMocks
    protected MockMailSender mockMailSender = new MockMailSender();

    @InjectMocks
    protected HelperService helperService = new HelperService();

    @InjectMocks
    protected IndihuJwtHandler indihuJwtHandler = new IndihuJwtHandler();

    @InjectMocks
    protected IndihuService indihuService = new IndihuService();

    @InjectMocks
    protected SettingsService settingsService = new SettingsService();

    @InjectMocks
    protected IndihuNotificationService indihuNotificationService = new IndihuNotificationService();

    @InjectMocks
    protected RegistrationService registrationService = new RegistrationService();

    @InjectMocks
    protected UserService userService = new UserService();

    @InjectMocks
    protected CollaboratorService collaboratorService = new CollaboratorService();

    @InjectMocks
    protected ExpositionService expositionService = new ExpositionService();

    @InjectMocks
    protected ExpositionFileService expositionFileService = new ExpositionFileService();

    protected GoodPasswordGenerator passwordGenerator = new GoodPasswordGenerator(8,true,true);

    @Mock
    protected ElasticsearchTemplate template;

    @Mock
    protected AuditLogger auditLogger;

    @Mock
    protected LdapCredentialsHandler ldapCredentialsHandler;

    @Mock
    protected FileRepository fileRepository;

    protected CollaboratorRepository collaboratorRepository;

    protected ExpositionOpeningRepository expositionOpeningRepository;

    protected ExpositionRepository expositionRepository;

    protected ExpositionUrlRepository expositionUrlRepository;

    protected FileExpositionMapperRepository fileExpositionMapperRepository;

    protected RegistrationRepository registrationRepository;

    protected SettingsRepository settingsRepository;

    protected PasswordEncoderProducer passwordEncoderProducer = new PasswordEncoderProducer();

    protected UserRepository userRepository;

    protected PasswordEncoder passwordEncoder;

    protected Collaborator collaborator;

    protected Collaborator collaborator1;

    protected Collaborator collaborator2;

    protected Exposition exposition;

    protected Exposition exposition1;

    protected Exposition exposition2;

    protected Exposition exposition4;

    protected Registration registration;

    protected Registration registration1;

    protected User editor;

    protected User admin1;

    protected User admin2;

    protected User testUser1;

    protected User testUser2;

    protected User toRegister;

    protected User toRegister1;


    @Before
    public void setUp() throws IOException {
        MockitoAnnotations.initMocks(this);

        Templater templater = new Templater();
        templater.setEngine(new VelocityEngine());


        sender.setSender(mockMailSender);
        collaboratorRepository = new CollaboratorRepository();
        collaboratorRepository.setEntityManager(getEm());
        collaboratorRepository.setQueryFactory(new JPAQueryFactory(getEm()));

        expositionOpeningRepository = new ExpositionOpeningRepository();
        expositionOpeningRepository.setEntityManager(getEm());
        expositionOpeningRepository.setQueryFactory(new JPAQueryFactory(getEm()));

        expositionRepository = new ExpositionRepository();
        expositionRepository.setEntityManager(getEm());
        expositionRepository.setQueryFactory(new JPAQueryFactory(getEm()));
        expositionRepository.setTemplate(template);

        expositionUrlRepository = new ExpositionUrlRepository();
        expositionUrlRepository.setEntityManager(getEm());
        expositionUrlRepository.setQueryFactory(new JPAQueryFactory(getEm()));

        fileExpositionMapperRepository = new FileExpositionMapperRepository();
        fileExpositionMapperRepository.setEntityManager(getEm());
        fileExpositionMapperRepository.setQueryFactory(new JPAQueryFactory(getEm()));
        fileExpositionMapperRepository.setFileRepository(fileRepository);

        registrationRepository = new RegistrationRepository();
        registrationRepository.setEntityManager(getEm());
        registrationRepository.setQueryFactory(new JPAQueryFactory(getEm()));
        registrationRepository.setTemplate(template);

        userRepository = new UserRepository();
        userRepository.setEntityManager(getEm());
        userRepository.setQueryFactory(new JPAQueryFactory(getEm()));
        userRepository.setTemplate(template);

        settingsRepository = new SettingsRepository();
        settingsRepository.setEntityManager(getEm());
        settingsRepository.setQueryFactory(new JPAQueryFactory(getEm()));

        Settings settings = new Settings();
        settings.setAllowedRegistration(true);
        settings.setAutomaticRegistration(false);
        settings.setLockDuration(60);
        settingsRepository.save(settings);

        editor = new User();
        editor.setEmail("info@inqool.cz");
        editor.setAccepted(true);
        editor.setFirstName("First");
        editor.setSurname("Surname");
        editor.setInstitution("Big Fat Gym");
        editor.setLdapUser(false);
        editor.setUserName("joker");
        editor.setState(UserState.ACCEPTED);
        editor.setRole(UserRole.ROLE_EDITOR);
        editor = userRepository.save(editor);


        admin1 = new User();
        admin1.setEmail("admin1@inqool.cz");
        admin1.setAccepted(true);
        admin1.setState(UserState.ACCEPTED);
        admin1.setUserName("king");
        admin1.setLdapUser(false);
        admin1.setInstitution("Oh long johnson");
        admin1.setFirstName("janko");
        admin1.setSurname("mrkvicka");
        admin1.setRole(UserRole.ROLE_ADMIN);
        admin1 = userRepository.save(admin1);


        admin2 = new User();
        admin2.setEmail("admin2@inqool.cz");
        admin2.setAccepted(true);
        admin2.setState(UserState.ACCEPTED);
        admin2.setUserName("boss");
        admin2.setLdapUser(false);
        admin2.setInstitution("Oh long johnson");
        admin2.setFirstName("peter");
        admin2.setSurname("novak");
        admin2.setRole(UserRole.ROLE_ADMIN);
        admin2 = userRepository.save(admin2);


        testUser1 = new User();
        testUser1.setEmail("testUser1@inqool.cz");
        testUser1.setAccepted(true);
        testUser1.setUserName("testUser1");
        testUser1.setLdapUser(false);
        testUser1.setState(UserState.ACCEPTED);
        testUser1.setInstitution("Oh long johnson");
        testUser1.setFirstName("test");
        testUser1.setSurname("user1");
        testUser1.setRole(UserRole.ROLE_EDITOR);
        testUser1 = userRepository.save(testUser1);

        testUser2 = new User();
        testUser2.setEmail("testUser2@inqool.cz");
        testUser2.setAccepted(true);
        testUser2.setState(UserState.ACCEPTED);
        testUser2.setUserName("testUser2");
        testUser2.setLdapUser(false);
        testUser2.setInstitution("Oh long johnson");
        testUser2.setFirstName("test");
        testUser2.setSurname("user2");
        testUser2.setRole(UserRole.ROLE_EDITOR);
        testUser2 = userRepository.save(testUser2);

        toRegister = new User();
        toRegister.setEmail("something@inqool.cz");
        toRegister.setState(UserState.NOT_VERIFIED);
        toRegister.setAccepted(false);
        toRegister.setUserName("dummy");
        toRegister.setLdapUser(false);
        toRegister.setInstitution("Look a penny!");
        toRegister.setFirstName("dumb");
        toRegister.setSurname("dumpster");
        toRegister.setRole(UserRole.ROLE_EDITOR);
        toRegister = userRepository.save(toRegister);

        toRegister1 = new User();
        toRegister1.setEmail("something@inqool.cz");
        toRegister1.setAccepted(false);
        toRegister1.setState(UserState.NOT_VERIFIED);
        toRegister1.setUserName("dummy");
        toRegister1.setLdapUser(false);
        toRegister1.setInstitution("Look a penny!");
        toRegister1.setFirstName("dumb");
        toRegister1.setSurname("dumpster");
        toRegister1.setRole(UserRole.ROLE_EDITOR);
        toRegister1 = userRepository.save(toRegister1);

        exposition = new Exposition();
        exposition.setAuthor(editor);
        exposition.setIsEditing(admin1.getUserName());
        exposition.setUrl("pokusna-url");
        exposition.setPerex("perex");
        exposition.setTitle("title");
        exposition.setSubTitle("subtitile");
        exposition.setState(ExpositionState.PREPARE);
        exposition.setStructure("{\"some\" :\"serializer\"}");
        exposition = expositionRepository.save(exposition);
        exposition.setUrls(asSet(expositionUrlRepository.save(new ExpositionUrl(exposition,exposition.getUrl()))));
        exposition = expositionRepository.save(exposition);

        exposition1 = new Exposition();
        exposition1.setAuthor(editor);
        exposition1.setUrl("some");
        exposition1.setIsEditing(editor.getUserName());
        exposition1.setState(ExpositionState.OPENED);
        exposition1 = expositionRepository.save(exposition1);
        exposition1.setUrls(asSet(expositionUrlRepository.save(new ExpositionUrl(exposition1,exposition1.getUrl()))));
        exposition1 = expositionRepository.save(exposition1);

        exposition2 = new Exposition();
        exposition2.setTitle("title");
        exposition2.setAuthor(admin2);
        exposition2.setUrl("exposition2");
        exposition2.setState(ExpositionState.ENDED);
        exposition2.setIsEditing(admin2.getUserName());
        exposition2.setClosedUrl("example");
        exposition2 = expositionRepository.save(exposition2);
        exposition2.setUrls(asSet(expositionUrlRepository.save(new ExpositionUrl(exposition2,exposition2.getUrl()))));
        exposition2 = expositionRepository.save(exposition2);

        exposition4 = new Exposition();
        exposition4.setAuthor(admin1);
        exposition4.setState(ExpositionState.OPENED);
        expositionRepository.save(exposition4);

        collaborator = new Collaborator();
        collaborator.setCollaborator(admin1);
        collaborator.setExposition(exposition);
        collaborator.setSince(Instant.now());
        collaborator.setCollaborationType(CollaborationType.EDIT);
        collaboratorRepository.save(collaborator);

        collaborator1 = new Collaborator();
        collaborator1.setExposition(exposition2);
        collaborator1.setCollaborationType(CollaborationType.READ_ONLY);
        collaborator1.setCollaborator(editor);
        collaboratorRepository.save(collaborator1);

        collaborator2 = new Collaborator();
        collaborator2.setCollaborator(testUser1);
        collaborator2.setExposition(exposition);
        collaborator2.setSince(Instant.now());
        collaborator2.setCollaborationType(CollaborationType.READ_ONLY);
        collaboratorRepository.save(collaborator2);

        registration = new Registration();
        registration.setToAccept(toRegister);
        registration.setIssued(Instant.now());
        registrationRepository.save(registration);

        registration1 = new Registration();
        registration1.setToAccept(toRegister1);
        registration1.setIssued(Instant.now());
        registrationRepository.save(registration1);

        helperService.setCollaboratorRepository(collaboratorRepository);
        helperService.setCurrent(editor);

        passwordEncoder = passwordEncoderProducer.passwordEncoder();
//        passwordGenerator = passwordEncoderProducer.

        indihuJwtHandler.setService(indihuService);

        indihuService.setUserRepository(userRepository);

        registrationService.setHelperService(helperService);
        registrationService.setPasswordEncoder(passwordEncoder);
        registrationService.setRepository(registrationRepository);
        registrationService.setUserRepository(userRepository);

        collaboratorService.setCollaboratorRepository(collaboratorRepository);
        collaboratorService.setExpositionRepository(expositionRepository);
        collaboratorService.setHelperService(helperService);
        collaboratorService.setNotificationService(indihuNotificationService);
        collaboratorService.setUserRepository(userRepository);

        indihuNotificationService.setEmailSender(mockMailSender);
        indihuNotificationService.setUserRepository(userRepository);

        userService.setGoodPasswordGenerator(passwordGenerator);
        userService.setHelperService(helperService);
        userService.setNotificationService(indihuNotificationService);
        userService.setUserRepository(userRepository);
        userService.setPasswordEncoder(passwordEncoder);
        userService.setGoodPasswordGenerator(passwordGenerator);

        settingsService.setSettingsRepository(settingsRepository);

        expositionService.setCollaboratorService(collaboratorService);
        expositionService.setExpositionOpeningRepository(expositionOpeningRepository);
        expositionService.setHelperService(helperService);
        expositionService.setRepository(expositionRepository);
        expositionService.setExpositionFileService(expositionFileService);
        expositionService.setFileExpositionMapperRepository(fileExpositionMapperRepository);
        expositionService.setSettingsService(settingsService);
        expositionService.setExpositionUrlRepository(expositionUrlRepository);
        expositionService.setNotificationService(indihuNotificationService);

        registrationService.setUserRepository(userRepository);
        registrationService.setRepository(registrationRepository);
        registrationService.setPasswordEncoder(passwordEncoder);
        registrationService.setHelperService(helperService);
        registrationService.setNotificationService(indihuNotificationService);

        expositionFileService.setFileExpositionMapperRepository(fileExpositionMapperRepository);

        Authentication authentication = Mockito.mock(Authentication.class);
        UserDetails details = new UserDelegate(editor);
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        Mockito.when(securityContext.getAuthentication().getPrincipal()).thenReturn(details);


    }

}
