package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.indihu.entity.domain.ExpositionOpening;
import cz.inqool.uas.indihu.entity.domain.QExpositionOpening;
import cz.inqool.uas.store.DomainStore;
import org.springframework.stereotype.Repository;

/**
 * Created by Michal on 19. 7. 2017.
 */
@Repository
//can be deleted
public class ExpositionOpeningRepository extends DomainStore<ExpositionOpening, QExpositionOpening> {
    public ExpositionOpeningRepository() {
        super(ExpositionOpening.class,QExpositionOpening.class);
    }

    public ExpositionOpening findByExposition(String expositionId){
        QExpositionOpening qExpositionOpening = QExpositionOpening.expositionOpening;

        ExpositionOpening result = query(qExpositionOpening)
                .select(qExpositionOpening)
                .where(qExpositionOpening.exposition.id.eq(expositionId))
                .fetchFirst();
        detachAll();
        return result;
    }

    public void removeByExposition(String expositionId){
        QExpositionOpening opening = this.qObject();

        ExpositionOpening exposition = query().select(opening)
                .where(opening.exposition.id.eq(expositionId))
                .fetchOne();
        if (exposition!=null){
            delete(exposition);
        }
    }
}
