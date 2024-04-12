package cz.inqool.uas.indihu.service;

import cz.inqool.uas.indihu.entity.domain.Settings;
import cz.inqool.uas.indihu.repository.SettingsRepository;
import cz.inqool.uas.store.Transactional;
import lombok.Getter;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

@Getter
@Service
public class SettingsService {

    private SettingsRepository repository;

    public Settings getSettings(){
        return repository.findAny();
    }

    @Transactional
    public Settings update(Settings settings){
        return repository.save(settings);
    }

    public boolean isRegistrationAutomatic(){
        return repository.findAny().isAutomaticRegistration();
    }

    public boolean isRegistrationAllowed(){
        return repository.findAny().isAllowedRegistration();
    }

    public int getLockDuration(){
        return repository.findAny().getLockDuration();
    }

    @Inject
    public void setSettingsRepository(SettingsRepository settingsRepository) {
        this.repository = settingsRepository;
    }
}
