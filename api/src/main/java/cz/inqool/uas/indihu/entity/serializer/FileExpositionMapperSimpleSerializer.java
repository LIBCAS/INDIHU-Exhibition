package cz.inqool.uas.indihu.entity.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import cz.inqool.uas.indihu.entity.domain.FileExpositionMapper;

import java.io.IOException;

public class FileExpositionMapperSimpleSerializer extends JsonSerializer<FileExpositionMapper> {
    @Override
    public void serialize(FileExpositionMapper value, JsonGenerator gen, SerializerProvider serializers) throws IOException, JsonProcessingException {
        gen.writeStartObject();

        if (value != null) {
            gen.writeStringField("id", value.getId());
            if (value.getDuration() != null) {
                gen.writeStringField("duration", value.getDuration().toString());
            }
            if (value.getSize() != null) {
                gen.writeStringField("size", value.getSize().toString());
            }
            if (value.getFile() != null) {
                gen.writeStringField("file", value.getFile().toString());
            }
        }

        gen.writeEndObject();
    }
}
