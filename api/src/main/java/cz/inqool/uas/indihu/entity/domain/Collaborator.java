package cz.inqool.uas.indihu.entity.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import cz.inqool.uas.domain.DomainObject;
import cz.inqool.uas.indihu.entity.enums.CollaborationType;
import cz.inqool.uas.indihu.entity.serializer.SimpleUserSerializer;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Fetch;

import javax.persistence.*;
import java.time.Instant;

/**
 * Created by Michal on 18. 7. 2017.
 */
@Entity
@Getter
@Setter
@Table(name = "in_collaborator")
public class Collaborator extends DomainObject{

    /**
     * user email of collaborator for notifications
     */
    private String userEmail;

    /**
     * user account of collaborator
     */
    @ManyToOne
    @JsonSerialize(using = SimpleUserSerializer.class)
    private User collaborator;

    /**
     * exposition for collaboration
     */
    @ManyToOne
    @JsonIgnore
    private Exposition exposition;

    /**
     * type of collaboration, possible states see {@link CollaborationType}
     */
    @Enumerated(EnumType.STRING)
    private CollaborationType collaborationType;

    /**
     * timestamp about when the collaboration started
     */
    private Instant since;
}
