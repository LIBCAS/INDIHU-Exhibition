package cz.inqool.uas.indihu.entity.domain;

import cz.inqool.uas.domain.DomainObject;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "in_settings")
@NoArgsConstructor
public class Settings extends DomainObject{

    /**
     * flag whether registration is allowed
     */
    private boolean allowedRegistration;

    /**
     * flag whether automatic registration is allowed
     */
    private boolean automaticRegistration;

    /**
     * time duration for locking an exposition in seconds
     */
    private int lockDuration;
}
