package cz.inqool.uas.indihu.service.exposition;

import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.Pin;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.repository.ExpositionRepository;
import cz.inqool.uas.indihu.repository.PinRepository;
import cz.inqool.uas.indihu.service.HelperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
public class ExpositionPinService {

    private PinRepository pinRepository;

    private ExpositionRepository expositionRepository;

    private HelperService helperService;

    @Transactional
    public void pin(String expositionId) {
        User user = Optional.ofNullable(helperService.getCurrent())
                .orElseThrow(() -> new IllegalStateException("No user logged in"));
        Exposition exposition = Optional.ofNullable(expositionRepository.find(expositionId))
                .orElseThrow(() -> new MissingObject(Exposition.class, expositionId));

        pinRepository.save(new Pin(user, exposition));
    }

    @Transactional
    public void unpin(String expositionId) {
        User user = Optional.ofNullable(helperService.getCurrent())
                .orElseThrow(() -> new IllegalStateException("No user logged in"));
        Exposition exposition = Optional.ofNullable(expositionRepository.find(expositionId))
                .orElseThrow(() -> new MissingObject(Exposition.class, expositionId));

        pinRepository.removePin(exposition.getId(), user.getId());
    }

    @Autowired
    public void setPinRepository(PinRepository pinRepository) {
        this.pinRepository = pinRepository;
    }

    @Autowired
    public void setExpositionRepository(ExpositionRepository expositionRepository) {
        this.expositionRepository = expositionRepository;
    }

    @Autowired
    public void setHelperService(HelperService helperService) {
        this.helperService = helperService;
    }
}
