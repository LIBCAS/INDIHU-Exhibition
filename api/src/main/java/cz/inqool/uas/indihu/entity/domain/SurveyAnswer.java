package cz.inqool.uas.indihu.entity.domain;

import cz.inqool.uas.domain.DatedObject;
import cz.inqool.uas.indihu.entity.enums.SurveyAnswerType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

/**
 * Entity representing a single answer to a survey
 */
@Entity
@Getter
@Setter
@Table(name = "in_survey_answer")
@NoArgsConstructor
public class SurveyAnswer extends DatedObject {

    /**
     * ID of the exposition this answer belongs to
     */
    @Column(name = "expo_id", nullable = false)
    private String expoId;

    /**
     * ID of the screen this answer belongs to
     */
    @Column(name = "screen_id", nullable = false)
    private String screenId;

    /**
     * Type of the answer (choice or free text)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "answer_type", nullable = false)
    private SurveyAnswerType answerType;

    /**
     * The actual answer text (could be a, b, c, d, e, f, g, h or free text)
     */
    @Column(name = "answer", nullable = false, length = 2500)
    private String answer;
}

