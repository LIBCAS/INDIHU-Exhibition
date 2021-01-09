package cz.inqool.uas.indihu.entity.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import cz.inqool.uas.domain.DomainObject;
import cz.inqool.uas.indihu.entity.serializer.SimpleUserSerializer;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.time.Instant;

/**
 * Created by Michal on 18. 7. 2017.
 */
@Getter
@Setter
@Entity
@Table(name = "in_exposition_opening")
@NoArgsConstructor
//currently not in use
public class ExpositionOpening extends DomainObject {

    private Instant opening;

    @OneToOne
    private Exposition exposition;

    @ManyToOne
    @JsonSerialize(using = SimpleUserSerializer.class)
    private User author;
}
