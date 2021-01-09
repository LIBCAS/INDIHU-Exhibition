package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.indihu.entity.domain.ExpositionUrl;
import cz.inqool.uas.indihu.entity.domain.QExpositionUrl;
import cz.inqool.uas.store.DomainStore;
import org.springframework.stereotype.Repository;

@Repository
public class ExpositionUrlRepository extends DomainStore<ExpositionUrl, QExpositionUrl> {

    public ExpositionUrlRepository() {
        super(ExpositionUrl.class, QExpositionUrl.class);
    }

    /**
     * finds exposition with given url
     */
    public ExpositionUrl findByUrl(String url) {
        QExpositionUrl qExpositionUrl = qObject();
        ExpositionUrl expositionUrl = query()
                .select(qExpositionUrl)
                .where(qExpositionUrl.url.eq(url))
                .fetchFirst();

        detachAll();

        return expositionUrl;
    }
}
