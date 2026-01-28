package cz.inqool.uas.indihu.service;

import cz.inqool.uas.indihu.entity.domain.SurveyAnswer;
import cz.inqool.uas.indihu.entity.dto.SurveyAggregationDto;
import cz.inqool.uas.indihu.entity.dto.SurveyAnswerDto;
import cz.inqool.uas.indihu.entity.enums.SurveyAnswerType;
import cz.inqool.uas.indihu.repository.SurveyAnswerRepository;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

/**
 * Service for managing survey answers
 */
@Service
public class SurveyService {

    private SurveyAnswerRepository surveyAnswerRepository;

    /**
     * Submits an answer to a survey
     *
     * @param dto survey answer data
     * @return created survey answer
     */
    @Transactional
    public SurveyAnswer submitAnswer(SurveyAnswerDto dto) {
        SurveyAnswer answer = new SurveyAnswer();
        answer.setExpoId(dto.getExpoId());
        answer.setScreenId(dto.getScreenId());
        answer.setAnswerType(dto.getAnswerType());
        answer.setAnswer(dto.getAnswer());

        return surveyAnswerRepository.save(answer);
    }

    /**
     * Gets all answers for a survey
     *
     * @param expoId   exposition ID
     * @param screenId screen ID
     * @return list of survey answers
     */
    public List<SurveyAnswer> getSurveyAnswers(String expoId, String screenId) {
        return surveyAnswerRepository.findByExpoIdAndScreenId(expoId, screenId);
    }

    /**
     * Deletes all survey answers for a specific exposition and screen
     *
     * @param expoId   exposition ID
     * @param screenId screen ID
     */
    @Transactional
    public void deleteSurveyAnswers(String expoId, String screenId) {
        surveyAnswerRepository.deleteByExpoIdAndScreenId(expoId, screenId);
    }

    /**
     * Gets aggregated survey data for a specific exposition and screen
     *
     * @param expoId             exposition ID
     * @param screenId           screen ID
     * @param includeFreeAnswers whether to include free text answers in the response
     * @return aggregated survey data
     */
    public SurveyAggregationDto getAggregatedSurveyData(String expoId, String screenId, boolean includeFreeAnswers) {
        List<SurveyAnswer> answers = surveyAnswerRepository.findByExpoIdAndScreenId(expoId, screenId);

        SurveyAggregationDto dto = new SurveyAggregationDto();
        dto.setTotalAnswers(answers.size());

        long choiceCount = 0;
        long freeCount = 0;
        long countA = 0, countB = 0, countC = 0, countD = 0;
        long countE = 0, countF = 0, countG = 0, countH = 0;
        List<String> freeTextAnswers = new ArrayList<String>();

        for (SurveyAnswer answer : answers) {
            if (SurveyAnswerType.CHOICE.equals(answer.getAnswerType())) {
                choiceCount++;
                String answerText = answer.getAnswer().toLowerCase();
                if ("a".equals(answerText)) {
                    countA++;
                } else if ("b".equals(answerText)) {
                    countB++;
                } else if ("c".equals(answerText)) {
                    countC++;
                } else if ("d".equals(answerText)) {
                    countD++;
                } else if ("e".equals(answerText)) {
                    countE++;
                } else if ("f".equals(answerText)) {
                    countF++;
                } else if ("g".equals(answerText)) {
                    countG++;
                } else if ("h".equals(answerText)) {
                    countH++;
                }
            } else if (SurveyAnswerType.FREE.equals(answer.getAnswerType())) {
                freeCount++;
                if (includeFreeAnswers) {
                    freeTextAnswers.add(answer.getAnswer());
                }
            }
        }

        dto.setChoiceAnswers(choiceCount);
        dto.setFreeAnswers(freeCount);
        dto.setCountA(countA);
        dto.setCountB(countB);
        dto.setCountC(countC);
        dto.setCountD(countD);
        dto.setCountE(countE);
        dto.setCountF(countF);
        dto.setCountG(countG);
        dto.setCountH(countH);

        if (includeFreeAnswers) {
            dto.setFreeTextAnswers(freeTextAnswers);
        }

        return dto;
    }

    @Inject
    public void setSurveyAnswerRepository(SurveyAnswerRepository surveyAnswerRepository) {
        this.surveyAnswerRepository = surveyAnswerRepository;
    }
}

