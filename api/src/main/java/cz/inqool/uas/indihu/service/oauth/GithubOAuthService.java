package cz.inqool.uas.indihu.service.oauth;

import cz.inqool.uas.indihu.security.oauth.CommonProfile;
import cz.inqool.uas.indihu.security.oauth.OAuthConfigDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty("oauth.github.enabled")
public class GithubOAuthService extends AbstractOAuthService<CommonProfile> {

    @Autowired
    public GithubOAuthService(@Qualifier("githubConfig") OAuthConfigDto oAuthConfig) {
        super(oAuthConfig, CommonProfile.class);
    }

    @Override
    protected String fetchAccessToken(String url, String code) {
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.POST,
                HttpEntity.EMPTY,
                String.class,
                oAuthConfig.getClientId(),
                oAuthConfig.getClientSecret(),
                oAuthConfig.getRedirectUrl(),
                code);

        String responseBody = responseEntity.getBody();
        return parseAccessToken(responseBody);
    }

    private String parseAccessToken(String responseBody) {
        String[] parts = responseBody.split("&");
        for (String part : parts) {
            String[] keyValue = part.split("=");
            if (keyValue.length == 2 && "access_token".equals(keyValue[0])) {
                return keyValue[1];
            }
        }
        return null;
    }
}
