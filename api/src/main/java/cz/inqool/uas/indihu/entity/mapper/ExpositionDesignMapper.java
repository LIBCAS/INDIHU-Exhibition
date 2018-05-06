package cz.inqool.uas.indihu.entity.mapper;

import cz.inqool.uas.indihu.entity.domain.ExpositionDesignData;
import cz.inqool.uas.indihu.entity.dto.ExpositionDesignDataDto;
import org.springframework.stereotype.Component;

@Component
public class ExpositionDesignMapper {

    public ExpositionDesignData fromDto(ExpositionDesignDataDto dto) {
        if (dto == null) {
            return null;
        }

        ExpositionDesignData result = new ExpositionDesignData();
        result.setTheme(dto.getTheme());
        result.setBackgroundColor(dto.getBackgroundColor());
        result.setIconsColor(dto.getIconsColor());
        result.setTagsColor(dto.getTagsColor());
        result.setLogoType(dto.getLogoType());
        result.setLogoPosition(dto.getLogoPosition());
        result.setDefaultInfopointShape(dto.getDefaultInfopointShape());
        result.setDefaultInfopointPxSize(dto.getDefaultInfopointPxSize());
        result.setDefaultInfopointColor(dto.getDefaultInfopointColor());
        return result;
    }

    public ExpositionDesignDataDto toDto(ExpositionDesignData entity) {
        if (entity == null) {
            return null;
        }

        ExpositionDesignDataDto result = new ExpositionDesignDataDto();
        result.setTheme(entity.getTheme());
        result.setBackgroundColor(entity.getBackgroundColor());
        result.setIconsColor(entity.getIconsColor());
        result.setTagsColor(entity.getTagsColor());
        result.setLogoType(entity.getLogoType());
        result.setLogoPosition(entity.getLogoPosition());
        result.setDefaultInfopointShape(entity.getDefaultInfopointShape());
        result.setDefaultInfopointPxSize(entity.getDefaultInfopointPxSize());
        result.setDefaultInfopointColor(entity.getDefaultInfopointColor());

        return result;
    }
}
