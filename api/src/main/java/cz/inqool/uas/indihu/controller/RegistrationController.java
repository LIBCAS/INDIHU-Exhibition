package cz.inqool.uas.indihu.controller;

import cz.inqool.uas.indihu.entity.enums.RegistrationStatusEnum;
import cz.inqool.uas.indihu.service.RegistrationService;
import cz.inqool.uas.indihu.service.SettingsService;
import io.swagger.annotations.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Michal on 26. 7. 2017.
 */
@Api(value = "registrationController", description = "Controller to manage user registrations.")
@RestController
@RequestMapping("/api/registration")
public class RegistrationController {

    private RegistrationService service;

    private SettingsService settingsService;

    @ApiOperation("Creates a new registration for user")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Registration in queue, needs to verify email first, to be accepted by admin"),
            @ApiResponse(code = 403, message = "Registration currently forbidden."),
            @ApiResponse(code = 418, message = "I'm a teapot. Also something went terribly wrong"),
            @ApiResponse(code = 500, message = "Json parser error"),
            @ApiResponse(code = 409, message = "Account with such email already exists"),
            @ApiResponse(code = 412, message = "User with given user name exists in LDAP, redirect to login page")
    })
    @RequestMapping(method = RequestMethod.POST, value = "/")
    public ResponseEntity register(@ApiParam("user name")
                                   @RequestParam(value = "userName") String userName,
                                   @ApiParam("first name") @RequestParam("firstName") String firstName,
                                   @ApiParam("surname") @RequestParam("surname") String surname,
                                   @ApiParam("email") @RequestParam("email") String email,
                                   @ApiParam("institution") @RequestParam("institution") String institution,
                                   @ApiParam("password") @RequestParam("password") String password) {
        RegistrationStatusEnum register = service.register(userName, firstName, surname, email, institution, password);
        switch (register) {
            case FORBIDDEN:
                return new ResponseEntity(HttpStatus.FORBIDDEN);
            case PARSE_EXCEPTION:
                return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
            case CREATED:
                return new ResponseEntity(HttpStatus.CREATED);
            case EMAIL_EXISTS:
                return new ResponseEntity(HttpStatus.CONFLICT);
            case IN_LDAP:
                return new ResponseEntity(HttpStatus.PRECONDITION_FAILED);
            default:
                return new ResponseEntity(HttpStatus.I_AM_A_TEAPOT);
        }
    }

    @ApiOperation("EndPoint to determine whether registrations are available")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "registration is available"),
            @ApiResponse(code = 403, message = "registration is currently unavailable")
    })
    @RequestMapping(method = RequestMethod.GET, value = "/available")
    public ResponseEntity canRegister() {
        if (settingsService.isRegistrationAllowed()) {
            return new ResponseEntity(HttpStatus.OK);
        } else {
            return new ResponseEntity(HttpStatus.FORBIDDEN);
        }
    }

    @ApiOperation("Endpoint to verify email by registration secret")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Registration in queue, needs to be accepted by admin"),
            @ApiResponse(code = 202, message = "Registration accepted, user is logged in."),
            @ApiResponse(code = 418, message = "I'm a teapot. Also something went terribly wrong")
    })
    @RequestMapping(method = RequestMethod.PUT, value = "/secret/{secret}")
    public ResponseEntity verifyEmail(@ApiParam("User registration secret")
                                      @PathVariable("secret") String secret,
                                      HttpServletResponse response) {
        switch (service.verify(secret,response)) {
            case IN_QUEUED:
                return new ResponseEntity(HttpStatus.CREATED);
            case AUTOMATIC:
                return new ResponseEntity(HttpStatus.ACCEPTED);
            case REJECTED:
                return new ResponseEntity(HttpStatus.CONFLICT);
            case ALREADY_ACCEPTED:
                return new ResponseEntity(HttpStatus.OK);
            case ALREADY_VERIFIED:
                return new ResponseEntity(HttpStatus.NOT_MODIFIED);
            default:
                return new ResponseEntity(HttpStatus.I_AM_A_TEAPOT);
        }
    }

    @Inject
    public void setService(RegistrationService service) {
        this.service = service;
    }

    @Inject
    public void setSettingsService(SettingsService settingsService) {
        this.settingsService = settingsService;
    }
}
