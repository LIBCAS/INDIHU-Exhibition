package cz.inqool.uas.indihu.entity.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import cz.inqool.uas.domain.DatedObject;
import cz.inqool.uas.indihu.entity.dto.ExpoFile;
import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import cz.inqool.uas.indihu.entity.serializer.SimpleUserSerializer;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.Instant;
import java.util.List;
import java.util.Set;

/**
 * Created by Michal on 18. 7. 2017.
 */
@Entity
@Getter
@Setter
@Table(name = "in_exposition")
@NoArgsConstructor
public class Exposition extends DatedObject {

    /**
     * user account of author
     */
    @OneToOne(fetch = FetchType.EAGER)
    @JsonSerialize(using = SimpleUserSerializer.class)
    private User author;

    /**
     * Set of {@link Collaborator} for exposition
     */
    @OneToMany(mappedBy = "exposition", fetch = FetchType.EAGER)
    private Set<Collaborator> collaborators;

    /**
     * title of exposition
     */
    private String title;

    /**
     * subtitle for exposition
     */
    private String subTitle;

    /**
     * perex of exposition
     */
    private String perex;

    /**
     * last set url for exposition
     */
    private String url;

    /**
     * previous urls for exposition under which exposition is reachable
     */
    @OneToMany(mappedBy = "exposition", fetch = FetchType.EAGER)
    private Set<ExpositionUrl> urls;

    //could be deleted, currently not in use
    @OneToOne(mappedBy = "exposition", fetch = FetchType.EAGER)
    private ExpositionOpening opening;

    /**
     * time to end exposition, currently not in use
     */
    private Instant expositionEnd;

    //serializer string
    private String structure;

    /**
     * {@link ExpositionState} enum of state of exposition
     */
    @Enumerated(EnumType.STRING)
    private ExpositionState state;

    /**
     * username of person that last edited exposition
     */
    private String isEditing;

    /**
     * files for exposition
     */
    @Transient
    private List<ExpoFile> expoFiles;

    /**
     * name of organization which own an exposition
     */
    private String organization;

    /**
     * url to redirect to after exposition is in state ended
     */
    private String closedUrl;

    /**
     * picture for after exposition is in state ended
     */
    private String closedPicture;

    /**
     * caption for after exposition is in state ended
     */
    private String closedCaption;

    /**
     * picture for preview in shared links
     */
    private String previewPicture;
}
