package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.index.IndexedDatedStore;
import cz.inqool.uas.index.dto.Params;
import cz.inqool.uas.index.dto.Result;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.QCollaborator;
import cz.inqool.uas.indihu.entity.domain.QExposition;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.CollaborationType;
import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import cz.inqool.uas.indihu.entity.indexed.IndexedExposition;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

/**
 * Created by Michal on 19. 7. 2017.
 */
@Repository
public class ExpositionRepository extends IndexedDatedStore<Exposition, QExposition, IndexedExposition> {

    public ExpositionRepository() {
        super(Exposition.class, QExposition.class, IndexedExposition.class);
    }

    @Override
    public IndexedExposition toIndexObject(Exposition obj) {
        IndexedExposition indexedExposition = super.toIndexObject(obj);
        indexedExposition.setTitle(obj.getTitle());

        if (obj.getExpositionRating() != null) {
            indexedExposition.setAverageRating(obj.getExpositionRating().getAverage());
        }

        indexedExposition.setEdited(obj.getLastEdit());
        indexedExposition.setReadRights(RightsUtils.getRights(obj, CollaborationType.READ_ONLY));
        indexedExposition.setWriteRights(RightsUtils.getRights(obj, CollaborationType.EDIT));
        indexedExposition.setIsEditing(obj.getIsEditing());
        indexedExposition.setState(obj.getState().name());
        indexedExposition.setAuthor(obj.getAuthor().getEmail());
        return indexedExposition;
    }

    public List<Exposition> findByAuthor(String authorId) {
        return query().select(qObject)
                .from(qObject)
                .where(qObject.author.id.eq(authorId))
                .fetch();
    }

    /**
     * finds all expositions where user is author or collaborator
     */
    public Result<Exposition> findByUser(User user, Params params) {
        QExposition qExposition = this.qObject();
        QCollaborator qCollaborator = QCollaborator.collaborator1;


        List<Exposition> expositions =
                query()
                        .select(qExposition)
                        .leftJoin(qExposition.collaborators, qCollaborator)
                        .where((qExposition.author.id.eq(user.getId()).or(qCollaborator.collaborator.eq(user))))
                        .where(qExposition.deleted.isNull())
                        .distinct()
                        .limit(params.getPageSize())
                        .offset(params.getPageSize() * params.getPage())
                        .fetch();
        detachAll();
        Result<Exposition> result = new Result<>();
        result.setItems(expositions);
        Long count = query()
                .select(qExposition)
                .leftJoin(qExposition.collaborators, qCollaborator)
                .where((qExposition.author.id.eq(user.getId()).or(qCollaborator.collaborator.eq(user))))
                .where(qExposition.deleted.isNull())
                .distinct()
                .fetchCount();
        result.setCount(count);
        return result;
    }

    /**
     * returns all currently open expositions
     */
    public Collection<Exposition> findAllRunning(Params params) {
        QExposition qExposition = this.qObject();

        List<Exposition> result = query()
                .select(qExposition)
                .where(qExposition.state.eq(ExpositionState.OPENED))
                .where(qExposition.deleted.isNull())
                .limit(params.getPageSize())
                .offset(params.getPageSize() * params.getPage())
                .fetch();

        detachAll();

        return result;
    }

    public void remove(Exposition exposition) {
        if (!entityManager.contains(exposition) && exposition != null) {
            exposition = entityManager.find(type, exposition.getId());
        }
        entityManager.remove(exposition);
        entityManager.flush();
        removeIndex(exposition);
    }
}
