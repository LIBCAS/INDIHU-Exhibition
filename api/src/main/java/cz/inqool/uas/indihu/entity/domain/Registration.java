package cz.inqool.uas.indihu.entity.domain;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import cz.inqool.uas.domain.DomainObject;
import cz.inqool.uas.indihu.entity.serializer.SimpleUserSerializer;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.time.Instant;

/**
 * Created by Michal on 18. 7. 2017.
 */
@Getter
@Setter
@Entity
@Table(name = "in_registration")
@NoArgsConstructor
public class Registration extends DomainObject {

    /**
     * user that is in registration state
     */
    @OneToOne
    @JsonSerialize(using = SimpleUserSerializer.class)
    private User toAccept;

    /**
     * secret to verify email
     */
    private String secret;

    /**
     * instant of creation of registration
     */
    private Instant issued;
}
