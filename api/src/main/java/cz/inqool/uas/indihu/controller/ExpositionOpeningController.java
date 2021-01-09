package cz.inqool.uas.indihu.controller;

import cz.inqool.uas.indihu.entity.domain.ExpositionOpening;
import cz.inqool.uas.indihu.service.ExpositionOpeningService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import java.time.Instant;

import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by Michal on 24. 7. 2017.
 */
@Api(value = "expositionOpeningController", description = "Controller for managing an expositions opening")
@RestController
@RequestMapping("/api/opening")
public class ExpositionOpeningController {

    private ExpositionOpeningService service;

    @ApiOperation(value = "Adds an exposition opening.Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.POST, value = "/")
    public ExpositionOpening create(@ApiParam(value = "Exposition opening to save")
                                    @RequestParam("exposition") String expositionId,
                                    @ApiParam(value = "Instant since whe is exposition opened")
                                    @RequestParam("time") Instant time) {

        return service.create(expositionId, time);
    }

    @ApiOperation(value = "Updates an exposition opening.Required role of editor ")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.PUT, value = "/")
    public ExpositionOpening update(@ApiParam(value = "Exposition opening to save")
                                    @RequestParam("opening") ExpositionOpening opening) {
        return service.update(opening);
    }

    @ApiOperation(value = "Gets an exposition opening.Required role of editor ")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = GET, value = "/{id}")
    public ExpositionOpening getOpening(@ApiParam(value = "exposition id") @PathVariable("id") String expositionId) {
        return service.findByExposition(expositionId);
    }

    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = DELETE, value = "/{id}")
    public void delete(@PathVariable("id") String oppeningId) {
        service.delete(oppeningId);
    }

    @Inject
    public void setService(ExpositionOpeningService service) {
        this.service = service;
    }
}
