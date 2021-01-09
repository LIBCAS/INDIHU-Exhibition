package cz.inqool.uas.indihu.entity.enums;

import cz.inqool.uas.index.Labeled;
import lombok.Getter;

/**
 * Created by Michal on 19. 7. 2017.
 */
@Getter
public enum CollaborationType implements Labeled {
    READ_ONLY("Jen pro čtení"),
    EDIT("Pro čtení i zápis");

    private String label;

    CollaborationType(String label) {
        this.label = label;
    }
}
