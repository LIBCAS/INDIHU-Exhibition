package cz.inqool.uas.indihu.service.exposition;

import cz.inqool.uas.exception.BadArgument;
import cz.inqool.uas.exception.ConflictObject;
import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.repository.ExpositionRepository;
import cz.inqool.uas.indihu.repository.UserRepository;
import cz.inqool.uas.indihu.service.HelperService;
import cz.inqool.uas.indihu.service.dto.TransferDto;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for transferring expositions
 *
 * @author Filip Kollár
 */
@Service
@Slf4j
public class ExpositionTransferService {

    private final UserRepository userRepository;

    private final ExpositionRepository expositionRepository;

    private final HelperService helperService;

    @Value("${expositions.default-owner-id}")
    @Setter
    private String defaultOwnerId;

    @Autowired
    public ExpositionTransferService(UserRepository userRepository,
                                     ExpositionRepository expositionRepository,
                                     HelperService helperService) {
        this.userRepository = userRepository;
        this.expositionRepository = expositionRepository;
        this.helperService = helperService;
    }

    /**
     * Operations transfers all expos to default configured owner
     *
     * @param transferDto TransferDto containing all expos to transfer
     */
    @Transactional
    public void transferAll(TransferDto transferDto) {
        if (transferDto == null) {
            throw new BadArgument("transferDto");
        }

        User defaultOwner = validateDefaultOwner();
        List<Exposition> expositions = expositionRepository.findAllInList(transferDto.getExpositionIds());

        expositions.forEach(expo -> {
            if (helperService.getCurrent().equals(expo.getAuthor()) || helperService.isAdmin()) {
                expo.setAuthor(defaultOwner);
                expositionRepository.save(expo);
            } else {
                throw new ConflictObject(expo);
            }
        });

        log.info("Transferred: " + transferDto.getExpositionIds().size() + " to default owner: " + defaultOwnerId);
    }

    private User validateDefaultOwner() {
        if (defaultOwnerId == null) {
            throw new IllegalStateException("No default owner id specified.");
        }

        User defaultOwner = Optional.ofNullable(userRepository.find(defaultOwnerId))
                .orElseThrow(() -> new MissingObject(User.class, defaultOwnerId));

        if (defaultOwner.getRole().equals(UserRole.ROLE_ADMIN)) {
            return defaultOwner;
        } else {
            throw new IllegalStateException("Default configured owner has wrong role: " + defaultOwner.getRole());
        }
    }
}
