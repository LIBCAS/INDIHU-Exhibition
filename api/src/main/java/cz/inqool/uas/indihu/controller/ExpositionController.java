package cz.inqool.uas.indihu.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import cz.inqool.uas.index.dto.Params;
import cz.inqool.uas.index.dto.Result;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.dto.*;
import cz.inqool.uas.indihu.service.dto.TransferDto;
import cz.inqool.uas.indihu.service.exposition.ExpositionPinService;
import cz.inqool.uas.indihu.service.exposition.ExpositionService;
import cz.inqool.uas.indihu.service.exposition.ExpositionTransferService;
import cz.inqool.uas.store.Transactional;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.ByteArrayInputStream;
import java.util.Collection;
import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * Created by Michal on 21. 7. 2017.
 */
@Api(value = "expositionController", description = "Controller for creating, updating and getting expositions")
@RestController
@RequestMapping("/api/exposition")
public class ExpositionController {

    private ExpositionService expositionService;

    private ExpositionTransferService expositionTransferService;

    private ExpositionPinService pinService;

    @ApiOperation(value = "Gets all expositions where current user is author.")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = GET, path = "/me")
    public List<ExpositionDto> getAllForCurrentUser() {
        return expositionService.getAllWhereCurrentIsAuthor();
    }

    @ApiOperation(value = "Moves all exposition to predefined default owner.")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = POST, path = "/transfer")
    public void transfer(@RequestBody TransferDto transferDto) {
        expositionTransferService.transferAll(transferDto);
    }

    @ApiOperation(value = "Gets all expositions where current logged in user is collaborator or author.Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = GET, path = "/")
    public Result<ExpositionDto> getAll(@ModelAttribute Params params, @RequestParam(defaultValue = "false") boolean showPinned)  {
        return expositionService.getUserInProgress(params, showPinned);
    }

    @ApiOperation(value = "Gets all instances that respect the selected parameters",
            notes = "Returns sorted list of instances with total number. Same as the GET / method, " +
                    "but parameters are supplied in POST body.", response = Result.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successful response", response = Result.class)})
    @RequestMapping(value = "/parametrized", method = RequestMethod.POST)
    @Transactional
    public Result<ExpositionDto> listPost(@ApiParam(value = "Parameters to comply with", required = true)
                                          @RequestBody Params params,
                                          @RequestParam(defaultValue = "false") boolean showPinned) {
        return expositionService.getUserInProgress(params, showPinned);
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
            @ApiResponse(code = 200, message = "Ended exposition", response = ExpositionClosedDto.class)})
    @RequestMapping(method = GET, path = "/u/{url}")
    public ExpositionClosedDto getByUrl(@PathVariable("url") String url) {
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
            @RequestBody Exposition exposition,
            HttpServletResponse response) {
        Exposition result = expositionService.update(exposition);
        if (result == null) {
            response.setStatus(403);
            return null;
        } else {
            return result;
        }
    }

    @ApiOperation(value = "Locks an exposition. Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = POST, path = "/lock/{id}")
    public boolean lock(@PathVariable("id") String id) {
        return expositionService.lock(id);
    }

    @ApiOperation(value = "Gets a specified exposition with files.Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = GET, path = "/{id}")
    public Exposition findById(@PathVariable("id") String expositionId, HttpServletResponse response) {
        Exposition result = expositionService.find(expositionId);
        if (result == null) {
            response.setStatus(403);
            return null;
        } else {
            return result;
        }
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

    @ApiOperation(value = "Rate an exposition")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Exposition rated successfully"),
            @ApiResponse(code = 400, message = "Invalid rating body")
    })
    @RequestMapping(method = POST, path = "/{id}/rate")
    public void rate(@PathVariable String id, @Valid @RequestBody RatingDto ratingDto) {
        expositionService.rate(id, ratingDto);
    }

    @ApiOperation(value = "Add view to exposition")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Added view to view counter"),
            @ApiResponse(code = 404, message = "Exposition not found")
    })
    @RequestMapping(method = POST, path = "/{id}/add-view")
    public void addView(@PathVariable String id) {
        expositionService.addView(id);
    }

    @ApiOperation(value = "Add design data")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Exposition design changed"),
            @ApiResponse(code = 400, message = "Bad request")
    })
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = POST, path = "/{id}/design")
    public ExpositionDesignDataDto addDesignData(@PathVariable String id, @Valid @RequestBody ExpositionDesignDataDto expositionDesignDataDto) {
        return expositionService.updateDesign(id, expositionDesignDataDto);
    }

    @ApiOperation(value = "Export expo design")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Design data exported")
    })
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = GET, path = "/{id}/design", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InputStreamResource> exportDesignData(@PathVariable String id) throws JsonProcessingException {
        String export = expositionService.createExport(id);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + "export_" + id + ".json" + "\"")
                .header("Content-Length", String.valueOf(export.getBytes().length))
                .contentType(MediaType.APPLICATION_JSON)
                .body(new InputStreamResource(new ByteArrayInputStream(export.getBytes())));
    }

    @ApiOperation(value = "Pin exposition")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Exposition pinned")
    })
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = POST, path = "/{id}/pin")
    public void pin(@PathVariable String id) {
        pinService.pin(id);
    }

    @ApiOperation(value = "Pin exposition")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Exposition pinned")
    })
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = POST, path = "/{id}/unpin")
    public void unpin(@PathVariable String id) {
        pinService.unpin(id);
    }


    @Inject
    public void setExpositionService(ExpositionService expositionService) {
        this.expositionService = expositionService;
    }

    @Autowired
    public void setPinService(ExpositionPinService pinService) {
        this.pinService = pinService;
    }

    @Autowired
    public void setExpositionTransferService(ExpositionTransferService expositionTransferService) {
        this.expositionTransferService = expositionTransferService;
    }
}
