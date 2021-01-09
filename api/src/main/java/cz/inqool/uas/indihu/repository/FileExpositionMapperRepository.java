package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.file.FileRepository;
import cz.inqool.uas.indihu.entity.domain.FileExpositionMapper;
import cz.inqool.uas.indihu.entity.domain.QFileExpositionMapper;
import cz.inqool.uas.indihu.entity.dto.ExpoFile;
import cz.inqool.uas.store.DomainStore;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

@Repository
public class FileExpositionMapperRepository extends DomainStore<FileExpositionMapper, QFileExpositionMapper> {

    private FileRepository fileRepository;

    public FileExpositionMapperRepository() {
        super(FileExpositionMapper.class, QFileExpositionMapper.class);
    }

    /**
     * returns all files for exposition
     */
    public List<FileExpositionMapper> getForExposition(String expositionId) {
        QFileExpositionMapper qFileExpositionMapper = this.qObject();
        List<FileExpositionMapper> result = query()
                .select(qFileExpositionMapper)
                .where(qFileExpositionMapper.exposition.id.eq(expositionId))
                .fetch();
        detachAll();
        return result;
    }

    /**
     * deletes all files for exposition
     */
    public void removeAllInExposition(String expositionId) {
        QFileExpositionMapper mapper = this.qObject();

        List<FileExpositionMapper> mappers = query()
                .select(mapper)
                .where(mapper.exposition.id.eq(expositionId))
                .fetch();
        detachAll();
        Iterator<FileExpositionMapper> mapperIterator = mappers.iterator();
        FileExpositionMapper fileExpositionMapper;
        while (mapperIterator.hasNext()) {
            fileExpositionMapper = mapperIterator.next();
            fileRepository.del(fileExpositionMapper.getFile());
            delete(fileExpositionMapper);
        }
    }

    @Inject
    public void setFileRepository(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }
}
