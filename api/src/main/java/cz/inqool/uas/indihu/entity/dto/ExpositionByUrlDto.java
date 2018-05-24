package cz.inqool.uas.indihu.entity.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.serializer.SimpleUserSerializer;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpositionByUrlDto extends ExpositionEndedDto {

    @JsonSerialize(using = SimpleUserSerializer.class)
    private User author;

    /**
     * title of exposition
     */
    private String title;

    /**
     * last set url for exposition
     */
    private String url;

    //serializer string
    private String structure;

    /**
     * name of organization which own an exposition
     */
    private String organization;
}
