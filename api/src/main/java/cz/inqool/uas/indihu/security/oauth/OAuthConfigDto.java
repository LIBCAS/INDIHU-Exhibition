package cz.inqool.uas.indihu.security.oauth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class OAuthConfigDto {

    @NotNull
    private String providerName;

    @NotNull
    private String loginPath;

    @JsonIgnore
    @NotNull
    private String tokenPath;

    @JsonIgnore
    @NotNull
    private String userPath;

    @NotNull
    private String clientId;

    @JsonIgnore
    @NotNull
    private String clientSecret;

    @NotNull
    private String redirectUrl;
}