package cz.inqool.uas.indihu.security.jwt;

import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.repository.UserRepository;
import cz.inqool.uas.indihu.security.UserDelegate;
import cz.inqool.uas.indihu.service.IndihuService;
import cz.inqool.uas.security.UserDetails;
import cz.inqool.uas.security.jwt.spi.JwtHandler;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Collections.emptyMap;

/**
 * Created by Michal on 19. 7. 2017.
 */
@Service
public class IndihuJwtHandler implements JwtHandler {

    private IndihuService service;

    private UserRepository userRepository;

    /**
     * parses user from jwt token
     */
    @Override
    public UserDetails parseClaims(Map<String, Object> claims) {
        String userId = (String) claims.get("sub");
        @SuppressWarnings("unchecked") ArrayList<String> authorityNames = (ArrayList<String>) claims.get("aut");

        Set<GrantedAuthority> authorities = null;
        if (authorityNames != null) {
            authorities = authorityNames.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toSet());
        }

        UserDetails user = service.findUser(userId);
        if (user != null) {
            return user;
        }

        return null;
    }

    /**
     * creates claims for jwt token
     */
    @Override
    public Map<String, Object> createClaims(UserDetails userDetails) {
        if (userDetails instanceof UserDelegate) {
            UserDelegate delegate = (UserDelegate) userDetails;
            User user = delegate.getUser();

            Map<String, Object> claims = new LinkedHashMap<>();
            claims.put("sub", ((UserDelegate) userDetails).getUser().getId());
            claims.put("email", user.getEmail());
            claims.put("userName", user.getUserName());


            Collection<GrantedAuthority> authorities = delegate.getAuthorities();
            if (authorities != null) {
                String[] authorityNames = authorities.stream()
                        .map(GrantedAuthority::getAuthority)
                        .toArray(String[]::new);
                claims.put("aut", authorityNames);
            }

            return claims;
        } else {
            return emptyMap();
        }
    }

    @Inject
    public void setService(IndihuService service) {
        this.service = service;
    }

    @Inject
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
