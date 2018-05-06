package cz.inqool.uas.indihu.entity.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import cz.inqool.uas.indihu.entity.domain.User;

import java.io.IOException;

public class SimpleUserSerializer extends JsonSerializer<User> {
    @Override
    public void serialize(User value, JsonGenerator gen, SerializerProvider serializers) throws IOException, JsonProcessingException {
        gen.writeStartObject();

        if (value != null) {
            gen.writeStringField("id", value.getId());
            gen.writeStringField("firstName", value.getFirstName());
            gen.writeStringField("surname", value.getSurname());
            gen.writeStringField("username", value.getUserName());
            gen.writeStringField("institution", value.getInstitution());
            gen.writeStringField("email", value.getEmail());
        }

        gen.writeEndObject();
    }
}
