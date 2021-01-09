package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.indihu.entity.domain.QSettings;
import cz.inqool.uas.indihu.entity.domain.Settings;
import cz.inqool.uas.store.DomainStore;
import org.springframework.stereotype.Repository;

@Repository
public class SettingsRepository extends DomainStore<Settings, QSettings> {
    public SettingsRepository() {
        super(Settings.class, QSettings.class);
    }
}
