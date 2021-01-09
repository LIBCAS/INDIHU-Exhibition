package cz.inqool.uas.indihu.entity.indexed;

import cz.inqool.uas.index.IndexedDatedObject;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.*;

/**
 * Created by Michal on 19. 7. 2017.
 */
@Getter
@Setter
@Document(indexName = "indihu", type = "user")
@Setting(settingPath = "/es_settings.json")
public class IndexedUser extends IndexedDatedObject {

    @Field(type = FieldType.String, analyzer = "folding")
    private String userName;

    @Field(type = FieldType.String, analyzer = "folding")
    private String firstName;

    @Field(type = FieldType.String, analyzer = "folding")
    private String surname;

    @Field(type = FieldType.String, analyzer = "folding")
    private String email;

    @Field(type = FieldType.String, analyzer = "folding")
    private String institution;

    @Field(type = FieldType.String, index = FieldIndex.not_analyzed)
    private String role;

    @Field(type = FieldType.String, index = FieldIndex.not_analyzed)
    private String state;

    @Field(type = FieldType.Boolean, index = FieldIndex.not_analyzed)
    private boolean accepted;

    @Field(type = FieldType.Boolean, index = FieldIndex.not_analyzed)
    private boolean active;
}
