package cz.inqool.uas.indihu.service.oauth;

import cz.inqool.uas.indihu.security.oauth.CommonProfile;
import cz.inqool.uas.indihu.security.oauth.OAuthConfigDto;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;


@Component
@ConditionalOnProperty("oauth.google.enabled")
public class GoogleOAuthService extends AbstractOAuthService<CommonProfile> {

    public GoogleOAuthService(@Qualifier("googleConfig") OAuthConfigDto oAuthConfig) {
        super(oAuthConfig, CommonProfile.class);
    }
}
