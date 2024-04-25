package cz.inqool.uas.indihu.controller;

import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.security.UserDelegate;
import cz.inqool.uas.indihu.security.oauth.OAuthConfigDto;
import cz.inqool.uas.indihu.security.oauth.OAuthProfileDetails;
import cz.inqool.uas.indihu.service.UserService;
import cz.inqool.uas.indihu.service.oauth.OAuthLoginException;
import cz.inqool.uas.indihu.service.oauth.OAuthService;
import cz.inqool.uas.security.jwt.JwtTokenProvider;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

import static cz.inqool.uas.indihu.entity.enums.UserState.ACCEPTED;
import static cz.inqool.uas.indihu.service.oauth.OAuthLoginException.ErrorCode.AWAITING_ADMIN_APPROVAL;
import static cz.inqool.uas.indihu.service.oauth.OAuthLoginException.ErrorCode.MISSING_EMAIL;

@Api(value = "OAuthController", description = "Controller for OAuth2.0 configuration and login")
@RestController
@ConditionalOnExpression("${oauth.enabled:false}")
@RequestMapping("/api/oauth")
@Slf4j
public class OAuthController {

    private List<OAuthService> oAuthServices;

    private List<OAuthConfigDto> configs;

    private UserService userService;

    private JwtTokenProvider jwtTokenProvider;

    @ApiOperation("Gets OAuth configuration")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Returned config")
    })
    @RequestMapping(method = RequestMethod.GET, value = "/configs")
    public List<OAuthConfigDto> configs() {
        return configs;
    }

    /**
     * 1. Get access token from IdP API
     * 2. Using access token get user's details
     * 3. Register or retrieve user with details
     * 4. Issue JWT AuthN token
     *
     * @param providerName name of provider to be called
     * @param code received from provider
     * @return JWT token of User
     */
    @ApiOperation("Login through OAuth API")
    @ApiResponses({
            @ApiResponse(code = 200, message = "User logged in"),
            @ApiResponse(code = 201, message = "User created awaiting confirmation"),
            @ApiResponse(code = 400, message = "Could not fetch user email from IdP"),
            @ApiResponse(code = 412, message = "Account is pending confirmation from administrator")
    })
    @RequestMapping(method = RequestMethod.GET, value = "/{providerName}")
    public String login(@PathVariable String providerName, @RequestParam String code, HttpServletResponse response) {
        OAuthService oAuthService = oAuthServices.stream()
                .filter(service -> service.supports(providerName))
                .findFirst()
                .orElseThrow(() -> new OAuthLoginException(OAuthLoginException.ErrorCode.NO_PROVIDER, "No provider configured for name: " + providerName));

        String accessToken = oAuthService.getAccessToken(code);
        OAuthProfileDetails oAuthProfile = oAuthService.getUserProfile(accessToken);
        User user = userService.createOrRetrieveOAuthUser(oAuthProfile);

        if (ACCEPTED.equals(user.getState())) {
            response.setStatus(200);
            return "Bearer: " + jwtTokenProvider.generateToken(new UserDelegate(user));
        } else {
            response.setStatus(201);
            return null;
        }
    }

    @ExceptionHandler(OAuthLoginException.class)
    public ResponseEntity<String> handleOAuthException(OAuthLoginException oAuthLoginException) {
        OAuthLoginException.ErrorCode errorCode = oAuthLoginException.getErrorCode();

        if (MISSING_EMAIL.equals(errorCode)) {
            return new ResponseEntity<>(oAuthLoginException.getMessage(), HttpStatus.BAD_REQUEST);
        } else if (AWAITING_ADMIN_APPROVAL.equals(errorCode)) {
            return new ResponseEntity<>(oAuthLoginException.getMessage(), HttpStatus.PRECONDITION_FAILED);
        }

        log.error(oAuthLoginException.getMessage());
        return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Autowired
    public void setConfigs(List<OAuthConfigDto> configs) {
        this.configs = configs;
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setoAuthServices(List<OAuthService> oAuthServices) {
        this.oAuthServices = oAuthServices;
    }

    @Autowired
    public void setJwtTokenProvider(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }
}
