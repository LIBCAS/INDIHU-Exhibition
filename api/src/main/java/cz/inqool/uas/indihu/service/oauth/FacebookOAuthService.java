package cz.inqool.uas.indihu.service.oauth;

import cz.inqool.uas.indihu.security.oauth.CommonProfile;
import cz.inqool.uas.indihu.security.oauth.OAuthConfigDto;
import cz.inqool.uas.indihu.security.oauth.OAuthProfileDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;

@Component
@ConditionalOnProperty("oauth.facebook.enabled")
public class FacebookOAuthService extends AbstractOAuthService<CommonProfile> {

    @Autowired
    public FacebookOAuthService(@Qualifier("facebookConfig") OAuthConfigDto oAuthConfig) {
        super(oAuthConfig, CommonProfile.class);
    }

    @Override
    public OAuthProfileDetails getUserProfile(String code) {
        String url = oAuthConfig.getUserPath() + "&access_token=" + code;

        try {
            ResponseEntity<CommonProfile> responseEntity = restTemplate.exchange(url, HttpMethod.GET, HttpEntity.EMPTY, profileClass);
            return responseEntity.getBody();
        } catch (RestClientException e) {
            throw new OAuthLoginException(OAuthLoginException.ErrorCode.BAD_REQUEST, "Getting profile details failed: " + e.getMessage(), e);
        }
    }
}
