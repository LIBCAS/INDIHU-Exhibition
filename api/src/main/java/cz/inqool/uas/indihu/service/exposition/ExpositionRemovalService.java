package cz.inqool.uas.indihu.service.exposition;

import cz.inqool.uas.file.FileRepository;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.repository.CollaboratorRepository;
import cz.inqool.uas.indihu.repository.ExpositionRepository;
import cz.inqool.uas.indihu.repository.FileExpositionMapperRepository;
import cz.inqool.uas.indihu.repository.PinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for deletion of expositions
 *
 * @author Filip Kollár
 */
@Service
public class ExpositionRemovalService {

    private final ExpositionRepository expositionRepository;

    private final FileExpositionMapperRepository fileExpositionMapperRepository;

    private final FileRepository fileRepository;

    private final PinRepository pinRepository;

    private final CollaboratorRepository collaboratorRepository;

    @Autowired
    public ExpositionRemovalService(ExpositionRepository expositionRepository,
                                    FileExpositionMapperRepository fileExpositionMapperRepository,
                                    FileRepository fileRepository, PinRepository pinRepository, CollaboratorRepository collaboratorRepository) {
        this.expositionRepository = expositionRepository;
        this.fileExpositionMapperRepository = fileExpositionMapperRepository;
        this.fileRepository = fileRepository;
        this.pinRepository = pinRepository;
        this.collaboratorRepository = collaboratorRepository;
    }

    /**
     * Deletes all expositions where user is author
     *
     * @param user to remove expositions for
     */
    @Transactional
    public void removeAllFromUser(User user) {
        collaboratorRepository.removeUserCollaborations(user.getId());
        pinRepository.removeUserPins(user.getId());
        expositionRepository.findByAuthor(user.getId()).forEach(this::removeExposition);
    }

    private void removeExposition(Exposition exposition) {
        fileExpositionMapperRepository.getForExposition(exposition.getId()).forEach(file -> {
            fileExpositionMapperRepository.delete(file);
            if (file.getFile() != null) {
                fileRepository.del(file.getFile());
            }
        });

        expositionRepository.remove(exposition);
    }
}
