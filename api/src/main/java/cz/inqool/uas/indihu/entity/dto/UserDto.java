package cz.inqool.uas.indihu.entity.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by Michal on 26. 7. 2017.
 */
@Getter
@Setter
public class UserDto {
    private String userName;

    private String firstName;

    private String surname;

    private String email;

    private String institution;
}
