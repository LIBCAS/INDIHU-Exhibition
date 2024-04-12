package cz.inqool.uas.indihu.service.oauth;

import cz.inqool.uas.indihu.security.oauth.OAuthConfigDto;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OAuthServicesConfiguration {

    @Bean
    @ConfigurationProperties(prefix = "oauth.facebook")
    @ConditionalOnExpression("${oauth.facebook.enabled:false}")
    public OAuthConfigDto facebookConfig() {
        return new OAuthConfigDto();
    }

    @Bean
    @ConfigurationProperties(prefix = "oauth.google")
    @ConditionalOnExpression("${oauth.google.enabled:false}")
    public OAuthConfigDto googleConfig() {
        return new OAuthConfigDto();
    }
    @Bean
    @ConfigurationProperties(prefix = "oauth.orcid")
    @ConditionalOnExpression("${oauth.orcid.enabled:false}")
    public OAuthConfigDto orcidConfig() {
        return new OAuthConfigDto();
    }

    @Bean
    @ConfigurationProperties(prefix = "oauth.github")
    @ConditionalOnExpression("${oauth.github.enabled:false}")
    public OAuthConfigDto githubConfig() {
        return new OAuthConfigDto();
    }
}
