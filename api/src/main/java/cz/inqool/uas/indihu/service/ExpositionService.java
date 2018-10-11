package cz.inqool.uas.indihu.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.index.dto.*;
import cz.inqool.uas.indihu.entity.domain.Collaborator;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.ExpositionUrl;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.dto.ExpositionByUrlDto;
import cz.inqool.uas.indihu.entity.dto.ExpositionDto;
import cz.inqool.uas.indihu.entity.dto.ExpositionEndedDto;
import cz.inqool.uas.indihu.entity.dto.LockedExpositionDto;
import cz.inqool.uas.indihu.entity.enums.CollaborationType;
import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import cz.inqool.uas.indihu.repository.ExpositionOpeningRepository;
import cz.inqool.uas.indihu.repository.ExpositionRepository;
import cz.inqool.uas.indihu.repository.ExpositionUrlRepository;
import cz.inqool.uas.indihu.repository.FileExpositionMapperRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static cz.inqool.uas.util.Utils.*;

/**
 * Created by Michal on 21. 7. 2017.
 */
@Service
public class ExpositionService {

    private ExpositionRepository repository;

    private ExpositionUrlRepository expositionUrlRepository;

    private CollaboratorService collaboratorService;

    private ExpositionFileService expositionFileService;

    private FileExpositionMapperRepository fileExpositionMapperRepository;

    private ExpositionOpeningRepository expositionOpeningRepository;

    private HelperService helperService;

    private SettingsService settingsService;

    private IndihuNotificationService notificationService;

    private ObjectMapper objectMapper = new ObjectMapper();

    private final Logger log = LoggerFactory.getLogger("Api");

    private static final Marker MARKER = MarkerFactory.getMarker("API");

    /**
     * Method to get all {@link Exposition} in which current user is an author or a collaborator
     *
     * @return {@link Collection} of {@link ExpositionDto}
     */
    public Result<ExpositionDto> getUserInProgress(Params params) {
        Result<ExpositionDto> inProgress = new Result<>();
        inProgress.setItems(new ArrayList<>());
        Result<Exposition> expositions;
        if (helperService.isAdmin()) {
            expositions = repository.findAll(params);
        } else {
            addPrefilter(params, buildUserFilters());
            expositions = repository.findAll(params);
        }
        if (expositions.getItems().size() > 0) {
            expositions.getItems().forEach(exposition -> {
                boolean canEdit = collaboratorService.canEdit(exposition.getId());
                inProgress.getItems().add(convert(exposition, canEdit));
            });
        }
        inProgress.setCount(expositions.getCount());
        return inProgress;
    }

    /**
     * Creates elastic filters for expositions where user is either author or collaborator
     */
    private Filter buildUserFilters() {
        String userEmail = helperService.getCurrent().getEmail();

        // user is author
        Filter author = new Filter("author", FilterOperation.EQ, userEmail, null);

        // user has read permission
        Filter readRightsNotNull = new Filter("readRights", FilterOperation.NOT_NULL, null, null);
        Filter readRightsUser = new Filter("readRights", FilterOperation.CONTAINS, userEmail, null);
        Filter hasReadRights = new Filter(null, FilterOperation.AND, null, asList(readRightsNotNull, readRightsUser));

        // user has write permission
        Filter writeRightsNotNull = new Filter("writeRights", FilterOperation.NOT_NULL, null, null);
        Filter writeRightsUser = new Filter("writeRights", FilterOperation.CONTAINS, userEmail, null);
        Filter hasWriteRights = new Filter(null, FilterOperation.AND, null, asList(writeRightsNotNull, writeRightsUser));

        // return concatenated filters
        return new Filter(null, FilterOperation.OR, null, asList(author, hasReadRights, hasWriteRights));
    }

    /**
     * Method to get all ongoing {@link Exposition}
     *
     * @return {@link Collection} of {@link ExpositionDto}
     */
    public Collection<ExpositionDto> getAllCurrent(Params params) {
        Collection<ExpositionDto> current = new ArrayList<>();
        repository.findAllRunning(params).forEach(exposition -> {
            current.add(convert(exposition, false));
        });
        return current;
    }

    /**
     * Gets an {@link Exposition} with defined url which is already open
     *
     * @param url url for an {@link Exposition}
     * @return {@link Exposition}
     */
    public ExpositionEndedDto getByUrl(String url) {
        ExpositionUrl expositionUrl = expositionUrlRepository.findByUrl(url);
        if (expositionUrl != null) {
            Exposition found = expositionUrl.getExposition();
            User current = helperService.getCurrent();
            if (current != null) {
                Exposition exposition = expositionUrl.getExposition();
                if (collaboratorService.canView(exposition.getId())) {
                    return getOpened(exposition);
                }
            }
            if (found.getState().equals(ExpositionState.OPENED)) {
                return getOpened(found);
            } else if (found.getState().equals(ExpositionState.ENDED)) {
                return getEnded(found);
            }
        }
        return null;
    }

    private ExpositionByUrlDto getOpened(Exposition exposition) {
        ExpositionByUrlDto dto = new ExpositionByUrlDto();
        dto.setClosedCaption(exposition.getClosedCaption());
        dto.setClosedPicture(exposition.getClosedPicture());
        dto.setClosedUrl(exposition.getClosedUrl());
        dto.setState(exposition.getState());

        dto.setAuthor(exposition.getAuthor());
        dto.setOrganization(exposition.getOrganization());
        dto.setStructure(exposition.getStructure());
        dto.setTitle(exposition.getTitle());
        dto.setUrl(exposition.getUrl());
        return dto;
    }

    private ExpositionEndedDto getEnded(Exposition exposition) {
        ExpositionEndedDto dto = new ExpositionEndedDto();
        dto.setClosedCaption(exposition.getClosedCaption());
        dto.setClosedPicture(exposition.getClosedPicture());
        dto.setClosedUrl(exposition.getClosedUrl());
        dto.setState(exposition.getState());
        return dto;
    }

    /**
     * Method to check whether url is already used
     *
     * @param url string to check
     * @return true if url is not used
     */
    public boolean isSafe(String url) {
        try {
            ExpositionUrl expositionUrl = expositionUrlRepository.findByUrl(URLEncoder.encode(url, "UTF-8"));
            return expositionUrl == null;
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * creates exposition with url generated from name
     */
    @Transactional
    public Exposition create(String name) {
        Exposition exposition = new Exposition();
        exposition.setTitle(name);
        exposition.setAuthor(helperService.getCurrent());
        String url = exposition.getTitle().replaceAll("[^A-Za-z0-9]", "") + Instant.now().toString();
        url = url.replace(".", "");
        url = url.replace(":", "");
        try {
            exposition.setUrl(URLEncoder.encode(url, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            exposition.setUrl(url);
        }

        exposition.setState(ExpositionState.PREPARE);
        exposition.setIsEditing(helperService.getCurrent().getUserName());
        exposition = repository.save(exposition);
        exposition.setUrls(asSet(createExpositionUrl(exposition, exposition.getUrl())));
        log.info(MARKER, "Exposition: Created exposition " + exposition.getId() + " by " + helperService.getCurrent().getUserName());
        return repository.save(exposition);
    }

    /**
     * updates exposition
     */
    @Transactional
    public Exposition update(Exposition exposition) {
        if (collaboratorService.canEdit(exposition.getId())) {
            exposition.setIsEditing(helperService.getCurrent().getUserName());
            Exposition old = repository.find(exposition.getId());
            if (!old.getUrl().equals(exposition.getUrl())) {
                ExpositionUrl url = createExpositionUrl(exposition, exposition.getUrl());
                if (exposition.getUrls() != null) {
                    exposition.getUrls().add(url);
                } else {
                    exposition.setUrls(asSet(url));
                }
            }
            log.info(MARKER, "Exposition: Update of exposition " + exposition.getId() + " by: " + helperService.getCurrent().getUserName());
            exposition = repository.save(exposition);
            exposition.setExpoFiles(expositionFileService.getFiles(exposition.getId()));
            return exposition;
        }
        return null;
    }

    /**
     * Returns {@link Exposition} specified by Id
     *
     * @param expositionId
     * @return {@link Exposition}
     */
    public Exposition find(String expositionId) {
        Exposition exposition = repository.find(expositionId);
        notNull(exposition, () -> new MissingObject(Exposition.class, expositionId));
        if (collaboratorService.canView(expositionId)) {
            exposition.setExpoFiles(expositionFileService.getFiles(expositionId));
            log.info(MARKER, "Exposition: User " + helperService.getCurrent().getUserName() + " opened exposition " + exposition.getId());
            return exposition;
        } else {
            return null;
        }
    }

    /**
     * returns flag if exposition is currently locked and username of user who is currently editing exposition
     *
     * @param expositionId
     * @return {@link LockedExpositionDto} abot exposition
     */
    public LockedExpositionDto isLocked(String expositionId) {
        Exposition exposition = repository.find(expositionId);
        notNull(exposition, () -> new MissingObject(Exposition.class, expositionId));
        LockedExpositionDto dto = new LockedExpositionDto();
        dto.setLocked(false);
        if (exposition.getUpdated().plusSeconds(settingsService.getLockDuration()).isAfter(Instant.now())) {
            dto.setLocked(true);
            dto.setUserName(exposition.getIsEditing());
        }
        return dto;
    }

    /**
     * Converts {@link Exposition} into {@link ExpositionDto}
     *
     * @param exposition {@link Exposition} to convert
     * @param canEdit    flag if user is author or has collaborationType.Edit
     * @return {@link ExpositionDto} converted
     */
    private ExpositionDto convert(Exposition exposition, boolean canEdit) {
        if (exposition == null) {
            return null;
        }
        ExpositionDto dto = new ExpositionDto();

        dto.setId(exposition.getId());
        dto.setTitle(exposition.getTitle());
        boolean currentlyEditing = exposition.getUpdated().isAfter(Instant.now().minusSeconds(settingsService.getLockDuration()));
        dto.setInProgress(currentlyEditing);
        dto.setIsEditing(exposition.getIsEditing());
        dto.setState(exposition.getState());
        dto.setLastEdit(exposition.getUpdated());
        dto.setCanEdit((!currentlyEditing || helperService.getCurrent().getUserName().equals(exposition.getIsEditing())) && canEdit);
        dto.setCanDelete(exposition.getAuthor().equals(helperService.getCurrent()));
        dto.setCreated(exposition.getCreated());
        dto.setUrl(exposition.getUrl());
        return dto;
    }

    /**
     * deletes exposition
     */
    @Transactional
    public boolean delete(String expositionId) {
        //exposition
        Exposition exposition = repository.find(expositionId);
        notNull(exposition, () -> new MissingObject("Exposition", expositionId));
        if (helperService.getCurrent().equals(exposition.getAuthor())) {
            List<String> collaboratorsEmails = collaboratorService.getCollaboratorsEmailsForExposition(expositionId);
            collaboratorService.removeAllCollaborators(expositionId);
            fileExpositionMapperRepository.removeAllInExposition(expositionId);
            expositionOpeningRepository.removeByExposition(expositionId);
            repository.delete(exposition);
            for (String collaboratorsEmail : collaboratorsEmails) {
                notificationService.notifyDeletedExposition(collaboratorsEmail, exposition);
            }
            log.info(MARKER, "Exposition: Expositoin " + expositionId + " was deleted by: " + helperService.getCurrent().getUserName());
            return true;
        }
        return false;
    }

    /**
     * reassigns author of the exposition, previous owner gets collaboration status with read/write access
     *
     * @param expositionId
     * @param collaboratorId
     * @return
     */
    @Transactional
    //todo add test, what should be returned if action is not supported?
    public Exposition move(String expositionId, String collaboratorId) {
        Exposition exposition = repository.find(expositionId);
        notNull(exposition, () -> new MissingObject(Exposition.class, expositionId));
        Collaborator old = collaboratorService.findById(collaboratorId);
        User owner = exposition.getAuthor();
        notNull(old, () -> new MissingObject(Collaborator.class, collaboratorId));
        if (helperService.getCurrent().equals(owner) || helperService.isAdmin()) {
            collaboratorService.addCollaboratorWithoutMailNotification(owner.getEmail(), exposition.getId(), CollaborationType.EDIT, false);
            collaboratorService.removeCollaboratorWithoutMail(exposition.getId(), collaboratorId);
            notificationService.notifyMovedExposition(owner.getEmail(), old.getCollaborator().getEmail(), exposition);
            exposition = find(expositionId);
            exposition.setAuthor(old.getCollaborator());
            log.info(MARKER, "Exposition: Exposition " + expositionId + " was moved from " + owner.getUserName() + " to " + old.getCollaborator().getUserName());
            return repository.save(exposition);
        }
        return null;
    }

    private ExpositionUrl createExpositionUrl(Exposition exposition, String url) {
        ExpositionUrl expositionUrl = new ExpositionUrl();
        expositionUrl.setExposition(exposition);
        expositionUrl.setUrl(url);
        return expositionUrlRepository.save(expositionUrl);
    }

    @Transactional
    public boolean lock(String id) {
        Exposition exposition = repository.find(id);
        notNull(exposition,() -> new MissingObject(Exposition.class,id));
        Instant lastUpdated = exposition.getUpdated();
        exposition.setIsEditing(helperService.getCurrent().getUserName());
        exposition.setUpdated(Instant.now());
        exposition = repository.save(exposition);
        return exposition.getUpdated().isAfter(lastUpdated);
    }

    @Inject
    public void setRepository(ExpositionRepository repository) {
        this.repository = repository;
    }

    @Inject
    public void setCollaboratorService(CollaboratorService collaboratorService) {
        this.collaboratorService = collaboratorService;
    }

    @Inject
    public void setHelperService(HelperService helperService) {
        this.helperService = helperService;
    }

    @Inject
    public void setExpositionFileService(ExpositionFileService expositionFileService) {
        this.expositionFileService = expositionFileService;
    }

    @Inject
    public void setFileExpositionMapperRepository(FileExpositionMapperRepository fileExpositionMapperRepository) {
        this.fileExpositionMapperRepository = fileExpositionMapperRepository;
    }

    @Inject
    public void setExpositionOpeningRepository(ExpositionOpeningRepository expositionOpeningRepository) {
        this.expositionOpeningRepository = expositionOpeningRepository;
    }

    @Inject
    public void setNotificationService(IndihuNotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Inject
    public void setSettingsService(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @Inject
    public void setExpositionUrlRepository(ExpositionUrlRepository expositionUrlRepository) {
        this.expositionUrlRepository = expositionUrlRepository;
    }
}
