package cz.inqool.uas.indihu.entity.dto;

import cz.inqool.uas.indihu.entity.enums.SurveyAnswerType;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * DTO for submitting survey answers
 */
@Getter
@Setter
public class SurveyAnswerDto {

    @NotNull
    private String expoId;

    @NotNull
    private String screenId;

    @NotNull
    private SurveyAnswerType answerType;

    @NotNull
    private String answer;
}

