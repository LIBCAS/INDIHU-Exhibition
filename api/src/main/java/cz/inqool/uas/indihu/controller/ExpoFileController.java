package cz.inqool.uas.indihu.controller;

import cz.inqool.uas.exception.BadArgument;
import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.file.FileRef;
import cz.inqool.uas.file.FileRepository;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.FileExpositionMapper;
import cz.inqool.uas.indihu.entity.dto.ExpoFile;
import cz.inqool.uas.indihu.repository.ExpositionRepository;
import cz.inqool.uas.indihu.repository.FileExpositionMapperRepository;
import cz.inqool.uas.indihu.service.CollaboratorService;
import cz.inqool.uas.indihu.service.ExpositionFileService;
import io.swagger.annotations.*;
import org.apache.commons.io.FilenameUtils;
import org.apache.http.entity.ContentType;
import org.apache.tika.exception.TikaException;
import org.imgscalr.Scalr;
import org.jgroups.stack.StateTransferInfo;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;
import org.yaml.snakeyaml.emitter.ScalarAnalysis;

import javax.annotation.security.RolesAllowed;
import javax.imageio.ImageIO;
import javax.inject.Inject;
import javax.sound.sampled.UnsupportedAudioFileException;
import javax.transaction.Transactional;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import static cz.inqool.uas.util.Utils.notNull;


@RequestMapping("/api/file")
@RestController
@Api(value = "expoFileController", description = "Controller to manage exposition files")
public class ExpoFileController {

    private FileRepository repository;

    private ExpositionRepository expositionRepository;

    private FileExpositionMapperRepository fileExpositionMapperRepository;

    private ExpositionFileService expositionFileService;

    private CollaboratorService collaboratorService;

    /**
     * Uploads a file.
     * <p>
     * <p>
     * File should be uploaded as multipart/form-data.
     * </p>
     *
     * @param uploadFile Provided file with metadata
     * @param index      Should be the content of file indexed
     * @return Reference to a stored file
     */
    @ApiOperation(value = "Uploads a file and returns the reference to the stored file.Required role of editor",
            notes = "File should be uploaded as multipart/form-data.",
            response = ExpoFile.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successful response", response = FileRef.class)})
    @RequestMapping(value = "/", method = RequestMethod.POST)
    @RolesAllowed("ROLE_EDITOR")
    @Transactional
    public ExpoFile upload(@ApiParam(value = "Provided file with metadata", required = true)
                           @RequestParam("file") MultipartFile uploadFile,
                           @ApiParam(value = "Should be the content of file indexed")
                           @RequestParam(name = "index", defaultValue = "false") Boolean index,
                           @ApiParam(value = "exposition id")
                           @RequestParam(name = "id") String expositionId) throws UnsupportedAudioFileException, TikaException, SAXException {
        Exposition exposition = expositionRepository.find(expositionId);
        notNull(exposition, () -> new MissingObject("exposition", expositionId));
        if (collaboratorService.canEdit(expositionId)) {

            try (InputStream stream = uploadFile.getInputStream()) {
                String filename = uploadFile.getOriginalFilename();

                if (filename != null) {
                    filename = FilenameUtils.getName(filename);
                }

                String contentType = uploadFile.getContentType();

                FileExpositionMapper mapper = new FileExpositionMapper();
                ExpoFile expoFile = new ExpoFile();

                mapper.setExposition(expositionRepository.find(expositionId));
                if (contentType.equals("audio/mpeg") || contentType.equals("audio/mp3")) {
                    double duration = expositionFileService.getAudioDuration(stream);
                    mapper.setDuration(Math.round(duration));
                }
                if (contentType.equals("video/mp4")) {
                    double duration = expositionFileService.getVideoDuration(stream);
                    mapper.setDuration(Math.round(duration));
                }

                if (contentType.contains("image/")) {
                    BufferedImage img = ImageIO.read(stream);
                    BufferedImage resized = Scalr.resize(img, Scalr.Method.QUALITY, Scalr.Mode.AUTOMATIC, 400, 300);
                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                    String type = contentType.substring(contentType.indexOf("/") + 1);
                    ImageIO.write(resized, type, baos);
                    String thumbName = filename.substring(0, filename.lastIndexOf(".")) + "-thumbnail" + filename.substring(filename.lastIndexOf("."));
                    InputStream is = new ByteArrayInputStream(baos.toByteArray());
                    FileExpositionMapper mapper1 = new FileExpositionMapper();
                    mapper1.setExposition(exposition);
                    mapper1.setFile(repository.create(is, thumbName, contentType, false));
                    mapper1.setSize((long) baos.size());
                    expoFile.setThumbnailId(mapper1.getFile().getId());
                    fileExpositionMapperRepository.save(mapper1);

                }
                try (InputStream stream2 = uploadFile.getInputStream()) {
                    FileRef ref = repository.create(stream2, filename, contentType, index);
                    mapper.setFile(ref);
                    mapper.setSize(uploadFile.getSize());
                    mapper = fileExpositionMapperRepository.save(mapper);
                }

                expoFile.setName(filename);
                expoFile.setType(contentType);
                expoFile.setFileId(mapper.getFile().getId());
                expoFile.setSize(String.valueOf(uploadFile.getSize()));
                if (mapper.getDuration() != null) {
                    expoFile.setDuration(mapper.getDuration());
                }
                expoFile.setId(mapper.getId());
                return expoFile;
            } catch (IOException e) {
                throw new BadArgument("file");
            }
        }
        return null;
    }

    @ApiOperation(value = "Method to get details for a file")
    @RequestMapping(method = RequestMethod.GET, path = "/{id}")
    @RolesAllowed("ROLE_EDITOR")
    public ExpoFile getFileInfo(@ApiParam("ExpoFile or mapper id to look for details") @PathVariable("id") String mapperId) {
        FileExpositionMapper mapper = fileExpositionMapperRepository.find(mapperId);
        notNull(mapper, () -> new MissingObject("File mapper with id: ", mapperId));
        ExpoFile expoFile = new ExpoFile();
        expoFile.setId(mapperId);
        expoFile.setDuration(mapper.getDuration());
        expoFile.setSize(String.valueOf(mapper.getSize()));
        if (mapper.getFile() != null) {
            expoFile.setFileId(mapper.getFile().getId());
            expoFile.setType(mapper.getFile().getContentType());
            expoFile.setName(mapper.getFile().getName());
        }
        return expoFile;
    }

    @ApiOperation(value = "Endpoint to delete all files associated to exposition")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.DELETE, value = "/exposition/{id}")
    public boolean removeAllByExposition(@ApiParam("id of exposition to delete files for")
                                         @PathVariable("id") String expositionId) {
        if (collaboratorService.canEdit(expositionId)) {
            fileExpositionMapperRepository.removeAllInExposition(expositionId);
            return true;
        }
        return false;
    }

    @ApiOperation(value = "End point to remove a file")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.DELETE, value = "/{id}")
    @Transactional
    public boolean removeFile(@ApiParam("mapping file id to delte")
                              @PathVariable("id") String fileMapperId) {
        FileExpositionMapper mapper = fileExpositionMapperRepository.find(fileMapperId);
        notNull(mapper, () -> new MissingObject("FileExpositionMapper missing", fileMapperId));
        if (collaboratorService.canEdit(mapper.getExposition().getId())) {
            repository.del(mapper.getFile());
            fileExpositionMapperRepository.delete(mapper);
            return true;
        }
        return false;
    }

    @Inject
    public void setRepository(FileRepository repository) {
        this.repository = repository;
    }

    @Inject
    public void setExpositionRepository(ExpositionRepository expositionRepository) {
        this.expositionRepository = expositionRepository;
    }

    @Inject
    public void setFileExpositionMapperRepository(FileExpositionMapperRepository fileExpositionMapperRepository) {
        this.fileExpositionMapperRepository = fileExpositionMapperRepository;
    }

    @Inject
    public void setExpositionFileService(ExpositionFileService expositionFileService) {
        this.expositionFileService = expositionFileService;
    }

    @Inject
    public void setCollaboratorService(CollaboratorService collaboratorService) {
        this.collaboratorService = collaboratorService;
    }
}
