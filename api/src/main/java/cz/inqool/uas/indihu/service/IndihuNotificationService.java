package cz.inqool.uas.indihu.service;

import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.Registration;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

/**
 * Created by Michal on 24. 7. 2017.
 */

@Service
public class IndihuNotificationService {

    private JavaMailSender emailSender;

    private UserRepository userRepository;

    @Value("${application.url}")
    private String url;

    public void notifyAddedToCollaborate(User toNotify, User byUser, Exposition exposition) {
        String subject = "INDIHU Virtuální výstavy - Přidání ke spolupráci na přípravě výstavy";
        String text = "Byl jste v aplikaci INDIHU Virtuální výstavy uživatelem {userName}, který je autorem výstavy {name}, přidán k spolupráci na její přípravě. Výstavu nyní naleznete ve svém seznamu výstav.";
        text = text.replace("{userName}", byUser.getEmail());
        text = text.replace("{name}", exposition.getTitle());
        sendMessage(text, subject, toNotify.getEmail());
    }

    public void notifyAddedToCollaborateNotInSystem(String email, User byUser, Exposition exposition) {
        String subject = "INDIHU Virtuální výstavy - Přidání ke spolupráci na přípravě výstavy";
        String text = "Byl jste v aplikaci INDIHU Virtuální výstavy uživatelem {userName}, který je autorem výstavy {name}, přidán k spolupráci na její přípravě. Registrovat se můžete na " + url;
        text = text.replace("{userName}", byUser.getEmail());
        text = text.replace("{name}", exposition.getTitle());
        sendMessage(text, subject, email);
    }

    public void notifyRemovedFromCollaboration(String toNotify, User byUser, Exposition exposition) {
        String subject = "INDIHU Virtuální výstavy - Vyloučení ze spolupráce na přípravě výstavy";
        String text = "Byl jste v aplikaci INDIHU Virtuální výstavy uživatelem {userName}, který je autorem výstavy {name}, odebrán ze spolupráce na její přípravě.";
        text = text.replace("{userName}", byUser.getEmail());
        text = text.replace("{name}", exposition.getTitle());
        sendMessage(text, subject, toNotify);
    }

    public void notifyAccepted(String toNotify) {
        String subject = "Registrace do aplikace INDIHU Virtuální výstavy";
        String text = "Vaše registrace do aplikace INDIHU Virtuální výstavy byla schválena administrátorem. Nyní se můžete přihlásit do aplikace.";
        sendMessage(text, subject, toNotify);
    }

    public void notifyNewRegistration(Registration registration) {
        String subject = "Registrace do aplikace INDIHU Virtuální výstavy";
        String text = "Vaše registrace do aplikace INDIHU Virtuální výstavy byla úspěšná a nyní čeká na schválení administrátorem. O její schválení Vás budeme informovat.";
        sendMessage(text, subject, registration.getToAccept().getEmail());
        notifyAdmins("V aplikaci INDIHU Virtuální výstavy byla vytvořená nová registrace a čeká na schválení administrátorem: " + registration.getId(), "INDIHU Virtuální výstavy - Nová registrace ke schválení");
    }

    public void notifyPasswordReset(User user, String password) {
        String subject = "Reset hesla do aplikace INDIHU Virtuální výstavy";
        String text = "Požádali jste o reset hesla do aplikace INDIHU Virtuální výstavy. " + '\n'
                + "Vaše prihlasovací jméno: " + user.getUserName() + '\n'
                + "Vaše nové heslo je: " + password + '\n' +
                "Doporučujeme toto heslo změnit v nastavení uživatelského účtu.";
        sendMessage(text, subject, user.getEmail());
    }

    public void notifyReactivated(String userEmail) {
        String text = "Váš účet v aplikaci INDIHU Virtuální výstavy byl znovu aktivován poté, co byl v minulosti deaktivovaný.";
        String subject = "Znovuaktivace účtu v aplikaci INDIHU Virtuální výstavy";
        sendMessage(text, subject, userEmail);
    }

    public void notifyDeletedByAdmin(String userEmail) {
        String text = "Váš účet v aplikaci INDIHU Virtuální výstavy byl deaktivován administrátorem.";
        String subject = "Deaktivace účtu v aplikaci INDIHU Virtuální výstavy";
        sendMessage(text, subject, userEmail);
    }

    public void notifyDeleted(String userEmail) {
        String text = "Váš účet v aplikaci INDIHU Virtuální výstavy byl deaktivován.";
        String subject = "Deaktivace účtu v aplikaci INDIHU Virtuální výstavy";
        sendMessage(text, subject, userEmail);
    }

    public void notifyMovedExposition(String oldOwner, String newOwner, Exposition exposition) {
        String text = "Váše výstava " + exposition.getTitle() + " byla presunuta na: " + newOwner;
        String subject = "Přesun výstavy";
        sendMessage(text, subject, oldOwner);
        text = "Byl jste přirazen ako vlastník na výstavu s názvem: " + exposition.getTitle();
        sendMessage(text, subject, newOwner);
    }

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
        message.setTo(adminMails.toArray(new String[adminMails.size()]));
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    public void verifyEmail(Registration registration) {
        String text = "Prosíme oveřte svůj email kliknutím na: " + url + "verify/" + registration.getSecret();
        String subject = "Oveření emailu";
        sendMessage(text, subject, registration.getToAccept().getEmail());
    }

    public void notifyLdapReset(String email) {
        String text = "Reset hesla sa nezdařil nakolik je účet veden v LDAP serveru.";
        String subject = "Reset hesla";
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
