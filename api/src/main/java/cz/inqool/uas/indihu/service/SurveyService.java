package cz.inqool.uas.indihu.service;

import cz.inqool.uas.indihu.entity.domain.SurveyAnswer;
import cz.inqool.uas.indihu.entity.dto.SurveyAnswerDto;
import cz.inqool.uas.indihu.repository.SurveyAnswerRepository;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;
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

    @Inject
    public void setSurveyAnswerRepository(SurveyAnswerRepository surveyAnswerRepository) {
        this.surveyAnswerRepository = surveyAnswerRepository;
    }
}

