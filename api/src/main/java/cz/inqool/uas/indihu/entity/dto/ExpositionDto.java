package cz.inqool.uas.indihu.entity.dto;

import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Created by Michal on 21. 7. 2017.
 */
@Getter
@Setter
public class ExpositionDto {

    private String id;

    private String title;

    private String url;

    private boolean inProgress;

    private boolean canEdit;

    private boolean canDelete;

    private Instant lastEdit;

    private Instant created;

    private String isEditing;

    private ExpositionState state;

}
