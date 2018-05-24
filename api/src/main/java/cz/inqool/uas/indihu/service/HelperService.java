package cz.inqool.uas.indihu.service;

import cz.inqool.uas.indihu.entity.domain.Collaborator;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.repository.CollaboratorRepository;
import cz.inqool.uas.indihu.security.UserDelegate;
import cz.inqool.uas.indihu.security.jwt.IndihuJwtHandler;
import cz.inqool.uas.security.jwt.JwtToken;
import cz.inqool.uas.security.jwt.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Michal on 24. 7. 2017.
 */
@Component
public class HelperService {

    private static final String AUTHENTICATION_SCHEME_NAME = "Bearer";

    private CollaboratorRepository collaboratorRepository;

    private JwtTokenProvider provider;

    /**
     * extracts current logged in user with user detail
     *
     * @return {@link UserDelegate} of current user
     */
    public UserDelegate getDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && !(authentication instanceof AnonymousAuthenticationToken)) {
            return (UserDelegate) authentication.getPrincipal();
        }
        return null;
    }

    /**
     * @return current loged in user
     */
    public User getCurrent() {
        return getDetails() != null ? getDetails().getUser() : null;
    }

    /**
     * Updates current logged in user
     *
     * @param user to update to
     */
    public void setCurrent(User user) {
        if (getDetails() != null) {
            getDetails().setUser(user);
        }
    }

    /**
     * logs in given user
     */
    public void loggIn(User user, HttpServletResponse response) {
        UserDelegate userDelegate = new UserDelegate(user, null);
        String token = provider.generateToken(userDelegate);

        response.addHeader(AUTHENTICATION_SCHEME_NAME, token);
    }

    /**
     * method to check wether current user is either author or as collaborator in exposition
     *
     * @param exposition
     * @return boolean
     */
    public boolean isAssociated(Exposition exposition) {
        if (exposition.getAuthor().equals(getCurrent())) {
            return true;
        }
        Collaborator collaborator = collaboratorRepository.findExpositionCollaborator(getCurrent().getId(), exposition.getId());
        if (collaborator != null) {
            return true;
        }
        return false;
    }

    public boolean isAdmin() {
        User current = getCurrent();
        if (current != null) {
            return current.getRole().equals(UserRole.ROLE_ADMIN);
        }
        return false;
    }

    @Inject
    public void setCollaboratorRepository(CollaboratorRepository collaboratorRepository) {
        this.collaboratorRepository = collaboratorRepository;
    }

    @Inject
    public void setProvider(JwtTokenProvider provider) {
        this.provider = provider;
    }
}
