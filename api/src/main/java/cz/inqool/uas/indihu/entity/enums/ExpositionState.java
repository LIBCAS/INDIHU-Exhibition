package cz.inqool.uas.indihu.entity.enums;

import cz.inqool.uas.index.Labeled;
import lombok.Getter;

@Getter
public enum ExpositionState implements Labeled {
    PREPARE("V přípravě"),
    OPENED("Otevřená"),
    ENDED("Ukončená");

    String label;

    ExpositionState(String label) {
        this.label = label;
    }
}
