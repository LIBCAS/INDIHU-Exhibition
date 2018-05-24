package cz.inqool.uas.indihu.security.provider;

import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.repository.UserRepository;
import cz.inqool.uas.indihu.security.service.BasicDetailsService;
import cz.inqool.uas.indihu.security.service.LdapCredentialsHandler;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.inject.Inject;

/**
 * Created by Michal on 24. 7. 2017.
 */
@Component
public class IndihuAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {

    private UserRepository userRepository;

    private BasicDetailsService detailService;

    private LdapCredentialsHandler handler;

    private PasswordEncoder passwordEncoder;

    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {

    }

    @Override
    protected UserDetails retrieveUser(String username, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
        User user = userRepository.findByLogin(username);
        if (user != null) {
            if (user.getDeleted() == null) {
                if (user.isLdapUser()) {
                    User found = handler.validateCredential(username, authentication.getCredentials().toString(), user);
                    if (found != null) {
                        return detailService.loadUserById(user.getId());
                    }
                } else {
                    if (user.isAccepted()) {
                        if (passwordEncoder.matches(authentication.getCredentials().toString(), user.getPassword())) {
                            return detailService.loadUserById(user.getId());
                        }
                    }

                }
            }
        } else {
            //overenie noveho v ldape
            User found = handler.validateCredential(username, authentication.getCredentials().toString(), null);
            if (found != null) {

                return detailService.loadUserById(found.getId());
            }

        }
        throw new UsernameNotFoundException(username);
    }

    @Inject
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Inject
    public void setDetailService(BasicDetailsService detailService) {
        this.detailService = detailService;
    }

    @Inject
    public void setHandler(LdapCredentialsHandler handler) {
        this.handler = handler;
    }

    @Inject
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

}
