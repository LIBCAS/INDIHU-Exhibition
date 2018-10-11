package cz.inqool.uas.indihu.controller;

import cz.inqool.uas.index.dto.Params;
import cz.inqool.uas.index.dto.Result;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.dto.ExpositionByUrlDto;
import cz.inqool.uas.indihu.entity.dto.ExpositionDto;
import cz.inqool.uas.indihu.entity.dto.ExpositionEndedDto;
import cz.inqool.uas.indihu.entity.dto.LockedExpositionDto;
import cz.inqool.uas.indihu.service.ExpositionService;
import cz.inqool.uas.store.Transactional;
import io.swagger.annotations.*;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import java.util.Collection;

import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * Created by Michal on 21. 7. 2017.
 */
@Api(value = "expositionController", description = "Controller for creating, updating and getting expositions")
@RestController
@RequestMapping("/api/exposition")
public class ExpositionController {

    private ExpositionService expositionService;

    @ApiOperation(value = "gets all expositions where current logged in user is collaborator or author.Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = GET, path = "/")
    public Result<ExpositionDto> getAll(@ModelAttribute Params params) {
        return expositionService.getUserInProgress(params);
    }

    @ApiOperation(value = "Gets all instances that respect the selected parameters",
            notes = "Returns sorted list of instances with total number. Same as the GET / method, " +
                    "but parameters are supplied in POST body.", response = Result.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successful response", response = Result.class)})
    @RequestMapping(value = "/parametrized", method = RequestMethod.POST)
    @Transactional
    public Result<ExpositionDto> listPost(@ApiParam(value = "Parameters to comply with", required = true)
                                          @RequestBody Params params) {
        return expositionService.getUserInProgress(params);
    }

    @ApiOperation(value = "Gets all oppened expositions")
    @RequestMapping(method = GET, path = "/view")
    public Collection<ExpositionDto> getAllForView(@ModelAttribute Params params) {
        return expositionService.getAllCurrent(params);
    }

    @ApiOperation(value = "Get object that says if exposition is locked ")
    @ApiResponse(code = 200, message = "Successful response", response = LockedExpositionDto.class)
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = GET, path = "/locked/{id}")
    public LockedExpositionDto isLocked(@PathVariable("id") String expositionId) {
        return expositionService.isLocked(expositionId);
    }

    @ApiOperation(value = "Check whether url is safe to assign to exposition.Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = POST, path = "/{url}")
    public boolean isSafe(@ApiParam(value = "string to check")
                          @PathVariable("url") String url) {
        return expositionService.isSafe(url);
    }


    @ApiOperation(value = "Returns an Exposition on given url which is already opened")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Ongoing exposition", response = ExpositionByUrlDto.class),
            @ApiResponse(code = 200, message = "Ended exposition", response = ExpositionEndedDto.class)})
    @RequestMapping(method = GET, path = "/u/{url}")
    public ExpositionEndedDto getByUrl(@PathVariable("url") String url) {
        return expositionService.getByUrl(url);
    }

    @ApiOperation(value = "create exposition. Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = POST, path = "/")
    public Exposition create(
            @ApiParam(value = "exposition to create or update")
            @RequestBody String name) {
        return expositionService.create(name);
    }

    @ApiOperation(value = "update exposition. Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = PUT, path = "/")
    public Exposition update(
            @ApiParam(value = "exposition to create or update")
            @RequestBody Exposition exposition) {
        return expositionService.update(exposition);
    }

    @ApiOperation(value = "Locks an exposition. Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = POST, path = "/lock/{id}")
    public boolean lock(@PathVariable("id") String id){
        return expositionService.lock(id);
    }

    @ApiOperation(value = "Gets a specified exposition with files.Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = GET, path = "/{id}")
    public Exposition findById(@PathVariable("id") String expositionId) {
        return expositionService.find(expositionId);
    }

    @ApiOperation(value = "Removes exposition and all objects associated with it.")
    @RequestMapping(method = DELETE, path = "/{id}")
    public boolean deleteById(@PathVariable("id") String expositionId) {

        return expositionService.delete(expositionId);
    }

    @ApiOperation(value = "Assign another collaborator as an owner of a exposition")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = POST, path = "/reassign")
    public Exposition reAssignExposition(@ApiParam(value = "Exposition id of exposition to move")
                                         @RequestParam(value = "expositionId") String expositionId,
                                         @ApiParam(value = "id of collaborator to be set as new owner")
                                         @RequestParam(value = "collaboratorId") String collaboratorId) {
        return expositionService.move(expositionId, collaboratorId);
    }


    @Inject
    public void setExpositionService(ExpositionService expositionService) {
        this.expositionService = expositionService;
    }
}
