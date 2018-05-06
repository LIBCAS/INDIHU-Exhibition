package cz.inqool.uas.indihu.security.oauth;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class OrcIdProfile implements OAuthProfileDetails {

    private String orcid;

    private String name;

    private String email;

    @JsonProperty("name")
    public void unpackName(Map<String, Object> nameProp) {
        this.name = (String) nameProp.get("given-names");
    }

    @JsonProperty("emails")
    public void unpackEmail(List<Map<String, Object>> emails) {
        for (Map<String, Object> emailMap : emails) {
            Boolean primary = (Boolean) emailMap.get("primary");
            if (primary != null && primary) {
                this.email = (String) emailMap.get("email");
                break;
            }
        }
    }
    @Override
    public String getUsername() {
        return name;
    }

    @Override
    public String getEmail() {
        return email;
    }
}
