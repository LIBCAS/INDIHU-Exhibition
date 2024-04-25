package cz.inqool.uas.indihu.entity.domain;

import cz.inqool.uas.domain.DomainObject;
import cz.inqool.uas.file.FileRef;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "in_file_exposition_mapper")
public class FileExpositionMapper extends DomainObject{

    @ManyToOne
    private Exposition exposition;

    @OneToOne
    private FileRef file;

    private Long duration;

    private Long size;
}
