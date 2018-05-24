package cz.inqool.uas.indihu.controller;

import cz.inqool.uas.file.FileRefStore;
import cz.inqool.uas.file.IndexedFileRef;
import cz.inqool.uas.indihu.entity.indexed.IndexedUser;
import cz.inqool.uas.indihu.repository.ExpositionRepository;
import cz.inqool.uas.indihu.repository.RegistrationRepository;
import cz.inqool.uas.indihu.repository.UserRepository;
import cz.inqool.uas.report.ReportStore;
import cz.inqool.uas.sequence.SequenceStore;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;

@RestController
@RolesAllowed("ROLE_ADMIN")
@Slf4j
@RequestMapping("/api/reindex")
public class ReindexController {

    private ElasticsearchTemplate template;

    private UserRepository userRepository;

    private RegistrationRepository registrationRepository;

    private FileRefStore fileRefStore;

    private SequenceStore sequenceStore;

    private ReportStore reportStore;

    private ExpositionRepository expositionRepository;

    @ApiOperation("Endpoint to reindex all indexable stores")
    @RequestMapping(method = RequestMethod.POST)
    public void reindex() {

        if (template.indexExists("indihu")) {
            template.deleteIndex("indihu");
        }

        if (template.indexExists("uas")) {
            template.deleteIndex("uas");
        }

        template.createIndex(IndexedUser.class);
        template.createIndex(IndexedFileRef.class);

        log.info("Reindexing user repository.");
        userRepository.reindex();
        log.info("Reindexing user repository finished.");

        log.info("Reindexing registration repository.");
        registrationRepository.reindex();
        log.info("Reindexing registration reposiory finished.");

        log.info("Reindexing file ref store.");
        fileRefStore.reindex();
        log.info("Reindexing file ref store complete.");
        log.info("Reindexing sequence store.");
        sequenceStore.reindex();
        log.info("Reindexing sequence store complete.");
        log.info("Reindexing report store.");
        reportStore.reindex();
        log.info("Reindexing report store complete.");
        log.info("Reindexing exposition store.");
        expositionRepository.reindex();
        log.info("Reindexing exposition store complete.");
    }

    @Inject
    public void setTemplate(ElasticsearchTemplate template) {
        this.template = template;
    }

    @Inject
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Inject
    public void setRegistrationRepository(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    @Inject
    public void setFileRefStore(FileRefStore fileRefStore) {
        this.fileRefStore = fileRefStore;
    }

    @Inject
    public void setSequenceStore(SequenceStore sequenceStore) {
        this.sequenceStore = sequenceStore;
    }

    @Inject
    public void setReportStore(ReportStore reportStore) {
        this.reportStore = reportStore;
    }

    @Inject
    public void setExpositionRepository(ExpositionRepository expositionRepository) {
        this.expositionRepository = expositionRepository;
    }
}
