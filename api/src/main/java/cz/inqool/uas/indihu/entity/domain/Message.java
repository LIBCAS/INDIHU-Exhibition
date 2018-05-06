package cz.inqool.uas.indihu.entity.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import cz.inqool.uas.domain.DatedObject;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Range;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@Entity
@Table(name = "in_message")
public class Message extends DatedObject {

    @ManyToOne
    @JsonBackReference
    @NotNull
    private Exposition exposition;

    private String text;

    @Email
    private String contactEmail;

    @Range(max = 5L)
    private Double rating;
}
