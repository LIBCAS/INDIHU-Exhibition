package cz.inqool.uas.indihu.security.service;

import com.unboundid.ldap.sdk.*;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;

/**
 * Created by Michal on 25. 7. 2017.
 */
@Service
public class LdapCredentialsHandler {

    @Value("${security.ldap.enabled:false}")
    private boolean enabled;

    @Value("${security.ldap.hostname}")
    private String endpoint;

    @Value("${security.ldap.port}")
    private Integer port;

    @Value("${security.ldap.bind.dn}")
    private String dn;

    @Value("${security.ldap.bind.pwd}")
    private String pwd;

    @Value("${security.ldap.user.filter}")
    private String filterString ;

    @Value("${security.ldap.user.search-base}")
    private String usersDn;

    @Value("${security.ldap.server}")
    private String orgDn;

    private UserRepository userRepository;

    private String[] attrIDs = { "sn", "mail", "givenName", "o" };

    /**
     * checks if user is in ldap server
     */
    public boolean exists(String userName){
        if (!enabled) {
            return false;
        }

        LDAPConnection searchConnection;
        try {
            Filter filter = Filter.create(filterString.replace("{0}", userName));

            SearchRequest searchRequest = new SearchRequest(usersDn, SearchScope.SUB, filter, attrIDs);
            searchConnection = createSearchConnection(endpoint, port, dn, pwd);
            SearchResult searchResult = searchConnection.search(searchRequest);

            if (searchResult.getEntryCount() >0) {
                return true;
            }
            return false;
        } catch (LDAPException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * verifies user in ldap
     */
    @Transactional
    public User validateCredential(String userName, String password, User user) {
        if (!enabled) {
            return null;
        }

        LDAPConnection connection = null;
        LDAPConnection searchConnection = null;
        User result = null;

        try {
            Filter filter = Filter.create(filterString.replace("{0}", userName));

            SearchRequest searchRequest = new SearchRequest(usersDn, SearchScope.SUB, filter, attrIDs);
            searchConnection = createSearchConnection(endpoint, port, dn, pwd);
            SearchResult searchResult = searchConnection.search(searchRequest);


            if (searchResult.getEntryCount() == 1) {
                SearchResultEntry entry = searchResult.getSearchEntries().get(0);

                //Verify password
                connection = new LDAPConnection();
                connection.connect(endpoint, port);
                if (connection.bind(entry.getDN(), password).getResultCode() == ResultCode.SUCCESS) {

                    if(user==null){
                        user = new User();
                        user.setAccepted(true);
                        user.setLdapUser(true);
                        user.setUserName(userName);
                        user.setRole(UserRole.ROLE_EDITOR);
                        user.setFirstName(entry.getAttributeValue("givenName"));
                        user.setSurname(entry.getAttributeValue("sn"));
                        user.setInstitution(entry.getAttributeValue("o"));
                        user.setEmail(entry.getAttributeValue("mail"));
                        user = userRepository.save(user);
                    }
                    result = user;
                }
            }
        } catch (LDAPException ex) {
            result = null;
        } finally {
            if (searchConnection != null) {
                searchConnection.close();
            }

            if (connection != null) {
                connection.close();
            }
        }
        return result;
    }

    private LDAPConnection createSearchConnection(String hostname, int port, String bindDN, String bindPassword) throws LDAPException{

        LDAPConnection searchConnection = new LDAPConnection(hostname, port);
        if (bindDN != null) {
            BindResult result = searchConnection.bind(bindDN, bindPassword);

            if (result.getResultCode() != ResultCode.SUCCESS) {
                throw new SecurityException("Failed to authenticate connection to ldap.");
            }
        }

        return searchConnection;
    }

    @Inject
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
