package cz.inqool.uas.indihu.entity.serializer;

import cz.inqool.uas.indihu.entity.enums.IndihuTag;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Converter
public class IndihuTagConverter implements AttributeConverter<Set<IndihuTag>, String> {

    private static final String DELIMITER = ";";

    @Override
    public String convertToDatabaseColumn(Set<IndihuTag> attribute) {
        if (attribute == null) {
            return "";
        }

        Set<String> strings = attribute.stream().map(Enum::toString).collect(Collectors.toSet());

        return String.join(DELIMITER, strings);
    }

    @Override
    public Set<IndihuTag> convertToEntityAttribute(String lobString) {
        if (lobString == null || lobString.isEmpty()) {
            return new HashSet<>();
        }

        return Arrays.stream(lobString.split(DELIMITER))
                .map(IndihuTag::valueOf)
                .collect(Collectors.toSet());
    }
}
