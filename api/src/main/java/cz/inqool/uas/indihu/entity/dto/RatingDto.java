package cz.inqool.uas.indihu.entity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;

/**
 * Dto for rating expositions
 */
@Getter
@Setter
public class RatingDto {

    private Preferences preferences = new Preferences();

    @Range(min = 0, max = 5)
    private Double rating;

    private String text;

    @JsonProperty("isSendWithoutRating")
    private boolean isSendWithoutRating;

    private String reviewerContactEmail;
}
