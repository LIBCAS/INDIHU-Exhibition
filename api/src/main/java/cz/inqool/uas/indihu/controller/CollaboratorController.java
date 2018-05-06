package cz.inqool.uas.indihu.controller;

import cz.inqool.uas.indihu.entity.enums.CollaborationType;
import cz.inqool.uas.indihu.service.CollaboratorService;
import io.swagger.annotations.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.validation.constraints.NotNull;
import javax.ws.rs.PathParam;
import java.util.List;

/**
 * Created by Michal on 24. 7. 2017.
 */
@Api(value = "collaboratorsController", description = "Controller for adding and removing collaborators into exposition")
@RestController
@RequestMapping("/api/colaborators")
public class CollaboratorController {

    private CollaboratorService service;

    @ApiOperation(value = "Adds collaborators into exposition.Required role of editor")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Collaborator created."),
            @ApiResponse(code = 201, message = "Collaborator invited into system."),
            @ApiResponse(code = 406, message = "Invitation flag not allowed."),
            @ApiResponse(code = 409, message = "Current user can't add collaborators or email is already used.")
    })
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.POST, path = "/")
    public ResponseEntity addCollaboratorsByEmail(@ApiParam(value = "Email of new collaborators.", required = true)
                                                  @RequestParam(value = "collaborators") String userEmail,
                                                  @ApiParam(value = "Id of the exposition to add collaborator to.", required = true)
                                                  @RequestParam(value = "expositionId") String expositionId,
                                                  @ApiParam(value = "Possible collaboration type", required = true, allowableValues = "EDIT, READ_ONLY")
                                                  @RequestParam(value = "type") CollaborationType type,
                                                  @RequestParam(value = "invite", defaultValue = "false") boolean invite) {
        switch (service.addCollaborator(userEmail, expositionId, type, invite)) {
            case CREATED:
                return new ResponseEntity(HttpStatus.OK);
            case EMAIL_SENT:
                return new ResponseEntity(HttpStatus.CREATED);
            case EMAIL_NOT_ALLOWED:
                return new ResponseEntity(HttpStatus.NOT_ACCEPTABLE);
            case FORBIDDEN:
            default:
                return new ResponseEntity(HttpStatus.CONFLICT);
        }

    }

    @ApiOperation(value = "Removes users from collaborators.Required role of editor and to be an author of collaboration")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.DELETE, path = "/")
    public void removeCollaborators(@ApiParam(value = "Array of ids of collaborators to remove.", required = true)
                                    @RequestParam(value = "collaborators") List<String> collaboratorsId,
                                    @ApiParam(value = "Exposition id to remove collaborators from.", required = true)
                                    @RequestParam(value = "expositionId") String expositionId) {
        service.removeCollaborators(expositionId, collaboratorsId);
    }

    @ApiOperation(value = "Removes current from collaborators.Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.DELETE, path = "/me")
    public void removeMe(
            @ApiParam(value = "Exposition id to remove collaborators from.", required = true)
            @RequestParam(value = "expositionId") String expositionId) {
        service.removeCurrentCollaborator(expositionId);
    }

    @ApiOperation(value = "Removes current from collaborators.Required role of editor")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.PUT, path = "/{collaboratorId}")
    public boolean update(
            @NotNull
            @ApiParam(value = "Collaboration id of collaborator.", required = true)
            @PathVariable(value = "collaboratorId") String collaboratorId,
            @NotNull
            @ApiParam(value = "New type to set for a Collaborator", required = true)
            @PathParam("type") CollaborationType type) {
        return service.update(collaboratorId, type);
    }

    @Inject
    public void setService(CollaboratorService service) {
        this.service = service;
    }
}
