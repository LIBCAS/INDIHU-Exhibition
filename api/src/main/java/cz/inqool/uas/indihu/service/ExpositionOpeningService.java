package cz.inqool.uas.indihu.service;

import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.ExpositionOpening;
import cz.inqool.uas.indihu.repository.ExpositionOpeningRepository;
import cz.inqool.uas.indihu.repository.ExpositionRepository;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.time.Instant;

/**
 * Created by Michal on 25. 7. 2017.
 */
@Service
public class ExpositionOpeningService {

    private CollaboratorService collaboratorService;

    private ExpositionOpeningRepository repository;

    private ExpositionRepository expositionRepository;

    private HelperService helperService;

    /**
     * Updates {@link ExpositionOpening}
     * @param opening {@link ExpositionOpening} to update to
     * @return updated {@link ExpositionOpening
     */
    public ExpositionOpening update(ExpositionOpening opening) {
        if (collaboratorService.canEdit(opening.getExposition().getId())) {
            return repository.save(opening);
        }
        return null;
    }

    /**
     * Creates {@link ExpositionOpening} with specified params if current user is eligible (ie. is author or have Edit permission)
     * @param expositionId id of exposition for creating an opening to
     * @param opening {@link Instant} of exposition opening
     * @return {@link ExpositionOpening}
     */
    public ExpositionOpening create(String expositionId, Instant opening) {
        if (collaboratorService.canEdit(expositionId)) {
            Exposition exposition = expositionRepository.find(expositionId);
            ExpositionOpening expositionOpening = new ExpositionOpening();
            expositionOpening.setAuthor(helperService.getCurrent());
            expositionOpening.setExposition(exposition);
            expositionOpening.setOpening(opening);
            return repository.save(expositionOpening);
        }
        return null;
    }

    /**
     * Gets an {@link ExpositionOpening} for specified {@link Exposition}
     * @param expositionId id of {@link Exposition}
     * @return {@link ExpositionOpening}
     */
    public ExpositionOpening findByExposition(String expositionId) {
        return repository.findByExposition(expositionId);
    }

    /**
     * Removes opening for exposition
     * @param expositionId id of {@link Exposition}
     */
    public void delete(String expositionId){
        ExpositionOpening opening = repository.findByExposition(expositionId);
        repository.delete(opening);
    }

    @Inject
    public void setCollaboratorService(CollaboratorService collaboratorService) {
        this.collaboratorService = collaboratorService;
    }

    @Inject
    public void setRepository(ExpositionOpeningRepository repository) {
        this.repository = repository;
    }

    @Inject
    public void setExpositionRepository(ExpositionRepository expositionRepository) {
        this.expositionRepository = expositionRepository;
    }

    @Inject
    public void setHelperService(HelperService helperService) {
        this.helperService = helperService;
    }
}
