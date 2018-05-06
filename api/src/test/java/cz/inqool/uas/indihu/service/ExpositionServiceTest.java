package cz.inqool.uas.indihu.service;

import cz.inqool.uas.exception.BadArgument;
import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.index.dto.Params;
import cz.inqool.uas.index.dto.Result;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.dto.*;
import cz.inqool.uas.indihu.entity.enums.ExpositionState;
import cz.inqool.uas.indihu.entity.enums.IndihuTag;
import cz.inqool.uas.indihu.entity.enums.LogoPosition;
import cz.inqool.uas.indihu.entity.enums.LogoType;
import org.junit.Ignore;
import org.junit.Test;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.*;

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
        assertNotNull(deletedExposition.getDeleted());
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
        ExpositionClosedDto found = expositionService.getByUrl(exposition.getUrl());
        assertThat(found, is(notNullValue()));
    }

    @Test
    @Ignore("Test is outdated")
    public void getByUrlPreparedNotLoggedIn(){
        helperService.setCurrent(null);
        ExpositionClosedDto found = expositionService.getByUrl(exposition.getUrl());
        assertNull(found);
    }

    @Test
    public void getByUrlOpened(){
        ExpositionByUrlDto found = (ExpositionByUrlDto) expositionService.getByUrl(exposition1.getUrl());
        assertNotNull(found);
    }

    @Test
    public void getByUrlFinished(){
        ExpositionClosedDto found = expositionService.getByUrl(exposition2.getUrl());
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
        Result<ExpositionDto> expositions = expositionService.getUserInProgress(new Params(), false);
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

    @Test
    public void rateExposition() {
        RatingDto ratingDto = new RatingDto();
        ratingDto.setRating(5d);
        ratingDto.getPreferences().setGame(true);

        expositionService.rate(exposition.getId(), ratingDto);
        expositionService.rate(exposition.getId(), ratingDto);

        expositionService.rate(exposition.getId(), ratingDto);

        Exposition actual = expositionService.find(exposition.getId());

        assertNotNull(actual.getExpositionRating().getGameCount());
        assertThat(actual.getExpositionRating().getGameCount(), is(3L));
        assertThat(actual.getExpositionRating().getAverage(), is(5d));
    }

    @Test
    public void sendMessageOnly() {
        RatingDto ratingDto = new RatingDto();
        ratingDto.setSendWithoutRating(true);
        ratingDto.setText("test not empty text");
        expositionService.rate(exposition.getId(), ratingDto);
    }

    @Test(expected = BadArgument.class)
    public void failSendMessageOnly() {
        RatingDto ratingDto = new RatingDto();
        ratingDto.setText("test not empty text");
        expositionService.rate(exposition.getId(), ratingDto);
    }

    @Test(expected = BadArgument.class)
    public void failNoMessage() {
        RatingDto ratingDto = new RatingDto();
        ratingDto.setSendWithoutRating(true);
        expositionService.rate(exposition.getId(), ratingDto);
    }

    @Test(expected = BadArgument.class)
    public void sendContactOnly() {
        RatingDto ratingDto = new RatingDto();
        ratingDto.setSendWithoutRating(true);
        ratingDto.setReviewerContactEmail("test@blabla.cz");
        expositionService.rate(exposition.getId(), ratingDto);
    }

    @Test
    public void rateOnly() {
        RatingDto ratingDto = new RatingDto();
        ratingDto.setRating(4d);
        ratingDto.getPreferences().setTopic(true);
        expositionService.rate(exposition.getId(), ratingDto);
    }

    @Test(expected = BadArgument.class)
    public void failRateOnly() {
        RatingDto ratingDto = new RatingDto();
        expositionService.rate(exposition.getId(), ratingDto);
    }


    @Test
    public void tagExposition() {
        Set<IndihuTag> tags = new HashSet<>();

        tags.add(IndihuTag.ART);
        tags.add(IndihuTag.HISTORY);
        tags.add(IndihuTag.NATURE);
        tags.add(IndihuTag.INFORMATIVE);
        tags.add(IndihuTag.FOR_MOBILES);
        tags.add(IndihuTag.FAMILY);

        exposition.setTags(tags);
        expositionRepository.save(exposition);

        Exposition retrieved = expositionRepository.find(exposition.getId());

        assertThat(retrieved.getTags().size(), is(6));
        assertThat(retrieved.getTags().containsAll(tags), is(true));
    }

    @Test
    public void addDesignData() {
        ExpositionDesignDataDto expositionDesignDataDto = new ExpositionDesignDataDto();
        expositionDesignDataDto.setBackgroundColor("#ffffff");
        expositionDesignDataDto.setLogoType(LogoType.WATERMARK);
        expositionDesignDataDto.setLogoPosition(LogoPosition.UPPER_RIGHT);

        expositionService.updateDesign(exposition.getId(), expositionDesignDataDto);

        Exposition retrieved = expositionRepository.find(exposition.getId());

        assertNotNull(retrieved.getExpositionDesignData());
        assertThat(retrieved.getExpositionDesignData().getBackgroundColor(), is("#ffffff"));
        assertThat(retrieved.getExpositionDesignData().getLogoPosition(), is(LogoPosition.UPPER_RIGHT));
        assertThat(retrieved.getExpositionDesignData().getLogoType(), is(LogoType.WATERMARK));
    }

    @Test
    public void addViews() {
        expositionService.addView(exposition.getId());
        expositionService.addView(exposition.getId());
        expositionService.addView(exposition.getId());

        Exposition retrieved = expositionRepository.find(exposition.getId());

        assertEquals(3L, retrieved.getViewCounter().longValue());
    }
}
