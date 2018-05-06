package cz.inqool.uas.indihu.entity.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.inqool.uas.file.FileRef;
import cz.inqool.uas.indihu.entity.dto.ExpoFile;
import cz.inqool.uas.indihu.entity.enums.ExpositionTheme;
import cz.inqool.uas.indihu.entity.enums.InfoPointShape;
import cz.inqool.uas.indihu.entity.enums.LogoPosition;
import cz.inqool.uas.indihu.entity.enums.LogoType;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

/**
 * Class holding the data for exposition's design elements
 */
@Getter
@Setter
@Embeddable
public class ExpositionDesignData {

    /**
     * Theme of exposition
     */
    @Enumerated(EnumType.STRING)
    private ExpositionTheme theme;

    /**
     * Background color
     */
    private String backgroundColor;

    /**
     * Color used for icons
     */
    private String iconsColor;

    /**
     * Color used for tags
     */
    private String tagsColor;

    /**
     * Type of logo for exposition
     */
    @Enumerated(EnumType.STRING)
    private LogoType logoType;

    /**
     * Position of logo
     */
    @Enumerated(EnumType.STRING)
    private LogoPosition logoPosition;

    /**
     * Logo file
     */
    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "logo_file_id")
    private FileRef logoFileRef;

    @Transient
    private ExpoFile logoFile;

    /**
     * Shape of info points in exposition
     */
    @Enumerated(EnumType.STRING)
    private InfoPointShape defaultInfopointShape;

    /**
     * Size of info points in pixels
     */
    private Double defaultInfopointPxSize;

    /**
     * Color of info points
     */
    private String defaultInfopointColor;

    /**
     * Icon file for info points
     */
    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "default_infopoint_icon_file_id")
    private FileRef defaultInfopointIconFileRef;

    @Transient
    private ExpoFile defaultInfopointIconFile;
}
