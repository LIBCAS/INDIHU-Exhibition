package cz.inqool.uas.indihu.service.oauth;

import cz.inqool.uas.indihu.security.oauth.OAuthConfigDto;
import cz.inqool.uas.indihu.security.oauth.OAuthProfileDetails;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

public abstract class AbstractOAuthService<T extends OAuthProfileDetails> implements OAuthService {

    protected final RestTemplate restTemplate = new RestTemplate();

    protected final OAuthConfigDto oAuthConfig;

    protected final Class<T> profileClass;

    public AbstractOAuthService(OAuthConfigDto oAuthConfig, Class<T> profileClass) {
        this.oAuthConfig = oAuthConfig;
        this.profileClass = profileClass;
    }

    public String getAccessToken(String code) {
        String url = oAuthConfig.getTokenPath() +
                "&client_id={client_id}" +
                "&client_secret={clientSecret}" +
                "&redirect_uri={redirectUri}" +
                "&code={code}";

        try {
           String accessToken = fetchAccessToken(url, code);

            if (accessToken != null && !accessToken.isEmpty()) {
                return accessToken;
            } else {
                throw new OAuthLoginException(OAuthLoginException.ErrorCode.NO_ACCESS_TOKEN, "No access token returned");
            }
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to get user access token, " + e.getMessage(), e);
        }
    }

    protected String fetchAccessToken(String url, String code) {
        ResponseEntity<AccessTokenDto> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.POST,
                HttpEntity.EMPTY,
                AccessTokenDto.class,
                oAuthConfig.getClientId(),
                oAuthConfig.getClientSecret(),
                oAuthConfig.getRedirectUrl(),
                code);


        AccessTokenDto responseBody = responseEntity.getBody();
        return responseBody.getAccessToken();
    }

    @Override
    public OAuthProfileDetails getUserProfile(String accessToken) {
        String url = oAuthConfig.getUserPath();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> http = new HttpEntity<>(httpHeaders);

        try {
            ResponseEntity<T> responseEntity = restTemplate.exchange(url, HttpMethod.GET, http, profileClass);
            return responseEntity.getBody();
        } catch (RestClientException e) {
            throw new OAuthLoginException(OAuthLoginException.ErrorCode.BAD_REQUEST, "Getting profile details failed: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean supports(String providerName) {
        return oAuthConfig.getProviderName().equals(providerName);
    }
}
