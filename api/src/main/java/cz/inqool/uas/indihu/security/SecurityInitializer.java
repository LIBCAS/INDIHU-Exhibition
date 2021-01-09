package cz.inqool.uas.indihu.security;

import cz.inqool.uas.audit.AuditLogger;
import cz.inqool.uas.indihu.security.provider.IndihuAuthenticationProvider;
import cz.inqool.uas.security.BaseSecurityInitializer;
import cz.inqool.uas.security.basic.BasicAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;

import javax.inject.Inject;
import javax.servlet.Filter;

import static cz.inqool.uas.util.Utils.asArray;

/**
 * Created by Michal on 19. 7. 2017.
 */
@Slf4j
@Configuration
public class SecurityInitializer extends BaseSecurityInitializer {

    private AuditLogger auditLogger;

    private IndihuAuthenticationProvider indihuAuthenticationProvider;

    @Override
    protected AuthenticationProvider[] primaryAuthProviders() {
        return asArray(indihuAuthenticationProvider);
    }

    @Override
    protected Filter[] primarySchemeFilters() throws Exception {
        return asArray(new BasicAuthenticationFilter(authenticationManager(), auditLogger));
    }

    @Inject
    public void setAuditLogger(AuditLogger auditLogger) {
        this.auditLogger = auditLogger;
    }

    @Inject
    public void setIndihuAuthenticationProvider(IndihuAuthenticationProvider indihuAuthenticationProvider) {
        this.indihuAuthenticationProvider = indihuAuthenticationProvider;
    }

}
