package cz.inqool.uas.indihu.security.service;

import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.security.UserDelegate;
import cz.inqool.uas.indihu.service.IndihuService;
import cz.inqool.uas.security.UserDetails;
import cz.inqool.uas.security.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 * Created by Michal on 20. 7. 2017.
 */
@Service
public class BasicDetailsService implements UserDetailsService {

    private IndihuService service;

    @Override
    public UserDetails loadUserById(String id) {
        return service.findUser(id);
    }

    @Override
    public UserDetails loadUserByUsername(String dn) throws UsernameNotFoundException {
        return service.findUser(dn);
    }


    public UserDetails loadUser(User user){
        if (user != null) {
            return new UserDelegate(user);
        } else {
            throw new UsernameNotFoundException(user.getEmail());
        }
    }

    @Inject
    public void setService(IndihuService service) {
        this.service = service;
    }
}
