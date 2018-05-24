package cz.inqool.uas.indihu.entity.dto;

import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//currently not in use
public class ExpositionEndedDto {

    /**
     * url to redirect to after exposition is in state ended
     */
    private String closedUrl;

    /**
     * picture for after exposition is in state ended
     */
    private String closedPicture;

    /**
     * caption fo after exposition is in state ended
     */
    private String closedCaption;

    private ExpositionState state;
}
