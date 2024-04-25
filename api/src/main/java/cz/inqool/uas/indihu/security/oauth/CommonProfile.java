package cz.inqool.uas.indihu.security.oauth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommonProfile implements OAuthProfileDetails {

    private String id;

    private String name;

    private String email;

    @Override
    public String getUsername() {
        return name;
    }
}
