package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.indihu.entity.domain.Pin;
import cz.inqool.uas.indihu.entity.domain.QPin;
import cz.inqool.uas.store.DomainStore;
import cz.inqool.uas.store.Transactional;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class PinRepository extends DomainStore<Pin, QPin> {

    public PinRepository() {
        super(Pin.class, QPin.class);
    }

    public long countPins(String userId) {
        return query()
                .select(qObject)
                .from()
                .where(qObject.user.id.eq(userId))
                .fetchCount();
    }

    public List<Pin> findPins(String userId, int page, int pageSize) {
        return query()
                .select(qObject)
                .from(qObject)
                .offset((long) page * pageSize)
                .limit(pageSize)
                .where(qObject.user.id.eq(userId))
                .orderBy(qObject.pinnedAt.asc())
                .fetch();
    }

    @Transactional
    public void removePin(String expositionId, String userId) {
        super.delete(Optional.ofNullable(query().select(qObject).from(qObject)
                        .where(qObject.user.id.eq(userId).and(qObject.exposition.id.eq(expositionId)))
                        .fetchFirst()).orElseThrow(() -> new MissingObject(Pin.class, expositionId + ":" + userId)));
    }

    public Map<String, Pin> findAllForUser(String userId) {
        Set<Pin> userPins = new HashSet<>(query()
                .select(qObject)
                .from(qObject)
                .where(qObject.user.id.eq(userId))
                .orderBy(qObject.pinnedAt.asc())
                .fetch());

        return userPins.stream()
                .map(pin -> new AbstractMap.SimpleEntry<>(pin.getExposition().getId(), pin))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public void removeUserPins(String userId) {
        query().select(qObject)
                .where(qObject.user.id.eq(userId))
                .fetch()
                .forEach(super::delete);

        entityManager.flush();
    }
}
