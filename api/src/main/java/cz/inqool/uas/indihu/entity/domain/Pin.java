package cz.inqool.uas.indihu.entity.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import cz.inqool.uas.domain.DomainObject;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.Instant;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "in_pin")
public class Pin extends DomainObject {

    public Pin(User user, Exposition exposition) {
        pinnedAt = Instant.now();
        this.user = user;
        this.exposition = exposition;
    }

    private Instant pinnedAt;

    @JsonBackReference
    @ManyToOne
    private User user;

    @ManyToOne
    @JsonBackReference
    private Exposition exposition;
}
