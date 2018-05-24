package cz.inqool.uas.indihu.controllers;

import cz.inqool.uas.helper.ApiTest;
import cz.inqool.uas.indihu.controller.DummyController;
import org.junit.Before;
import org.junit.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class DummyControllerTest implements ApiTest {

    protected DummyController dummyController;

    @Before
    public void setUp(){
        dummyController = new DummyController();
    }

    @Test
    public void successfulLogin() throws Exception {
        mvc(dummyController).perform(get("/api/dummy/"))
                .andExpect(status().isOk());
    }
}
