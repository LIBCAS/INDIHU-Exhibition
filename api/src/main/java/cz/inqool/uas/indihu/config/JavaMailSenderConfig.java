package cz.inqool.uas.indihu.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Slf4j
@Configuration
public class JavaMailSenderConfig {

    private String host;
    private int port;
    private String username;
    private String password;
    private String protocol;
    private boolean smtpAuth;
    private boolean starttls;
    private boolean debug;

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);

        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", protocol);
        props.put("mail.smtp.auth", smtpAuth);
        props.put("mail.smtp.starttls.enable", starttls);
        props.put("mail.debug", debug);

        return mailSender;
    }

    @Autowired
    public void setHost(@Value("${indihu.notification.server.host:smtp.gmail.com}") String host) {
        this.host = host;
    }

    @Autowired
    public void setPort(@Value("${indihu.notification.server.port:465}") int port) {
        this.port = port;
    }

    @Autowired
    public void setUsername(@Value("${indihu.notification.server.username:noreply.indihu@gmail.com}") String username) {
        this.username = username;
    }

    @Autowired
    public void setPassword(@Value("${indihu.notification.server.password:echelon48}") String password) {
        this.password = password;
    }

    @Autowired
    public void setProtocol(@Value("${mzp.notification.server.protocol:smtp}") String protocol) {
        this.protocol = protocol;
    }

    @Autowired
    public void setSmtpAuth(@Value("${mzp.notification.server.smtpAuth:true}") boolean smtpAuth) {
        this.smtpAuth = smtpAuth;
    }

    @Autowired
    public void setStarttls(@Value("${mzp.notification.server.starttls:true}") boolean starttls) {
        this.starttls = starttls;
    }

    @Autowired
    public void setDebug(@Value("${mzp.notification.server.debug:false}") boolean debug) {
        this.debug = debug;
    }
}