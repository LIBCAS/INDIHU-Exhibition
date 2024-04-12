package cz.inqool.uas.indihu.service.exposition;

import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.indihu.entity.domain.Pin;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;


public class ExpositionPinServiceTest extends SetUpTests {

    @Test
    public void pin() {
        expositionPinService.pin(exposition.getId());

        List<Pin> pins = pinRepository.findPins(helperService.getCurrent().getId(), 0, 10);
        assertEquals(1, pins.size());
    }

    @Test
    public void unPin() {
        expositionPinService.pin(exposition.getId());

        expositionPinService.unpin(exposition.getId());
        List<Pin> pins = pinRepository.findPins(helperService.getCurrent().getId(), 0, 10);
        assertEquals(0, pins.size());
    }
}