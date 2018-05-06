package cz.inqool.uas.indihu.security;

import cz.inqool.uas.indihu.entity.domain.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import static cz.inqool.uas.util.Utils.unwrap;

@Configuration
public class UserProducer {
    @Bean
    @Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
    public UserDelegate userDelegate() {
        Object principal = null;

        SecurityContext context = SecurityContextHolder.getContext();
        if (context != null) {
            Authentication authentication = context.getAuthentication();

            if (authentication != null) {
                principal = authentication.getPrincipal();
            }
        }

        if (principal instanceof UserDelegate) {
            return (UserDelegate) principal;
        } else {
            return null;
        }
    }

    @Bean
    @Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
    public User user(UserDelegate delegate) {
        UserDelegate unwrapped = unwrap(delegate);

        return unwrapped != null ? unwrapped.getUser() : null;
    }
}
