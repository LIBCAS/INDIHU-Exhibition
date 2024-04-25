package cz.inqool.uas.indihu.service;

import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.repository.UserRepository;
import cz.inqool.uas.indihu.security.UserDelegate;
import cz.inqool.uas.security.ldap.authorities.OtherAuthoritiesPopulator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.ldap.search.LdapUserSearch;
import org.springframework.security.ldap.userdetails.InetOrgPerson;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.Collection;

import static cz.inqool.uas.util.Utils.asObjectArray;
import static jdk.nashorn.internal.runtime.JSType.isNumber;
import static jdk.nashorn.internal.runtime.JSType.toDouble;

/**
 * Created by Michal on 20. 7. 2017.
 */
@Service
@Slf4j
public class IndihuService {

    private UserRepository userRepository;

    public UserDelegate findUser(String id) {
       UserDelegate delegate = new UserDelegate(userRepository.find(id));
       return delegate;
    }

    @Inject
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
