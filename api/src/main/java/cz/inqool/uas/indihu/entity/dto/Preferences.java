package cz.inqool.uas.indihu.entity.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Preferences {

    private boolean game = false;

    private boolean media = false;

    private boolean text = false;

    private boolean topic = false;

    /**
     * Preferences are valid if there is one or two specified
     *
     * @return bool
     */
    public boolean isValid() {
        int sum = game ? 1 : 0 + (media ? 1 : 0) + (text ? 1 : 0) + (topic ? 1 : 0);
        return sum > 0 && sum < 3;
    }
}