package cz.inqool.uas.indihu.service.exposition;

import com.coremedia.iso.IsoFile;
import com.googlecode.mp4parser.DataSource;
import com.googlecode.mp4parser.MemoryDataSourceImpl;
import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.file.FileRef;
import cz.inqool.uas.file.FileRepository;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.FileExpositionMapper;
import cz.inqool.uas.indihu.entity.dto.ExpoFile;
import cz.inqool.uas.indihu.entity.mapper.FileMapper;
import cz.inqool.uas.indihu.repository.FileExpositionMapperRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.mp3.Mp3Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static cz.inqool.uas.util.Utils.notNull;
import static java.lang.String.format;

@Slf4j
@Service
public class ExpositionFileService {

    private FileExpositionMapperRepository fileExpositionMapperRepository;

    private FileRepository fileRepository;

    private FileMapper fileMapper;

    /**
     * Returns files associated with exposition
     *
     * @param expositionId id of exposition
     * @return {@link List} of {@link ExpoFile}
     */
    public List<ExpoFile> getFiles(String expositionId) {
        List<FileExpositionMapper> mappers = fileExpositionMapperRepository.getForExposition(expositionId);
        List<ExpoFile> files = new ArrayList<>();
        for (FileExpositionMapper mapper : mappers) {
            if (mapper.getFile() != null) {
                ExpoFile file = new ExpoFile();
                file.setId(mapper.getId());
                file.setFileId(mapper.getFile().getId());
                file.setName(mapper.getFile().getName());
                file.setSize(String.valueOf(mapper.getSize()));
                file.setDuration(mapper.getDuration());
                file.setType(mapper.getFile().getContentType());
                if (mapper.getFile().getContentType() != null && mapper.getFile().getContentType().contains("/image")) {
                    file.setThumbnailId(mapper.getFile().getId());
                }
                files.add(file);
            }
        }
        return !files.isEmpty() ? files : null;
    }

    /**
     * Gets duration in seconds of mp3 file
     *
     * @param stream {@link InputStream} of file to ger duration for
     * @return length in seconds
     */
    public double getAudioDuration(InputStream stream) throws TikaException, SAXException, IOException {
        //detecting the file type
        BodyContentHandler handler = new BodyContentHandler();
        Metadata metadata = new Metadata();
        ParseContext parseContext = new ParseContext();

        //Mp3 parser
        Mp3Parser Mp3Parser = new Mp3Parser();
        Mp3Parser.parse(stream, handler, metadata, parseContext);
        try {
            double duration = Double.parseDouble(metadata.get("xmpDM:duration"));
            return duration / 1000d;
        } catch (NullPointerException e) {
            return 0d;
        }

    }

    /**
     * Gets duration of mp4 encoded video file in seconds
     *
     * @param stream {@link InputStream} of video
     * @return duration in seconds
     */
    public double getVideoDuration(InputStream stream) throws IOException {
        DataSource source = new MemoryDataSourceImpl(IOUtils.toByteArray(stream));
        IsoFile video = new IsoFile(source);
        if (video.getMovieBox() != null) {
            double lengthInSeconds = (double)
                    video.getMovieBox().getMovieHeaderBox().getDuration() /
                    video.getMovieBox().getMovieHeaderBox().getTimescale();
            System.out.println(lengthInSeconds);
            return lengthInSeconds;
        }
        return 0d;
    }

    /**
     * Ensures that one particular exposition contains files with unique filenames. If a file with already existing
     * filename is being uploaded, a numbered suffix is added to its name.
     *
     * @param expositionId id of the exposition
     * @param filename     name of the file being uploaded
     * @return unique filename for an exposition (possibly extended by a numbered suffix)
     */
    public String ensureUniqueFilename(String expositionId, String filename) {
        List<ExpoFile> files = getFiles(expositionId);
        if (files != null) {
            Set<String> existingNames = files.stream()
                    .map(ExpoFile::getName)
                    .collect(Collectors.toSet());

            int fileCounter = 1;
            String baseName = FilenameUtils.getBaseName(filename);
            String extension = FilenameUtils.getExtension(filename);

            while (existingNames.contains(filename)) {
                filename = format("%s_%d.%s", baseName, fileCounter++, extension);
            }
        }

        return filename;
    }

    /**
     * Method checks if exposition already is associated with the file,
     * if it is not it creates a copy and maps it to exposition
     *
     * @param exposition to look for files
     * @param fileId     file to look for
     * @return FileRef of created or existing file
     */
    @Transactional
    public ExpoFile copyFileToExpo(Exposition exposition, String fileId) {
        FileRef fileRef = fileRepository.get(fileId);
        notNull(fileRef, () -> new MissingObject(FileRef.class, fileId));

        List<ExpoFile> expositionFiles = getFiles(exposition.getId());

        if (expositionFiles == null) {
            expositionFiles = new ArrayList<>();
        }

        Optional<ExpoFile> first = expositionFiles.stream().filter(expoFile -> expoFile.getFileId().equals(fileId)).findFirst();

        if (first.isPresent()) {
            return first.get();
        }

        String name = ensureUniqueFilename(exposition.getId(), fileRef.getName());

        FileRef copy = fileRepository.create(fileRef.getStream(), name, fileRef.getContentType(), false);

        FileExpositionMapper fileExpositionMapper = new FileExpositionMapper();
        fileExpositionMapper.setFile(copy);
        fileExpositionMapper.setExposition(exposition);
        fileExpositionMapper.setSize(fileRef.getSize());
        fileExpositionMapperRepository.save(fileExpositionMapper);

        return fileMapper.toExpoFile(fileExpositionMapper);
    }

    /**
     * Method for providing dto of file
     *
     * @param id of file
     * @return ExpoFile if found
     */
    public ExpoFile getExpoFile(String id) {
        return fileMapper.toExpoFile(fileExpositionMapperRepository.findByFileId(id));
    }

    /**
     * Method for getting FileRef using delegate {@link FileRepository}
     *
     * @param id of file
     * @return FileRef if found
     */
    public FileRef getFileRefUnopened(String id) {
        return fileRepository.getRef(id);
    }

    @Inject
    public void setFileExpositionMapperRepository(FileExpositionMapperRepository fileExpositionMapperRepository) {
        this.fileExpositionMapperRepository = fileExpositionMapperRepository;
    }

    @Autowired
    public void setFileRepository(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Autowired
    public void setFileMapper(FileMapper fileMapper) {
        this.fileMapper = fileMapper;
    }
}
