package cz.inqool.uas.indihu.service.exposition;

import cz.inqool.uas.exception.ConflictObject;
import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.index.dto.Params;
import cz.inqool.uas.index.dto.Result;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.enums.UserState;
import cz.inqool.uas.indihu.service.dto.TransferDto;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ExpositionTransferServiceTest extends SetUpTests {

    @Before
    public void init() {
        expositionTransferService.setDefaultOwnerId("test-owner");
    }

    @Test
    public void transfer() {
        User defaultUser = new User();
        defaultUser.setRole(UserRole.ROLE_ADMIN);
        defaultUser.setUserName("default user");
        defaultUser.setId("test-owner");
        defaultUser.setState(UserState.ACCEPTED);
        defaultUser = userRepository.save(defaultUser);

        helperService.setCurrent(editor);

        TransferDto transferDto = new TransferDto();
        transferDto.getExpositionIds().addAll(Arrays.asList(exposition.getId(), exposition1.getId()));
        expositionTransferService.transferAll(transferDto);

        Result<Exposition> expositions = expositionRepository.findByUser(defaultUser, new Params());
        assertEquals(2L, (long) expositions.getCount());
        assertTrue(expositions.getItems().contains(exposition));
        assertTrue(expositions.getItems().contains(exposition1));
    }

    @Test(expected = ConflictObject.class)
    public void transferForeign() {
        User defaultUser = new User();
        defaultUser.setRole(UserRole.ROLE_ADMIN);
        defaultUser.setUserName("default user");
        defaultUser.setId("test-owner");
        defaultUser.setState(UserState.ACCEPTED);
         userRepository.save(defaultUser);

        helperService.setCurrent(editor);

        TransferDto transferDto = new TransferDto();
        transferDto.getExpositionIds().add(exposition2.getId());
        expositionTransferService.transferAll(transferDto);
    }

    @Test(expected = MissingObject.class)
    public void noDefaultOwnerExists() {
        helperService.setCurrent(editor);

        TransferDto transferDto = new TransferDto();
        transferDto.getExpositionIds().add(exposition2.getId());
        expositionTransferService.transferAll(transferDto);
    }
}