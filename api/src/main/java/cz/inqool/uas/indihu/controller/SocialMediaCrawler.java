package cz.inqool.uas.indihu.controller;

import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.file.FileRefStore;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.repository.ExpositionRepository;
import cz.inqool.uas.store.Transactional;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Map;
import java.util.TreeMap;

import static cz.inqool.uas.util.Utils.notNull;

@RestController
@RequestMapping("/api/crawler")
@RolesAllowed("ROLE_ADMIN")
@Api(value = "adminController", description = "Controller to manage admin settings.")
public class SocialMediaCrawler {

    private String ogImage;

    private String siteName;

    private String url;

    private String filePath;

    private String defaultPreview;

    private ExpositionRepository expositionRepository;

    private FileRefStore fileRefStore;

    @RequestMapping(value = "/ogimage", method = RequestMethod.GET, produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<InputStreamResource> getOGImage() throws FileNotFoundException {
        File logo = new File(ogImage);
        if (!logo.exists() || !logo.isFile()) {
            throw new IllegalStateException("Wrong path to logo file configured: " + logo.getPath());
        }

        return ResponseEntity.ok()
                .contentLength(logo.length())
                .contentType(MediaType.IMAGE_JPEG)
                .lastModified(logo.lastModified())
                .body(new InputStreamResource(new FileInputStream(logo), "Open Graph Image"));
    }


    @RequestMapping(value = "/exposition/{id}", method = RequestMethod.GET)
    @Transactional
    public String getExpositionImage(@PathVariable("id") String id, Map<String, Object> model) {
        Exposition exposition = expositionRepository.find(id);
        notNull(exposition, () -> new MissingObject(Exposition.class, id));
        model.putAll(createModelBasicAttributes(
                exposition.getTitle(),
                exposition.getPerex(),
                exposition.getUrl(),
                siteName
        ));

        String fileUrl = "";
        if (exposition.getPreviewPicture() != null) {
            fileUrl = url + filePath + exposition.getPreviewPicture();
        } else {
            fileUrl = url + filePath + exposition.getPreviewPicture();
        }
        model.putAll(createModelImgDefaultAttributes(fileUrl));

        return "crawler/detail";
    }

    private Map<String, Object> createModelBasicAttributes(String title, String description, String url, String platformName) {
        Map<String, Object> model = new TreeMap<>();
        model.put("title", title);
        model.put("description", description);
        model.put("url", url);
        model.put("siteName", platformName);
        model.put("type", "website");
        return model;
    }

    private Map<String, Object> createModelImgDefaultAttributes(String imgUrl) {
        return createModelImgAttributes(imgUrl, 330, 330);
    }

    private Map<String, Object> createModelImgAttributes(String imgUrl, int width, int height) {
        Map<String, Object> model = new TreeMap<>();
        model.put("imageUrl", imgUrl);
        model.put("imageUrlSecure", toSecureUrl(imgUrl));
//        model.put("imageAlt", alt); //nevedem, ak bude fungoat zmazat, ak nie tak vykoumat nieco ine
        model.put("imageType", "image/jpeg");
        model.put("imageWidth", width);
        model.put("imageHeight", height);
        return model;
    }

    private String toSecureUrl(String url) {
        if (!url.startsWith("https://")) {
            return url.replaceFirst("http://", "https://");
        }
        return url;
    }


    @Value("${file.logo}")
    public void setOgImage(String ogImage) {
        this.ogImage = ogImage;
    }

    @Value("${application.siteName}")
    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    @Value("${application.url}")
    public void setUrl(String url) {
        this.url = url;
    }

    @Value("${paths.file}")
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    @Value("${file.defaultPreview}")
    public void setDefaultPreview(String defaultPreview) {
        this.defaultPreview = defaultPreview;
    }

    @Inject
    public void setExpositionRepository(ExpositionRepository expositionRepository) {
        this.expositionRepository = expositionRepository;
    }

    @Inject
    public void setFileRefStore(FileRefStore fileRefStore) {
        this.fileRefStore = fileRefStore;
    }
}
