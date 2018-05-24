package cz.inqool.uas.indihu.service;

import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.index.dto.Params;
import cz.inqool.uas.index.dto.Result;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.dto.ExpositionByUrlDto;
import cz.inqool.uas.indihu.entity.dto.ExpositionDto;
import cz.inqool.uas.indihu.entity.dto.ExpositionEndedDto;
import cz.inqool.uas.indihu.entity.dto.LockedExpositionDto;
import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import org.junit.Ignore;
import org.junit.Test;

import java.util.Collection;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class ExpositionServiceTest extends SetUpTests{

    @Test
    public void usersInProgressTest(){

    }

//    @Test
//    public void getAllCurrentTest(){
//        Collection<ExpositionDto> expositionDtos = expositionService.getAllCurrent();
//        assertThat(expositionDtos.size(),is(1));
//    }

//    @Test
//    public void getByUrlTest(){
//        Exposition exposition123 = expositionService.getByUrl(exposition.getUrl());
//        assertNull(exposition123);
//        exposition123 = expositionService.getByUrl(exposition1.getUrl());
//        assertThat(exposition123,is(exposition1));
//    }

    @Test
    public void isSafeTest() {
        boolean safe = expositionService.isSafe(exposition.getUrl());
        assertThat(safe, is(false));
        safe = expositionService.isSafe("lukess je pan");
        assertThat(safe, is(true));
    }

    @Test
    public void createTest(){
        Exposition exposition123 = expositionService.create("pohar");
        assertNotNull(exposition123.getUrl());
        assertThat(exposition123.getAuthor(),is(helperService.getCurrent()));
        assertThat(exposition123.getState(),is(ExpositionState.PREPARE));
        assertThat(exposition123.getTitle(),is("pohar"));
        assertThat(exposition123.getIsEditing(),is(helperService.getCurrent().getUserName()));
    }

    @Test
    public void updateTest(){
        exposition.setTitle("badger badger");
        Exposition exposition123 = expositionService.update(exposition);

        assertThat(exposition123.getId(),is(exposition.getId()));
        assertThat(exposition123.getIsEditing(),is(helperService.getCurrent().getUserName()));
        assertThat(exposition123.getTitle(),is("badger badger"));
    }

    @Test
    public void findAssociatedTest(){
        Exposition found = expositionService.find(exposition.getId());
        assertThat(found, is(exposition));
    }

    @Test
    public void findUnassociatedTest(){
        Exposition found = expositionService.find(exposition4.getId());
        assertNull(found);
    }

    @Test
    public void deleteAuthorTest(){
        boolean deleted = expositionService.delete(exposition.getId());
        assertThat(deleted, is(true));
        Exposition deletedExposition = expositionRepository.find(exposition.getId());
        assertNull(deletedExposition);
    }

    @Test
    public void deleteNotAuthorTest(){
        boolean deleted = expositionService.delete(exposition2.getId());
        assertThat(deleted, is(false));
        Exposition deletedExposition = expositionRepository.find(exposition2.getId());
        assertNotNull(deletedExposition);
    }

    @Test
    public void getByUrlPreparedLoggedInAuthor(){
        ExpositionEndedDto found = expositionService.getByUrl(exposition.getUrl());
        assertThat(found, is(notNullValue()));
    }

    @Test
    public void getByUrlPreparedNotLoggedIn(){
        helperService.setCurrent(null);
        ExpositionEndedDto found = expositionService.getByUrl(exposition.getUrl());
        assertThat(found, is(nullValue()));
    }

    @Test
    public void getByUrlOpened(){
        ExpositionByUrlDto found = (ExpositionByUrlDto) expositionService.getByUrl(exposition1.getUrl());
        assertNotNull(found);
    }

    @Test
    public void getByUrlFinished(){
        ExpositionEndedDto found = expositionService.getByUrl(exposition2.getUrl());
        assertThat(found,is(notNullValue()));
    }

    @Test
    public void getCurrentTest(){
        Collection<ExpositionDto> expositions = expositionService.getAllCurrent(new Params());
        assertNotNull(expositions);
        assertThat(expositions.size(),is(2));
    }

    @Ignore
    @Test
    public void getUserInProgress(){
        //todo create elastic tests to run this
        Result<ExpositionDto> expositions = expositionService.getUserInProgress(new Params());
        assertThat(expositions.getItems().size(),is(3));
    }

    @Test
    public void isExpositionLockedTest(){
        exposition.setSubTitle("uplne novy podtitulok");
        exposition.setIsEditing(helperService.getCurrent().getUserName());
        expositionRepository.save(exposition);

        LockedExpositionDto dto = expositionService.isLocked(exposition.getId());
        assertThat(dto.isLocked(),is(true));
        assertThat(dto.getUserName(),is(helperService.getCurrent().getUserName()));
    }
}
