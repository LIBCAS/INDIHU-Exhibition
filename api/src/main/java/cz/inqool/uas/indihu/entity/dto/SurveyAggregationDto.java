package cz.inqool.uas.indihu.entity.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Aggregated answer counts for a survey screen.
 */
@Getter
@Setter
public class SurveyAggregationDto {

    private long totalAnswers;

    private long choiceAnswers;

    private long freeAnswers;

    private long countA;

    private long countB;

    private long countC;

    private long countD;

    private long countE;

    private long countF;

    private long countG;

    private long countH;

    private List<String> freeTextAnswers;
}
