package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.index.dto.Params;
import cz.inqool.uas.index.dto.Result;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.dto.ExpoFile;
import org.junit.Test;

import java.util.Collection;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class ExpositionTest extends SetUpTests {

    @Test
    public void getByUser(){
        Result<Exposition> expositions = expositionRepository.findByUser(editor, new Params());
        assertNotNull(expositions);
        List<Exposition> exp = expositions.getItems();
        for (int i = 0; i < expositions.getItems().size(); i++) {
            for (int j = i+1; j < expositions.getItems().size(); j++) {
                assertNotEquals(exp.get(i),exp.get(j));
            }
        }
        assertThat(expositions.getItems().size(),is(3));
    }

//    @Test
//    public void findRunning(){
//        List<Exposition> expositions = (List<Exposition>) expositionRepository.findAllRunning();
//        assertNotNull(expositions);
//        assertThat(expositions.size(),is(1));
//        assertThat(expositions.get(0).getAuthor(),is(editor));
//    }

//    @Test
//    public void  findAllUrls(){
//        Collection<String> urls = expositionRepository.findAllUrls();
//        assertNotNull(urls);
//        assertThat(urls.size(),is(4));
//    }

//    @Test(expected = IllegalArgumentException.class)
//    public void findByUrlFinishedNull(){
//        Exposition exposition3 = expositionRepository.findByUrlFinished(null);
//    }
//
//    @Test
//    public void findByUrlFinished(){
//        Exposition exposition3 = expositionRepository.findByUrlFinished("");
//        assertNull(exposition3);
//    }
//
//    @Test
//    public void findByUrlFinished1(){
//        Exposition exposition3 = expositionRepository.findByUrlFinished("some");
//        assertNotNull(exposition3);
//    }
}
