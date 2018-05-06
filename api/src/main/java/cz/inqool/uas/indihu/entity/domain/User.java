package cz.inqool.uas.indihu.entity.domain;

import cz.inqool.uas.domain.DatedObject;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.enums.UserState;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Email;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Set;

/**
 * Created by Michal on 18. 7. 2017.
 */
@Getter
@Setter
@Entity
@Table(name = "in_user")
@NoArgsConstructor
public class User extends DatedObject {

    private String firstName;

    private String surname;

    @Email
    private String email;

    private Boolean verifiedEmail;

    private String userName;

    private String institution;

    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @NotNull
    private boolean registrationNotifications = true;

    @Enumerated(EnumType.STRING)
    private UserState state;

    private boolean accepted;

    @OneToOne(mappedBy = "toAccept")
    private Registration registration;

    @Column(columnDefinition = "boolean default false")
    private boolean ldapUser;

    @Transient
    private boolean deletedUser;

    @Transient
    //not in use
    private Set<ExpositionOpening> openings;

    @Transient
    private Set<Collaborator> collaborating;
}
