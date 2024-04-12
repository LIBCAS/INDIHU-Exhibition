package cz.inqool.uas.indihu.entity.mapper;

import cz.inqool.uas.indihu.entity.domain.FileExpositionMapper;
import cz.inqool.uas.indihu.entity.dto.ExpoFile;
import org.springframework.stereotype.Component;

@Component
public class FileMapper {

    public ExpoFile toExpoFile(FileExpositionMapper fileExpositionMapper) {
        ExpoFile expoFile = new ExpoFile();
        expoFile.setFileId(fileExpositionMapper.getFile().getId());
        expoFile.setType(fileExpositionMapper.getFile().getContentType());
        expoFile.setDuration(fileExpositionMapper.getDuration());
        expoFile.setSize(String.valueOf(fileExpositionMapper.getSize()));
        expoFile.setName(fileExpositionMapper.getFile().getName());
        expoFile.setId(fileExpositionMapper.getId());

        return expoFile;
    }
}
