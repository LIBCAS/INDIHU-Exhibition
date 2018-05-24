package cz.inqool.uas.indihu.entity.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpoFile {
    private String id;
    private String fileId;
    private String name;
    private Long duration;
    private String size;
    private String type;
    private String thumbnailId;
}
