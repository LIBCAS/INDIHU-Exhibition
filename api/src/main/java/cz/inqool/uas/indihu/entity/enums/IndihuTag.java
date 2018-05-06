package cz.inqool.uas.indihu.entity.enums;

import lombok.Getter;

import static cz.inqool.uas.indihu.entity.enums.IndihuTagGroup.*;

public enum IndihuTag {
    ART(CONTENT),
    HISTORY(CONTENT),
    NATURE(CONTENT),
    TECHNIQUE(CONTENT),
    INDUSTRY(CONTENT),
    DESIGN(CONTENT),
    SCIENCE_TECHNIQUE(CONTENT),
    SOCIETY(CONTENT),
    HISTORY_PEOPLE(CONTENT),
    INFORMATIVE(FORMAL),
    FUNNY(FORMAL),
    AESTHETIC(FORMAL),
    INTERACTIVE(FORMAL),
    EDUCATIONAL(FORMAL),
    ENGLISH_FRIENDLY(FORMAL),
    FOR_MOBILES(FORMAL),
    ADULTS(TARGET),
    SENIORS(TARGET),
    CHILDREN(TARGET),
    TEENAGERS(TARGET),
    STUDENTS(TARGET),
    EXPERTS(TARGET),
    FAMILY(TARGET);

    @Getter
    private final IndihuTagGroup group;

    IndihuTag(IndihuTagGroup group) {
        this.group = group;
    }

    @Override
    public String toString() {
        return this.name();
    }
}