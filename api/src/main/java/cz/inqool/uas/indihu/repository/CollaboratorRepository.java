package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.indihu.entity.domain.Collaborator;
import cz.inqool.uas.indihu.entity.domain.QCollaborator;
import cz.inqool.uas.store.DomainStore;
import cz.inqool.uas.store.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Michal on 19. 7. 2017.
 */
@Repository
@Transactional
public class CollaboratorRepository extends DomainStore<Collaborator, QCollaborator> {
    public CollaboratorRepository() {
        super(Collaborator.class, QCollaborator.class);
    }

    /**
     * Removes collaborators from an exposition
     *
     * @param usersId      ids of users to remove
     * @param expositionId id of exposition to remove collaborators from
     */
    public void removeCollaborators(List<String> usersId, String expositionId) {
        QCollaborator qCollaborator = QCollaborator.collaborator1;

        List<Collaborator> collaborators = query(qCollaborator)
                .select(qCollaborator)
                .where(qCollaborator.exposition.id.eq(expositionId)
                        .and(qCollaborator.collaborator.id.in(usersId)))
                .fetch();
        detachAll();
        collaborators.forEach(this::delete);
    }

    /**
     * Return all collaborators for give exposition
     *
     * @param expositionId id of exposition
     * @return {@link List} of {@link Collaborator}
     */
    public List<Collaborator> findAllForExposition(String expositionId) {
        QCollaborator qCollaborator = QCollaborator.collaborator1;

        List<Collaborator> collaborators = query(qCollaborator)
                .select(qCollaborator)
                .where(qCollaborator.exposition.id.eq(expositionId))
                .fetch();
        detachAll();

        return collaborators;
    }

    /**
     * finds a collaborator for given exposition by user id
     */
    public Collaborator findExpositionCollaborator(String userId, String expositionId) {
        QCollaborator qCollaborator = QCollaborator.collaborator1;

        Collaborator collaborator = query(qCollaborator)
                .select(qCollaborator)
                .where(qCollaborator.collaborator.id.eq(userId).and(qCollaborator.exposition.id.eq(expositionId)))
                .fetchFirst();
        detachAll();
        return collaborator;
    }

    /**
     * returns a collaborator for exposition with given email
     */
    public Collaborator findExpositionCollaboratorByEmail(String email, String expositionId) {
        QCollaborator qCollaborator = QCollaborator.collaborator1;

        Collaborator collaborator = query(qCollaborator)
                .select(qCollaborator)
                .where(qCollaborator.userEmail.eq(email).and(qCollaborator.exposition.id.eq(expositionId)))
                .fetchFirst();
        detachAll();
        return collaborator;
    }

    /**
     * finds all collaborations for given email
     */
    public List<Collaborator> findByEmail(String email) {
        QCollaborator qCollaborator = QCollaborator.collaborator1;

        List<Collaborator> collaborator = query(qCollaborator)
                .select(qCollaborator)
                .where(qCollaborator.collaborator.email.eq(email))
                .fetch();
        detachAll();
        return collaborator;
    }

    /**
     * removes all collaborators from given exposition
     */
    public void removeAllCollaborators(String expositionId) {
        List<Collaborator> collaborators = findAllForExposition(expositionId);
        detachAll();
        collaborators.forEach(this::delete);
    }

    public List<String> getListOfCollaboratorsEmailsForExposition(String expositionId) {
        QCollaborator qCollaborator = qObject();
        List<String> emails = query()
                .select(qCollaborator.collaborator.email)
                .where(qCollaborator.collaborator.isNotNull().and(qCollaborator.exposition.isNotNull().and(qCollaborator.exposition.id.eq(expositionId))))
                .fetch();
        detachAll();

        return emails;
    }
}
