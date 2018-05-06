package cz.inqool.uas.indihu.service.oauth;

import cz.inqool.uas.indihu.security.oauth.OAuthProfileDetails;

/**
 * Interface for AuthN using OAuth2.0
 */
public interface OAuthService {

    /**
     * Method impl should retrieve access token from IdP
     *
     * @param code authorization code from IdP
     * @return access token from IdP
     */
    String getAccessToken(String code);

    /**
     * Method impl should retrieve user details using access token
     *
     * @param accessToken obtained from IdP
     * @return user profile details
     */
    OAuthProfileDetails getUserProfile(String accessToken);

    /**
     * Method to determine if implementor supports provider with certain name
     *
     * @param providerName name of provider
     * @return true if it is supported
     */
    boolean supports(String providerName);
}
