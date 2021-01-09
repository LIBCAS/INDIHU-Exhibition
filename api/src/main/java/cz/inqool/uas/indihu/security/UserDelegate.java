package cz.inqool.uas.indihu.security;

import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.enums.UserState;
import cz.inqool.uas.security.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Michal on 19. 7. 2017.
 */
public class UserDelegate implements UserDetails {

    private User user;

    private Set<GrantedAuthority> authorities = new HashSet<>();

    public UserDelegate(User user) {
        this(user, null);
    }

    public UserDelegate(User user, Collection<? extends GrantedAuthority> additionalAuthorities) {
        this.user = user;

        authorities.add(new SimpleGrantedAuthority("ROLE_EDITOR"));
        if (user.getRole().equals(UserRole.ROLE_ADMIN)) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        if (additionalAuthorities != null) {
            authorities.addAll(additionalAuthorities);
        }

    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getId() {
        if (user != null) {
            return user.getId();
        }
        return null;
    }

    @Override
    public String getUsername() {
        if (user != null) {
            return user.getUserName();
        }
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getState().equals(UserState.ACCEPTED);
    }
}
