package cz.inqool.uas.indihu.service.notification;

import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.Registration;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

/**
 * Created by Michal on 24. 7. 2017.
 */
@Service
@ConditionalOnProperty(prefix = "notifications", name = "enabled", havingValue = "true")
public class IndihuNotificationServiceImpl implements IndihuNotificationService {

    private JavaMailSender emailSender;

    private UserRepository userRepository;

    @Value("${application.url}")
    private String url;

    @Override
    public void notifyAddedToCollaborate(String email, User byUser, Exposition exposition) {
        String subject = "INDIHU Exhibition - Přidání ke spolupráci na přípravě výstavy";
        String text = "Dobrý den,\n\n" +
                "v aplikaci INDIHU Exhibition Vás uživatel {name} ({email}), který je autorem výstavy <strong>{exposition_name}</strong>, pozval ke spolupráci.\n\n" +
                "Výstavu najdete ve výpisu všech Vašich výstav.\n\n" +
                "Pokud nemáte účet, registrujte se na: {url}\n\n" +
                "Za tým INDIHU Exhibition Vám přejeme mnoho úspěšných výstavních projektů";

        text = text.replace("{name}", byUser.getFirstName() + " " + byUser.getSurname())
                .replace("{email}", byUser.getEmail())
                .replace("{exposition_name}", exposition.getTitle())
                .replace("{url}", url);
        sendMessage(text, subject, email);
    }

    
    @Override
    public void notifyRemovedFromCollaboration(String toNotify, User byUser, Exposition exposition) {
        String subject = "INDIHU Exhibition - Vyloučení ze spolupráce na přípravě výstavy";
        String text = "Byl jste v aplikaci INDIHU Exhibition uživatelem {userName}, který je autorem výstavy {name}, odebrán ze spolupráce na její přípravě.";
        text = text.replace("{userName}", byUser.getEmail());
        text = text.replace("{name}", exposition.getTitle());
        sendMessage(text, subject, toNotify);
    }

    
    @Override
    public void notifyAccepted(String toNotify) {
        String subject = "Registrace do INDIHU Exhibiton byla schválena";
        String text = "Dobrý den,\n" +
                "od této chvíle můžete na adrese: {url} využívat nástroj INDIHU Exhibition k tvorbě virtuálních výstav. " +
                "Informace o tvorbě výstav a používání editoru najdete v manuálu: https://nnis.github.io/indihu-manual/.\n" +
                "Přejeme Vám mnoho úspěšných virtuálních projektů. Tým INDIHU\n" +
                "\n" +
                "Více o projektu INDIHU nalezenete na: https://indihu.cz/\n" +
                "Mezi další produkty INDIHU patří nástroj OCR (https://ocr.indihu.cz/).";

        text = text.replace("{url}", url);
        sendMessage(text, subject, toNotify);
    }

    
    @Override
    public void notifyNewRegistration(Registration registration) {
        User newUser = registration.getToAccept();

        String subject = "Registrace do aplikace INDIHU Exhibition";
        String text = "Vaše registrace do aplikace INDIHU Exhibition byla úspěšná a nyní čeká na schválení administrátorem. O její schválení Vás budeme informovat.";
        sendMessage(text, subject, newUser.getEmail());

        String userInfo = String.format("%s / %s %s", newUser.getEmail(), newUser.getFirstName(), newUser.getSurname());
        notifyAdmins("V aplikaci INDIHU Exhibition byla vytvořená nová registrace a čeká na schválení administrátorem: " + userInfo, "INDIHU Exhibition - Nová registrace ke schválení");
    }

    
    @Override
    public void notifyPasswordReset(User user, String password) {
        String subject = "Reset hesla do aplikace INDIHU Exhibiton";
        String text = "Požádali jste o reset hesla do aplikace INDIHU Exhibiton. Vaše přihlasovací jméno: " + user.getUserName() + '\n' +
                "Vaše nové heslo je: " + password + '\n' +
                "Doporučujeme toto heslo změnit v nastavení uživatelského účtu.";
        sendMessage(text, subject, user.getEmail());
    }

    
    @Override
    public void notifyReactivated(String userEmail) {
        String text = "Váš účet v aplikaci INDIHU Exhibition byl znovu aktivován poté, co byl v minulosti deaktivovaný.";
        String subject = "Znovuaktivace účtu v aplikaci INDIHU Exhibition";
        sendMessage(text, subject, userEmail);
    }

    
    @Override
    public void notifyDeletedByAdmin(String userEmail) {
        String text = "Váš účet v aplikaci INDIHU Exhibition byl deaktivován administrátorem.";
        String subject = "Deaktivace účtu v aplikaci INDIHU Exhibition";
        sendMessage(text, subject, userEmail);
    }

    
    @Override
    public void notifyDeleted(String userEmail) {
        String text = "Váš účet v aplikaci INDIHU Exhibition byl deaktivován.";
        String subject = "Deaktivace účtu v aplikaci INDIHU Exhibition";
        sendMessage(text, subject, userEmail);
    }

    
    @Override
    public void notifyMovedExposition(String oldOwner, String newOwner, Exposition exposition) {
        String text = "Váše výstava " + exposition.getTitle() + " byla presunuta na: " + newOwner;
        String subject = "Přesun výstavy";
        sendMessage(text, subject, oldOwner);
        text = "Byl jste přirazen ako vlastník na výstavu s názvem: " + exposition.getTitle();
        sendMessage(text, subject, newOwner);
    }

    
    @Override
    public void notifyDeletedExposition(String recipient, Exposition exposition) {
        String text = "Výstava " + exposition.getTitle() + " byla smazaná vlastníkem: " + exposition.getAuthor();
        String subject = "Smazání výstavy";
        sendMessage(text, subject, recipient);
    }

    /**
     * method that sends an email
     *
     * @param text    of email
     * @param subject of email
     * @param email   address of recipent
     */
    private void sendMessage(String text, String subject, String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("info@indihu.cz");
        message.setTo(email);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    /**
     * method to notify admins
     *
     * @param text    of email
     * @param subject of email
     */
    private void notifyAdmins(String text, String subject) {
        List<String> adminMails = userRepository.getAdminMails();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("info@indihu.cz");
        message.setTo(adminMails.toArray(new String[adminMails.size()]));
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    
    @Override
    public void verifyEmail(Registration registration) {
        String text = "Prosíme oveřte svůj email kliknutím na: " + url + "/verify/" + registration.getSecret();
        String subject = "Oveření emailu";
        sendMessage(text, subject, registration.getToAccept().getEmail());
    }

    
    @Override
    public void notifyLdapReset(String email) {
        String text = "Reset hesla sa nezdařil nakolik je účet veden v LDAP serveru.";
        String subject = "Reset hesla";
        sendMessage(text, subject, email);
    }

    @Override
    public void notifyAuthor(String text, Exposition exposition) {
        String subject = "INDIHU Exhibition - Nový komentář k výstavě";
        String body = "K výstavě "+ exposition.getTitle() + "byl zanechán nový komentář: " + text +
                "Detail výstavy zobrazíte kliknutím na tento odkaz: " + url + "/expo/" + exposition.getId() + "/rating";

        sendMessage(body, subject, exposition.getAuthor().getEmail());
    }

    /**
     * Email for registration rejection
     *
     * @param email of receiver
     */
    @Override
    public void notifyRejected(String email) {
        String text = "Váše registrace v aplikaci INDIHU byla zamítnuta administrátorem.";
        String subject = "Zamítnutí registrace v aplikaci INDIHU Exhibition";
        sendMessage(text, subject, email);
    }

    @Inject
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Inject
    public void setEmailSender(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
