package cz.inqool.uas.indihu.entity.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.inqool.uas.domain.DomainObject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Getter
@Setter
@Table(name = "in_exposition_url")
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class ExpositionUrl extends DomainObject {


    @JsonIgnore
    @ManyToOne
    private Exposition exposition;

    /**
     * url under which should exposition be reachable
     */
    private String url;
}
