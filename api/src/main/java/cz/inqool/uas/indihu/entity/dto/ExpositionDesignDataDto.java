package cz.inqool.uas.indihu.entity.dto;

import cz.inqool.uas.indihu.entity.enums.ExpositionTheme;
import cz.inqool.uas.indihu.entity.enums.InfoPointShape;
import cz.inqool.uas.indihu.entity.enums.LogoPosition;
import cz.inqool.uas.indihu.entity.enums.LogoType;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@Validated
public class ExpositionDesignDataDto {

    @NotNull
    private ExpositionTheme theme;

    @NotNull
    private String backgroundColor;

    @NotNull
    private String iconsColor;

    @NotNull
    private String tagsColor;

    @NotNull
    private LogoType logoType;

    @NotNull
    private LogoPosition logoPosition;

    private ExpoFile logoFile;

    @NotNull
    private InfoPointShape defaultInfopointShape;

    @NotNull
    @Range(min = 0)
    private Double defaultInfopointPxSize;

    @NotNull
    private String defaultInfopointColor;

    private ExpoFile defaultInfopointIconFile;
}
