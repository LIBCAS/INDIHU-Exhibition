package cz.inqool.uas.indihu.entity.indexed;

import cz.inqool.uas.index.IndexedDatedObject;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.Instant;

@Getter
@Setter
@Document(indexName = "indihu", type = "registration")
public class IndexedRegistration extends IndexedDatedObject {

    @Field(type = FieldType.String, index = FieldIndex.not_analyzed)
    private String userdId;

    @Field(type = FieldType.Date, index = FieldIndex.not_analyzed)
    private Instant issued;

    @Field(type = FieldType.Boolean, index = FieldIndex.not_analyzed)
    private Boolean verifiedEmail;
}
