package cz.inqool.uas.indihu.entity.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import cz.inqool.uas.domain.DatedObject;
import cz.inqool.uas.indihu.entity.dto.ExpoFile;
import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import cz.inqool.uas.indihu.entity.enums.IndihuTag;
import cz.inqool.uas.indihu.entity.serializer.IndihuTagConverter;
import cz.inqool.uas.indihu.entity.serializer.SimpleUserSerializer;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

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
public class Exposition extends DatedObject{

    /**
     * user account of author
     */
    @OneToOne(fetch = FetchType.EAGER)
    @JsonSerialize(using = SimpleUserSerializer.class)
    private User author;

    /**
     * Set of {@link Collaborator} for exposition
     */
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "exposition", fetch = FetchType.EAGER)
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
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "exposition", fetch = FetchType.EAGER)
    private Set<ExpositionUrl> urls;

    //could be deleted, currently not in use
    @OneToOne(cascade = CascadeType.REMOVE, mappedBy = "exposition",fetch = FetchType.EAGER)
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

    /**
     * Tags for exposition, saved in a single large string
     */
    @Convert(converter = IndihuTagConverter.class)
    private Set<IndihuTag> tags;

    /**
     * Exposition rating entity
     */
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "exposition_rating_id", referencedColumnName = "id")
    private ExpositionRating expositionRating;

    @BatchSize(size = 100)
    @Fetch(FetchMode.SELECT)
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "exposition")
    private List<Message> messages;

    /**
     * Exposition design data
     */
    @Embedded
    private ExpositionDesignData expositionDesignData;

    /**
     * Count of views on exposition
     */
    private Long viewCounter = 0L;

    /**
     * Instant of last administration of exposition
     */
    private Instant lastEdit;
}
