package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.index.IndexedDatedStore;
import cz.inqool.uas.indihu.entity.domain.QRegistration;
import cz.inqool.uas.indihu.entity.domain.Registration;
import cz.inqool.uas.indihu.entity.indexed.IndexedRegistration;
import org.springframework.stereotype.Repository;


/**
 * Created by Michal on 19. 7. 2017.
 */
@Repository
public class RegistrationRepository extends IndexedDatedStore<Registration, QRegistration, IndexedRegistration> {

    public RegistrationRepository() {
        super(Registration.class, QRegistration.class, IndexedRegistration.class);
    }

    @Override
    public IndexedRegistration toIndexObject(Registration registration) {
        IndexedRegistration result = super.toIndexObject(registration);
        result.setIssued(registration.getIssued());
        result.setUserdId(registration.getToAccept().getId());
        result.setVerifiedEmail(registration.getToAccept().getVerifiedEmail());
        return result;
    }

    /**
     * finds registration by registration secret
     */
    public Registration findBySecret(String secret) {
        QRegistration registration = qObject();
        return query().select(registration)
                .where(registration.secret.eq(secret))
                .fetchFirst();
    }
}
