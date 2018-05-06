package cz.inqool.uas.indihu.entity.dto;

import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Created by Michal on 21. 7. 2017.
 */
@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class ExpositionDto {

    private String id;

    private String title;

    private String url;

    private String authorUsername;

    private boolean inProgress;

    private boolean canEdit;

    private boolean canDelete;

    private Instant lastEdit;

    private Instant created;

    private String isEditing;

    private ExpositionState state;

    private boolean isPinned;

    private Instant pinnedAt;

    private Double rating;

    private Long ratingCount;

    private Long messageCount;

    private Long viewCount;

    private Preferences preferences;
}
