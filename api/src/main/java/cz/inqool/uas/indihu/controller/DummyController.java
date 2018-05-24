package cz.inqool.uas.indihu.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;

/**
 * Created by Michal on 20. 7. 2017.
 */
@Api("dummy controller pouzivany na patrikov login")
@RestController
@RequestMapping("/api/dummy")
@RolesAllowed("ROLE_EDITOR")
public class DummyController {

    @ApiOperation(value = "dummy volanie ktore prihlasenemu uzivatelovi vrati \"Hello world!\"")
    @ApiResponses(value = {
            @ApiResponse(code = 200,message = "successful login"),
            @ApiResponse(code = 403, message = "incorrect information, user may not exists")
    })
    @RequestMapping(method = RequestMethod.GET,path = "/")
    public String dummy(){
        return "\"Hello world!\"";
    }

}
