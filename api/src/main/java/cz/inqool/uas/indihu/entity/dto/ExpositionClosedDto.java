package cz.inqool.uas.indihu.entity.dto;

import cz.inqool.uas.indihu.entity.domain.Collaborator;
import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import cz.inqool.uas.indihu.entity.enums.IndihuTag;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ExpositionClosedDto {

    private String id;

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

    /**
     * structure string
     */
    private String structure;

    /**
     * State of exposition
     */
    private ExpositionState state;

    /**
     * Collaborators on exposition
     */
    private Set<Collaborator> collaborators;

    /**
     * Tags on exposition
     */
    private Set<IndihuTag> tags;

    /**
     * Exposition design data
     */
    private ExpositionDesignDataDto expositionDesignData;
}
