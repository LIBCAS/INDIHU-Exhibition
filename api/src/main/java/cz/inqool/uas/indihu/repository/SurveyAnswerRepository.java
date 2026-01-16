package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.indihu.entity.domain.QSurveyAnswer;
import cz.inqool.uas.indihu.entity.domain.SurveyAnswer;
import cz.inqool.uas.store.DatedStore;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for SurveyAnswer entity
 */
@Repository
public class SurveyAnswerRepository extends DatedStore<SurveyAnswer, QSurveyAnswer> {

    public SurveyAnswerRepository() {
        super(SurveyAnswer.class, QSurveyAnswer.class);
    }

    /**
     * Find all answers for a specific exposition and screen
     *
     * @param expoId   ID of the exposition
     * @param screenId ID of the screen
     * @return list of survey answers
     */
    public List<SurveyAnswer> findByExpoIdAndScreenId(String expoId, String screenId) {
        return query()
                .select(qObject)
                .from(qObject)
                .where(qObject.expoId.eq(expoId))
                .where(qObject.screenId.eq(screenId))
                .where(qObject.deleted.isNull())
                .fetch();
    }

    /**
     * Delete all answers for a specific exposition and screen
     *
     * @param expoId   ID of the exposition
     * @param screenId ID of the screen
     */
    public void deleteByExpoIdAndScreenId(String expoId, String screenId) {
        List<SurveyAnswer> answers = findByExpoIdAndScreenId(expoId, screenId);
        for (SurveyAnswer answer : answers) {
            delete(answer);
        }
    }
}

