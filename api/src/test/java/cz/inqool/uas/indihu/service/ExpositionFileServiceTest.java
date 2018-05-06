package cz.inqool.uas.indihu.service;

import cz.inqool.uas.file.FileRef;
import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.indihu.entity.domain.FileExpositionMapper;
import cz.inqool.uas.indihu.repository.FileExpositionMapperRepository;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

public class ExpositionFileServiceTest extends SetUpTests {

    @Test
    public void ensureUniqueFilenameTest() {
        FileExpositionMapperRepository mock = Mockito.mock(FileExpositionMapperRepository.class);
        expositionFileService.setFileExpositionMapperRepository(mock);

        FileRef file1 = new FileRef();
        file1.setName("filename.mp4");

        FileRef file2 = new FileRef();
        file2.setName("filename_1.mp4");

        FileRef file3 = new FileRef();
        file3.setName("filename_other.mp4");

        List<FileExpositionMapper> fems = Stream.of(file1, file2, file3).map(fileRef -> {
            FileExpositionMapper fem = new FileExpositionMapper();
            fem.setFile(fileRef);
            return fem;
        }).collect(Collectors.toList());

        when(mock.getForExposition(any())).thenReturn(fems);

        String uniqueFilename = expositionFileService.ensureUniqueFilename(exposition.getId(), file1.getName());

        assertNotEquals(file1.getName(), uniqueFilename);
        assertNotEquals(file2.getName(), uniqueFilename);
        assertNotEquals(file3.getName(), uniqueFilename);
        assertEquals("filename_2.mp4", uniqueFilename);
    }
}
