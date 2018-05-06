package cz.inqool.uas.indihu.entity.enums;

import cz.inqool.uas.index.Labeled;
import lombok.Getter;

@Getter
public enum UserState implements Labeled {
    NOT_VERIFIED("Neověřen"),
    TO_ACCEPT("Ke schválení"),
    ACCEPTED("Akceptován"),
    REJECTED("Zamítnut");

    private final String label;

    UserState(String label) {
        this.label = label;
    }
}
