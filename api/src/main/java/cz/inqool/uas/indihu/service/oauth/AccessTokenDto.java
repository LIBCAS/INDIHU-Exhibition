package cz.inqool.uas.indihu.service.oauth;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccessTokenDto {

    private String accessToken;

    @JsonProperty("access_token")
    public void unpackToken(String accessToken) {
        this.accessToken = accessToken;
    }
}