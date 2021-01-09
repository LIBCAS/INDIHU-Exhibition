package cz.inqool.uas.indihu.controller;

import cz.inqool.uas.indihu.entity.domain.Settings;
import cz.inqool.uas.indihu.service.SettingsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;

@RestController
@RequestMapping("/api/admin")
@RolesAllowed("ROLE_ADMIN")
@Api(value = "adminController", description = "Controller to manage admin settings.")
public class AdminController {

    private SettingsService settingsService;

    @ApiOperation("EndPoint to get runtime updatable settings")
    @RequestMapping(method = RequestMethod.GET, value = "/settings")
    public Settings getSettings() {
        return settingsService.getSettings();
    }

    @ApiOperation("EndPoint to determine whether registrations are available")
    @RequestMapping(method = RequestMethod.POST, value = "/settings")
    public Settings updateSettings(@ApiParam("updated settings object to store")
                                   @RequestBody Settings settings) {
        return settingsService.update(settings);
    }

    @Inject
    public void setSettingsService(SettingsService settingsService) {
        this.settingsService = settingsService;
    }
}
