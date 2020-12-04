package cz.inqool.uas.indihu.entity.indexed;

import cz.inqool.uas.index.IndexedDatedObject;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldIndex;
import org.springframework.data.elasticsearch.annotations.FieldType;


@Getter
@Setter
@Document(indexName = "indihu", type = "exposition")
public class IndexedExposition extends IndexedDatedObject {

    @Field(type = FieldType.String, index = FieldIndex.not_analyzed)
    private String author;

    @Field(type = FieldType.String, analyzer = "folding")
    private String title;

    @Field(type = FieldType.String, index = FieldIndex.not_analyzed)
    private String state;

    @Field(type = FieldType.String, analyzer = "folding")
    private String isEditing;

    @Field(type = FieldType.String, analyzer = "folding")
    private String readRights;

    @Field(type = FieldType.String, analyzer = "folding")
    private String writeRights;
}
