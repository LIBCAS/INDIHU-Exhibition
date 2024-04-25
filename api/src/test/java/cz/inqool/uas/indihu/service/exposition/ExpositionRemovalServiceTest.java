package cz.inqool.uas.indihu.service.exposition;

import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.index.dto.Params;
import cz.inqool.uas.index.dto.Result;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ExpositionRemovalServiceTest extends SetUpTests {

    @Test
    public void removeAllForEditor() {
        Result<Exposition> editorExpositions = expositionRepository.findByUser(editor, new Params());
        assertEquals(3L, (long) editorExpositions.getCount());

        expositionRemovalService.removeAllFromUser(editor);

        Result<Exposition> editorExpositionsAfter = expositionRepository.findByUser(editor, new Params());
        assertEquals(0L, (long) editorExpositionsAfter.getCount());
    }
}