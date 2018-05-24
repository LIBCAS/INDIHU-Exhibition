package cz.inqool.uas.indihu.service;

import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.indihu.entity.enums.RegistrationStatusEnum;
import org.junit.Test;

import static java.util.Arrays.asList;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class RegistrationServiceTest extends SetUpTests {

    @Test
    public void acceptTest(){
        int before = registrationRepository.findAll().size();
        registrationService.acceptRegistration(registration);
        int after = registrationRepository.findAll().size();
        assertThat(after,is(before -1));
    }

    @Test
    public void acceptAllTest(){
        registrationService.accept(asList(registration.getId(),registration1.getId()));
        int after = registrationRepository.findAll().size();
        assertThat(after,is(0));
    }

//    @Test
//    //fixme pocitat so settings service
//    public void automaticAcceptTest(){
//        registrationService.setCanRegister(true);
//        registrationService.setAutomatic(true);
//        RegistrationStatusEnum registrationStatusEnum = registrationService.register("user name","first","surname", "some@email.com"
//                ,"tvoj tatko records","password");
//        assertThat(registrationStatusEnum, is(RegistrationStatusEnum.AUTOMATIC));
//        assertThat(helperService.getCurrent().getEmail(),is("some@email.com"));
//    }

    //fixme pocitat so settings service
//    @Test
//    public void createRegistrationTest(){
//        registrationService.setCanRegister(true);
//        registrationService.setAutomatic(false);
//        RegistrationStatusEnum registrationStatusEnum = registrationService.register("user name","first","surname", "some@email.com"
//                ,"tvoj tatko records","password");
//        assertThat(registrationStatusEnum, is(RegistrationStatusEnum.IN_QUEUED));
//    }

    //fixme pocitat so settings service
//    @Test
//    public void forbiddenRegistrationTest(){
//        registrationService.setCanRegister(false);
//        registrationService.setAutomatic(false);
//        RegistrationStatusEnum registrationStatusEnum = registrationService.register("user name","first","surname", "some@email.com"
//                ,"tvoj tatko records","password");
//        assertThat(registrationStatusEnum, is(RegistrationStatusEnum.FORBIDDEN));
//    }
}
