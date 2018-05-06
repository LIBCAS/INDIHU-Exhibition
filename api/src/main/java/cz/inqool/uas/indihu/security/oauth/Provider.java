package cz.inqool.uas.indihu.security.oauth;

import lombok.Getter;

@Getter
public enum Provider {

    GITHUB("GitHub", CommonProfile.class),
    FACEBOOK("Facebook", CommonProfile.class),
    GOOGLE("Google", CommonProfile.class),
    ORCID("OrcId", OrcIdProfile.class);

    Provider(String providerName, Class<? extends OAuthProfileDetails> profileClass) {
        this.providerName = providerName;
        this.profileClass = profileClass;
    }

    private final String providerName;

    private final Class<? extends OAuthProfileDetails> profileClass;
}
