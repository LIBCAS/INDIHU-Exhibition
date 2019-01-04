package cz.inqool.uas.indihu.service;

import cz.inqool.uas.exception.MissingAttribute;
import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.indihu.entity.domain.Collaborator;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.CollaborationType;
import cz.inqool.uas.indihu.entity.enums.CollaboratorCreateState;
import cz.inqool.uas.indihu.repository.CollaboratorRepository;
import cz.inqool.uas.indihu.repository.ExpositionRepository;
import cz.inqool.uas.indihu.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import static cz.inqool.uas.util.Utils.asList;
import static cz.inqool.uas.util.Utils.notNull;

/**
 * Created by Michal on 24. 7. 2017.
 */
@Component
public class CollaboratorService {

    private ExpositionRepository expositionRepository;

    private UserRepository userRepository;

    private IndihuNotificationService indihuNotificationService;

    private CollaboratorRepository collaboratorRepository;

    private HelperService helperService;

    private final Logger log = LoggerFactory.getLogger("Api");

    private static final Marker MARKER = MarkerFactory.getMarker("API");

    /**
     * Method to add collaborator via email,
     *
     * @param userEmail         email of user
     * @param expositionId      id of exposition to add collaborator to
     * @param type              {{@link CollaborationType} type of collaboration rights}
     * @param allowNotPersisted flag whether send email to user if user not found by email
     * @return an object of collaboration
     */
    @Transactional
    public CollaboratorCreateState addCollaborator(String userEmail, String expositionId, CollaborationType type, boolean allowNotPersisted) {
        CollaboratorCreateState collaboratorCreateState = addCollaboratorWithoutMailNotification(userEmail, expositionId, type, allowNotPersisted);
        Exposition exposition = expositionRepository.find(expositionId);
        expositionRepository.index(exposition);
        User found = userRepository.findByEmail(userEmail);
        if (collaboratorCreateState.equals(CollaboratorCreateState.CREATED)) {
            indihuNotificationService.notifyAddedToCollaborate(found, helperService.getCurrent(), exposition);
        }
        if (collaboratorCreateState.equals(CollaboratorCreateState.EMAIL_SENT)) {
            indihuNotificationService.notifyAddedToCollaborateNotInSystem(userEmail, helperService.getCurrent(), exposition);
        }
        return collaboratorCreateState;
    }

    /**
     * adds collaborator into exposition without sending email notification to user
     */
    public CollaboratorCreateState addCollaboratorWithoutMailNotification(String userEmail, String expositionId, CollaborationType type, boolean allowNotPersisted) {
        Exposition exposition = expositionRepository.find(expositionId);
        notNull(exposition, () -> new MissingObject(Exposition.class, expositionId));
        Collaborator collaboratorFound = collaboratorRepository.findExpositionCollaboratorByEmail(userEmail, expositionId);
        if (collaboratorFound != null) {
            return CollaboratorCreateState.FORBIDDEN;
        }
        if (canEdit(expositionId)) {
            User found = userRepository.findByEmail(userEmail);
            if (found != null || allowNotPersisted) {
                Collaborator collaborator = new Collaborator();
                collaborator.setExposition(exposition);
                collaborator.setUserEmail(userEmail);
                collaborator.setCollaborationType(type);
                collaborator.setSince(Instant.now());

                log.info(MARKER, "Added collaborator " + userEmail + " to exposition " + exposition.getTitle() + " by " + helperService.getCurrent().getUserName());
                if (found != null) {
                    collaborator.setCollaborator(found);
                    collaboratorRepository.save(collaborator);
                    return CollaboratorCreateState.CREATED;
                } else {
                    collaboratorRepository.save(collaborator);
                    return CollaboratorCreateState.EMAIL_SENT;
                }
            }
            return CollaboratorCreateState.EMAIL_NOT_ALLOWED;
        }
        return CollaboratorCreateState.FORBIDDEN;
    }

    /**
     * removes collaborator with email notification
     */
    @Transactional
    public void removeCollaborator(String expositionId, String collaboratorId) {
        removeCollaborators(expositionId, asList(collaboratorId), true);
    }

    /**
     * removes collaborator without sending email notification
     */
    @Transactional
    public void removeCollaboratorWithoutMail(String expositionId, String collaboratorId) {
        removeCollaborators(expositionId, asList(collaboratorId), false);
    }

    /**
     * removes multiple collaborators wit email notification
     *
     * @param expositionId
     * @param collaboratorsId
     */
    @Transactional
    public void removeCollaborators(String expositionId, List<String> collaboratorsId) {
        removeCollaborators(expositionId, collaboratorsId, true);
    }

    /**
     * If user can edit exposition this method allows to remove collaborators
     *
     * @param expositionId    id of exposition to remove {@link Collaborator}s from
     * @param collaboratorsId {@link List} of id of Collaborators
     */
    @Transactional
    public void removeCollaborators(String expositionId, List<String> collaboratorsId, boolean sendMail) {
        Exposition exposition = expositionRepository.find(expositionId);
        notNull(exposition, () -> new MissingObject("Exposition with id: ", expositionId));
        if (helperService.getCurrent().equals(exposition.getAuthor()) || helperService.isAdmin()) {
            List<Collaborator> all = collaboratorRepository.findAllInList(collaboratorsId);
            List<String> emails = all.stream().map(Collaborator::getUserEmail).collect(Collectors.toList());
            all.forEach(collaborator -> {
                exposition.getCollaborators().remove(collaborator);
                collaboratorRepository.delete(collaborator);
                log.info(MARKER, "Removing collaborator " + collaborator.getId() + " from exposition " + exposition.getTitle() + " by " + helperService.getCurrent().getUserName());
            });
            if (sendMail) {
                emails.forEach(s -> indihuNotificationService.notifyRemovedFromCollaboration(s, helperService.getCurrent(), exposition));
            }
            expositionRepository.save(exposition);
        }
    }

    /**
     * Method to remove current logged in user from collaborators of exposition
     *
     * @param expositionId id of {@link Exposition}
     */
    @Transactional
    public void removeCurrentCollaborator(String expositionId) {
        Collaborator collaborator = collaboratorRepository.findExpositionCollaborator(helperService.getCurrent().getId(), expositionId);
        if (collaborator != null) {
            collaboratorRepository.delete(collaborator);
            log.info(MARKER, "Collaborator "+collaborator.getUserEmail()+" removed himself from exposition with id:" + expositionId);

            expositionRepository.index(expositionRepository.find(expositionId));
        }
    }

    /**
     * Method that allows to update {@link CollaborationType} for a {@link Collaborator}
     *
     * @param collaboratorId id of collaboration
     * @param newType        new {@link CollaborationType} to be set
     * @return boolean value determine whether update was successful
     */
    @Transactional
    public boolean update(String collaboratorId, CollaborationType newType) {
        Collaborator collaborator = collaboratorRepository.find(collaboratorId);
        notNull(collaborator, () -> new MissingObject("Collaborator with id: ", collaboratorId));
        if (collaborator.getExposition() != null) {
            if (helperService.getCurrent().equals(collaborator.getExposition().getAuthor())) {
                collaborator.setCollaborationType(newType);
                collaboratorRepository.save(collaborator);
                return true;
            }
        }
        return false;
    }

    /**
     * Method to check whether user is author or have edit collaboration rights
     *
     * @param expositionId id of exposition to check
     * @return boolean
     */
    public boolean canEdit(String expositionId) {
        User current = helperService.getCurrent();
        Exposition exposition = expositionRepository.find(expositionId);

        Collaborator collaborator = collaboratorRepository.findExpositionCollaborator(current.getId(), expositionId);
        if ((exposition.getAuthor().equals(current)) || ((collaborator != null) && (collaborator.getCollaborationType().equals(CollaborationType.EDIT)))
                || helperService.isAdmin()) {
            return true;
        }
        return false;
    }

    /**
     * Method that says if currently logged in user can view an exposition
     * @param expositionId
     * @return
     */
    public boolean canView(String expositionId) {
        Exposition exposition = expositionRepository.find(expositionId);
        notNull(exposition, () -> new MissingObject("Exposition", expositionId));
        if (helperService.isAdmin()) {
            return true;
        }
        if (exposition.getAuthor().equals(helperService.getCurrent())) {
            return true;
        }
        Collaborator collaborator = collaboratorRepository.findExpositionCollaborator(helperService.getCurrent().getId(), exposition.getId());
        if (collaborator != null) {
            return true;
        }
        return false;

    }

    public Collaborator findById(String collaboratorId) {
        return collaboratorRepository.find(collaboratorId);
    }

    /**
     * method that maps created collaborators invited by email
     *
     * @param user
     */
    public void mapCollaborator(User user) {
        notNull(user, () -> new MissingObject(User.class, "missing user in mapping collaborators"));
        notNull(user.getEmail(), () -> new MissingAttribute(user.getEmail(), "missing email in user mapping collaborators"));
        List<Collaborator> collaborators = collaboratorRepository.findByEmail(user.getEmail());
        for (Collaborator collaborator : collaborators) {
            collaborator.setCollaborator(user);
            collaboratorRepository.save(collaborator);
        }
    }

    /**
     * Returns emails list of collaborators for given exposition
     * @param expositionId id of exposition
     */
    public List<String> getCollaboratorsEmailsForExposition(String expositionId) {
        return collaboratorRepository.getListOfCollaboratorsEmailsForExposition(expositionId);
    }

    /**
     * Deletes all collaborators from exposition
     *
     * @param expositionId id of exposition
     */
    @Transactional
    public void removeAllCollaborators(String expositionId) {
        collaboratorRepository.removeAllCollaborators(expositionId);
    }

    @Inject
    public void setExpositionRepository(ExpositionRepository expositionRepository) {
        this.expositionRepository = expositionRepository;
    }

    @Inject
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Inject
    public void setNotificationService(IndihuNotificationService indihuNotificationService) {
        this.indihuNotificationService = indihuNotificationService;
    }

    @Inject
    public void setCollaboratorRepository(CollaboratorRepository collaboratorRepository) {
        this.collaboratorRepository = collaboratorRepository;
    }

    @Inject
    public void setHelperService(HelperService helperService) {
        this.helperService = helperService;
    }
}
