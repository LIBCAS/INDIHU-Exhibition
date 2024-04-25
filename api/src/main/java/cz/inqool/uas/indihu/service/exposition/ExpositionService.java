package cz.inqool.uas.indihu.service.exposition;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.inqool.uas.exception.BadArgument;
import cz.inqool.uas.exception.InvalidAttribute;
import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.file.FileRef;
import cz.inqool.uas.index.dto.Filter;
import cz.inqool.uas.index.dto.FilterOperation;
import cz.inqool.uas.index.dto.Params;
import cz.inqool.uas.index.dto.Result;
import cz.inqool.uas.indihu.entity.domain.*;
import cz.inqool.uas.indihu.entity.dto.*;
import cz.inqool.uas.indihu.entity.enums.CollaborationType;
import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.mapper.ExpositionDesignMapper;
import cz.inqool.uas.indihu.repository.*;
import cz.inqool.uas.indihu.service.CollaboratorService;
import cz.inqool.uas.indihu.service.HelperService;
import cz.inqool.uas.indihu.service.SettingsService;
import cz.inqool.uas.indihu.service.notification.IndihuNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

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

    private MessageRepository messageRepository;

    private HelperService helperService;

    private SettingsService settingsService;

    private IndihuNotificationService notificationService;

    private PinRepository pinRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private ExpositionDesignMapper expositionDesignMapper;

    private final Logger log = LoggerFactory.getLogger("Api");

    private static final Marker MARKER = MarkerFactory.getMarker("API");

    /**
     * Method to get all {@link Exposition} in which current user is an author or a collaborator
     *
     * @return {@link Collection} of {@link ExpositionDto}
     */
    public Result<ExpositionDto> getUserInProgress(Params params, boolean showPinned) {
        if (!helperService.isAdmin()) {
            addPrefilter(params, buildUserFilters());
        }

        if (showPinned) {
            return getPinnedExpos(params);
        }

        Result<ExpositionDto> result = new Result<>();
        Result<Exposition> expositions = repository.findAll(params);

        if (expositions != null && !expositions.getItems().isEmpty()) {
            List<ExpositionDto> results = toDto(expositions.getItems());
            result.setItems(results);
        }

        result.setCount(expositions != null ? expositions.getCount() : 0);
        return result;
    }

    /**
     * Gets all expositions where current user is author
     *
     * @return List of expositions
     */
    public List<ExpositionDto> getAllWhereCurrentIsAuthor() {
        User current = helperService.getCurrent();
        if (current == null) {
            throw new IllegalStateException("No logged in user.");
        }

        return toDto(repository.findByAuthor(current.getId()));
    }

    /**
     * Method to get all ongoing {@link Exposition}
     *
     * @return {@link Collection} of {@link ExpositionDto}
     */
    public Collection<ExpositionDto> getAllCurrent(Params params) {
        Collection<ExpositionDto> current = new ArrayList<>();
        repository.findAllRunning(params).forEach(exposition -> current.add(convert(exposition, false, null)));
        return current;
    }

    /**
     * Gets an {@link Exposition} with defined url which is already open
     *
     * @param url url for an {@link Exposition}
     * @return {@link Exposition}
     */
    public ExpositionClosedDto getByUrl(String url) {
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
            } else {
                return getClosed(found);
            }
        }
        return null;
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
        exposition.setLastEdit(Instant.now());
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
            exposition.setLastEdit(Instant.now());
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
            mapDesignFilesToExpo(exposition);
            return exposition;
        }
        return null;
    }

    /**
     * Returns {@link Exposition} specified by id
     *
     * @param expositionId of exposition to get
     * @return {@link Exposition}
     */
    public Exposition find(String expositionId) {
        Exposition exposition = repository.find(expositionId);
        notNull(exposition, () -> new MissingObject(Exposition.class, expositionId));
        if (collaboratorService.canView(expositionId)) {
            exposition.setExpoFiles(expositionFileService.getFiles(expositionId));
            mapDesignFilesToExpo(exposition);
            exposition.setCanEdit(collaboratorService.canEdit(expositionId));
            log.info(MARKER, "Exposition: User " + helperService.getCurrent().getUserName() + " opened exposition " + exposition.getId());
            return exposition;
        } else {
            return null;
        }
    }

    /**
     * returns flag if exposition is currently locked and username of user who is currently editing exposition
     *
     * @param expositionId of exposition to check
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
     * deletes exposition
     */
    @Transactional
    public boolean delete(String expositionId) {
        //exposition
        Exposition exposition = repository.find(expositionId);
        notNull(exposition, () -> new MissingObject("Exposition", expositionId));
        if (collaboratorService.canEdit(expositionId)) {
            List<String> collaboratorsEmails = collaboratorService.getCollaboratorsEmailsForExposition(expositionId);
            collaboratorService.removeAllCollaborators(expositionId);
            fileExpositionMapperRepository.removeAllInExposition(expositionId);
            expositionOpeningRepository.removeByExposition(expositionId);
            exposition.setLastEdit(Instant.now());
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
     * @param expositionId   to move
     * @param collaboratorId of person initiating the action
     * @return Exposition if successfull
     */
    @Transactional
    //todo add test, what should be returned if action is not supported?
    public Exposition move(String expositionId, String collaboratorId) {
        Exposition exposition = repository.find(expositionId);
        notNull(exposition, () -> new MissingObject(Exposition.class, expositionId));
        Collaborator old = collaboratorService.findById(collaboratorId);
        User owner = exposition.getAuthor();
        notNull(old, () -> new MissingObject(Collaborator.class, collaboratorId));
        if (collaboratorService.canEdit(expositionId)) {
            collaboratorService.addCollaboratorWithoutMailNotification(owner.getEmail(), exposition.getId(), CollaborationType.EDIT, false);
            collaboratorService.removeCollaboratorWithoutMail(exposition.getId(), collaboratorId);
            notificationService.notifyMovedExposition(owner.getEmail(), old.getCollaborator().getEmail(), exposition);
            exposition = find(expositionId);
            exposition.setAuthor(old.getCollaborator());
            log.info(MARKER, "Exposition: Exposition " + expositionId + " was moved from " + owner.getUserName() + " to " + old.getCollaborator().getUserName());
            exposition.setLastEdit(Instant.now());
            return repository.save(exposition);
        }
        return null;
    }

    @Transactional
    public boolean lock(String id) {
        Exposition exposition = repository.find(id);
        notNull(exposition, () -> new MissingObject(Exposition.class, id));
        Instant lastUpdated = exposition.getUpdated();
        exposition.setIsEditing(helperService.getCurrent().getUserName());
        exposition.setUpdated(Instant.now());
        exposition = repository.save(exposition);
        return exposition.getUpdated().isAfter(lastUpdated);
    }

    /**
     * Rates an exposition
     *
     * @param id        of exposition
     * @param ratingDto dto with rating data
     */
    @Transactional
    public void rate(String id, RatingDto ratingDto) {
        // it does not make sense to rate if rating was not specified
        if (!ratingDto.isSendWithoutRating() && (ratingDto.getRating() == null || !ratingDto.getPreferences().isValid())) {
            throw new BadArgument("Must specify a rating when rating an expo");
        }

        // it does not make sense to only send a message if there is no message
        if (ratingDto.isSendWithoutRating() && (ratingDto.getText() == null || ratingDto.getText().isEmpty())) {
            throw new BadArgument(ratingDto.getText());
        }

        Exposition exposition = repository.find(id);
        notNull(exposition, () -> new MissingObject(Exposition.class, id));

        if (exposition.getExpositionRating() == null) {
            exposition.setExpositionRating(new ExpositionRating());
            exposition.getExpositionRating().setExposition(exposition);
        }

        // if there is some text or a contact email save it as a message
        if ((ratingDto.getText() != null && !ratingDto.getText().isEmpty()) ||
                (ratingDto.getReviewerContactEmail() != null && !ratingDto.getReviewerContactEmail().isEmpty())) {
            sendMessageToAuthor(exposition, ratingDto.getReviewerContactEmail(), ratingDto.getRating(), ratingDto.getText());
        }

        if (!ratingDto.isSendWithoutRating()) {
            // assertion to avoid NPE
            if (ratingDto.getRating() == null) {
                throw new IllegalStateException("Rating dto does not contain a rating, but was specified to rate an exposition.");
            }

            ExpositionRating expositionRating = exposition.getExpositionRating();
            expositionRating.update(ratingDto);
            repository.save(exposition);
        }
    }

    private void sendMessageToAuthor(Exposition exposition, String contactEmail, Double rating, String text) {
        Message message = new Message();
        message.setExposition(exposition);
        message.setText(text);
        message.setRating(rating);
        message.setContactEmail(contactEmail);

        if (text != null && !text.isEmpty()) {
            notificationService.notifyAuthor(text, exposition);
        }

        messageRepository.save(message);
    }

    /**
     * Method adds design data to Exposition
     *
     * @param id                      of exposition
     * @param expositionDesignDataDto dto of design data
     * @return ExpositionDesignDataDto of added attributes
     */
    @Transactional
    public ExpositionDesignDataDto updateDesign(String id, ExpositionDesignDataDto expositionDesignDataDto) {
        Exposition exposition = repository.find(id);
        notNull(exposition, () -> new MissingObject(Exposition.class, id));

        ExpositionDesignData expositionDesignData = expositionDesignMapper.fromDto(expositionDesignDataDto);

        if (expositionDesignDataDto.getLogoFile() != null) {
            ExpoFile logoFile = expositionFileService.copyFileToExpo(exposition, expositionDesignDataDto.getLogoFile().getFileId());

            FileRef logoFileRef = expositionFileService.getFileRefUnopened(logoFile.getFileId());
            notNull(logoFileRef, () -> new MissingObject(FileRef.class, logoFile.getFileId()));

            expositionDesignDataDto.setLogoFile(logoFile);
            expositionDesignData.setLogoFileRef(logoFileRef);
        }

        if (expositionDesignDataDto.getDefaultInfopointIconFile() != null) {
            ExpoFile iconFile = expositionFileService.copyFileToExpo(exposition, expositionDesignDataDto.getDefaultInfopointIconFile().getFileId());

            FileRef iconFileRef = expositionFileService.getFileRefUnopened(iconFile.getFileId());
            notNull(iconFileRef, () -> new MissingObject(FileRef.class, iconFile.getId()));

            expositionDesignDataDto.setDefaultInfopointIconFile(iconFile);
            expositionDesignData.setDefaultInfopointIconFileRef(iconFileRef);
        }

        exposition.setExpositionDesignData(expositionDesignData);
        repository.save(exposition);

        return expositionDesignDataDto;
    }

    /**
     * Creates a JSON export of exposition
     *
     * @param id of exposition
     * @return a JSON string
     * @throws JsonProcessingException in case of ObjectMapper error
     */
    public String createExport(String id) throws JsonProcessingException {
        Exposition exposition = repository.find(id);
        notNull(exposition, () -> new MissingObject(Exposition.class, id));

        if (exposition.getExpositionDesignData() == null) {
            return null;
        }

        ExpositionDesignDataDto expositionDesignDataDto = expositionDesignMapper.toDto(exposition.getExpositionDesignData());
        List<ExpoFile> expoFiles = expositionFileService.getFiles(id);
        if (expoFiles != null) {
            if (exposition.getExpositionDesignData().getLogoFileRef() != null) {
                FileRef logoFile = exposition.getExpositionDesignData().getLogoFileRef();
                expositionDesignDataDto.setLogoFile(expositionFileService.getExpoFile(logoFile.getId()));
            }

            if (exposition.getExpositionDesignData().getDefaultInfopointIconFileRef() != null) {
                FileRef defaultInfopointIconFile = exposition.getExpositionDesignData().getDefaultInfopointIconFileRef();
                expositionDesignDataDto.setLogoFile(expositionFileService.getExpoFile(defaultInfopointIconFile.getId()));
            }
        }

        return objectMapper.writeValueAsString(expositionDesignDataDto);
    }

    /**
     * Increments the view counter of exposition
     *
     * @param id of exposition
     */
    @Transactional
    public void addView(String id) {
        Exposition exposition = Optional.ofNullable(repository.find(id))
                .orElseThrow(() -> new MissingObject(Exposition.class, id));
        exposition.setViewCounter(exposition.getViewCounter() == null ? 1 : exposition.getViewCounter() + 1);
        repository.save(exposition);
    }

    @Transactional
    public ExpositionDesignDataDto findDesign(String expoId) {
        Exposition exposition = Optional.ofNullable(repository.find(expoId)).orElseThrow(() -> new MissingObject(Exposition.class, expoId));
        return expositionDesignMapper.toDto(exposition.getExpositionDesignData());
    }

    private void mapCommonProperties(Exposition exposition, ExpositionClosedDto dto) {
        dto.setClosedCaption(exposition.getClosedCaption());
        dto.setClosedPicture(exposition.getClosedPicture());
        dto.setClosedUrl(exposition.getClosedUrl());
        dto.setState(exposition.getState());
        dto.setId(exposition.getId());
        dto.setCollaborators(exposition.getCollaborators());
        dto.setTags(exposition.getTags());
        dto.setStructure(exposition.getStructure());

        ExpositionDesignDataDto designDto = expositionDesignMapper.toDto(exposition.getExpositionDesignData());
        if (designDto == null) {
            return;
        }

        if (exposition.getExpositionDesignData().getLogoFileRef() != null) {
            FileRef logoFile = exposition.getExpositionDesignData().getLogoFileRef();
            designDto.setLogoFile(expositionFileService.getExpoFile(logoFile.getId()));
        }

        if (exposition.getExpositionDesignData().getDefaultInfopointIconFileRef() != null) {
            FileRef defaultInfopointIconFile = exposition.getExpositionDesignData().getDefaultInfopointIconFileRef();
            designDto.setDefaultInfopointIconFile(expositionFileService.getExpoFile(defaultInfopointIconFile.getId()));
        }

        dto.setExpositionDesignData(designDto);
    }

    /**
     * Converts {@link Exposition} into {@link ExpositionDto}
     *
     * @param exposition {@link Exposition} to convert
     * @param canEdit    flag if user is author or has collaborationType.Edit
     * @return {@link ExpositionDto} converted
     */
    private ExpositionDto convert(Exposition exposition, boolean canEdit, Pin pin) {
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
        dto.setLastEdit(exposition.getLastEdit());
        dto.setCanEdit((!currentlyEditing || helperService.getCurrent().getUserName().equals(exposition.getIsEditing())) && canEdit);
        dto.setCanDelete(helperService.getCurrent().equals(exposition.getAuthor()) || helperService.getCurrent().getRole() == UserRole.ROLE_ADMIN);
        dto.setCreated(exposition.getCreated());
        dto.setUrl(exposition.getUrl());

        if (pin != null) {
            dto.setPinnedAt(pin.getPinnedAt());
            dto.setPinned(true);
        }

        if (exposition.getAuthor() != null) {
            dto.setAuthorUsername(exposition.getAuthor().getUserName());
        }

        dto.setMessageCount(exposition.getMessages() != null ? exposition.getMessages().size() : 0L);
        dto.setViewCount(exposition.getViewCounter());

        if (exposition.getExpositionRating() != null) {
            dto.setRating(exposition.getExpositionRating().getAverage());
            dto.setRatingCount(exposition.getExpositionRating().getRatingCount());
            dto.setPreferences(exposition.getExpositionRating().getPreferences());
        }

        return dto;
    }


    private void mapDesignFilesToExpo(Exposition exposition) {
        if (exposition.getExpositionDesignData() == null || exposition.getExpoFiles() == null) {
            return;
        }

        ExpositionDesignData expositionDesignData = exposition.getExpositionDesignData();
        if (expositionDesignData.getLogoFileRef() != null) {
            String logoFileId = expositionDesignData.getLogoFileRef().getId();
            expositionDesignData.setLogoFile(exposition.getExpoFiles().stream()
                    .filter(file -> file.getFileId().equals(logoFileId)).findFirst()
                    .orElseThrow(() -> new IllegalStateException("File with id: " +
                            logoFileId + "is not mapped to exposition with id: " + exposition.getId())));
        }

        if (expositionDesignData.getDefaultInfopointIconFileRef() != null) {
            String infopointFileId = expositionDesignData.getDefaultInfopointIconFileRef().getId();
            expositionDesignData.setDefaultInfopointIconFile(exposition.getExpoFiles().stream()
                    .filter(file -> file.getFileId().equals(infopointFileId)).findFirst()
                    .orElseThrow(() -> new IllegalStateException("File with id: " +
                            infopointFileId + " ,is not mapped to exposition with id: " + exposition.getId())));
        }
    }

    private ExpositionUrl createExpositionUrl(Exposition exposition, String url) {
        ExpositionUrl expositionUrl = expositionUrlRepository.findByUrl(url);

        if (expositionUrl != null && !Objects.equals(expositionUrl.getExposition().getId(), exposition.getId())) {
            throw new InvalidAttribute(exposition, "url", url);
        }

        expositionUrl = expositionUrl == null ? new ExpositionUrl() : expositionUrl;

        expositionUrl.setExposition(exposition);
        expositionUrl.setUrl(url);
        return expositionUrlRepository.save(expositionUrl);
    }

    private ExpositionByUrlDto getOpened(Exposition exposition) {
        ExpositionByUrlDto dto = new ExpositionByUrlDto();
        mapCommonProperties(exposition, dto);

        dto.setAuthor(exposition.getAuthor());
        dto.setOrganization(exposition.getOrganization());
        dto.setStructure(exposition.getStructure());
        dto.setTitle(exposition.getTitle());
        dto.setUrl(exposition.getUrl());
        return dto;
    }

    private ExpositionClosedDto getClosed(Exposition exposition) {
        ExpositionClosedDto dto = new ExpositionClosedDto();
        mapCommonProperties(exposition, dto);
        return dto;
    }

    private Result<ExpositionDto> getPinnedExpos(Params params) {
        User loggedInUser = helperService.getCurrent();
        if (loggedInUser == null) {
            throw new IllegalStateException("No user logged in.");
        }

        List<Pin> pins = pinRepository.findPins(loggedInUser.getId(), params.getPage(), params.getPageSize());
        long pinCount = pinRepository.countPins(loggedInUser.getId());


        Result<ExpositionDto> result = new Result<>();
        result.setCount(pinCount);
        result.setItems(toDto(pins.stream().map(Pin::getExposition).collect(Collectors.toList())));
        return result;
    }

    private List<ExpositionDto> toDto(List<Exposition> items) {
        if (helperService.getCurrent() == null) {
            throw new IllegalStateException("No user logged in.");
        }

        Map<String, Pin> pins = pinRepository.findAllForUser(helperService.getCurrent().getId());

        return items.stream().map(expo -> {
            boolean canEdit = collaboratorService.canEdit(expo.getId());
            Pin pin = pins.get(expo.getId());
            return convert(expo, canEdit, pin);
        }).collect(Collectors.toList());
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

    @Autowired
    public void setExpositionDesignMapper(ExpositionDesignMapper expositionDesignMapper) {
        this.expositionDesignMapper = expositionDesignMapper;
    }

    @Autowired
    public void setPinRepository(PinRepository pinRepository) {
        this.pinRepository = pinRepository;
    }

    @Autowired
    public void setMessageRepository(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }
}
