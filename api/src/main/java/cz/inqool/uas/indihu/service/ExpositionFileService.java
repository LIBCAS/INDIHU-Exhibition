package cz.inqool.uas.indihu.service;

import com.coremedia.iso.IsoFile;
import com.googlecode.mp4parser.DataSource;
import com.googlecode.mp4parser.MemoryDataSourceImpl;
import cz.inqool.uas.indihu.entity.domain.FileExpositionMapper;
import cz.inqool.uas.indihu.entity.dto.ExpoFile;
import cz.inqool.uas.indihu.repository.FileExpositionMapperRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.mp3.Mp3Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.lang.String.format;

@Slf4j
@Service
public class ExpositionFileService {

    private FileExpositionMapperRepository fileExpositionMapperRepository;

    /**
     * Returns files associated with exposition
     *
     * @param expositionId id of exposition
     * @return {@link List} of {@link ExpoFile}
     */
    public List<ExpoFile> getFiles(String expositionId) {
        List<FileExpositionMapper> mappers = fileExpositionMapperRepository.getForExposition(expositionId);
        List<ExpoFile> files = new ArrayList<>();
        mappers.forEach(fileExpositionMapper -> {
            if (fileExpositionMapper.getFile() != null) {
                ExpoFile file = new ExpoFile();
                file.setId(fileExpositionMapper.getFile().getId());
                file.setName(fileExpositionMapper.getFile().getName());
                files.add(file);
            }
        });
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

    @Inject
    public void setFileExpositionMapperRepository(FileExpositionMapperRepository fileExpositionMapperRepository) {
        this.fileExpositionMapperRepository = fileExpositionMapperRepository;
    }
}
