package cz.inqool.uas.indihu.controller;

import cz.inqool.uas.index.dto.Filter;
import cz.inqool.uas.index.dto.FilterOperation;
import cz.inqool.uas.index.dto.Params;
import cz.inqool.uas.index.dto.Result;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.repository.UserRepository;
import cz.inqool.uas.indihu.service.HelperService;
import cz.inqool.uas.indihu.service.IndihuNotificationService;
import cz.inqool.uas.indihu.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.transaction.Transactional;

import static cz.inqool.uas.util.Utils.asList;

@RestController
@RequestMapping("/api/user")
@Api(value = "userController", description = "controller for manipulating of users")
public class UserController {

    private UserRepository userRepository;

    private UserService userService;

    private HelperService helperService;

    private IndihuNotificationService indihuNotificationService;

    @ApiOperation("Gets all users for admin list")
    @RolesAllowed("ROLE_ADMIN")
    @RequestMapping(method = RequestMethod.GET, value = "/")
    public Result<User> getAllUsers(@ModelAttribute Params params) {
        Result<User> result = userRepository.findAll(params);
        result.getItems().forEach(user -> {
            user.setPassword(null);
            if (user.getDeleted() != null) {
                user.setDeletedUser(true);
            }
        });
        return result;
    }

    @ApiOperation("Allows to search in users")
    @RolesAllowed("ROLE_ADMIN")
    @RequestMapping(method = RequestMethod.GET, value = "/q/{q}")
    public Result<User> searchAllUsers(@ModelAttribute Params params,
                                       @ApiParam("String to look for in attributes")
                                       @PathVariable("q") String value) {
        params.setFilter(asList(createFilters(value)));
        Result<User> result = userRepository.findAll(params);
        result.getItems().forEach(user -> {
            user.setPassword(null);
            if (user.getDeleted() != null) {
                user.setDeletedUser(true);
            }
        });
        return result;
    }

    @ApiOperation("Allows to search in users who are active")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.GET, value = "/c/{q}")
    public Result<User> searchUsersForCollaboration(@ModelAttribute Params params,
                                                    @ApiParam("String to look for in attributes")
                                                    @PathVariable("q") String value) {
        Filter active = new Filter();
        active.setOperation(FilterOperation.EQ);
        active.setValue(String.valueOf(true));
        active.setField("active");
        Filter and = new Filter();
        and.setOperation(FilterOperation.AND);
        and.setFilter(asList(active, createFilters(value)));
        params.setFilter(asList(and));

        Result<User> result = userRepository.findAll(params);
        result.getItems().forEach(user -> {
            user.setPassword(null);
            if (user.getDeleted() != null) {
                user.setDeletedUser(true);
            }
        });
        return result;
    }

    @ApiOperation("returns current logged in user. Role required: editor.")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.GET, value = "/me")
    public User getCurrent() {
        User user = userRepository.find(helperService.getCurrent().getId());
        user.setPassword(null);
        user.setRole(null);
        return user;
    }

    @ApiOperation("Deletes user with specified id. Role required: admin.")
    @RolesAllowed("ROLE_ADMIN")
    @RequestMapping(method = RequestMethod.DELETE, value = "/{id}")
    @Transactional
    public void deleteUser(@ApiParam("id of user to remove") @PathVariable("id") String id) {
        userService.deleteUser(id);
    }

    @ApiParam("Allows user to delete himself. Role required: editor.")
    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.DELETE, value = "/me")
    @Transactional
    public void deleteCurrent() {
        User user = helperService.getCurrent();
        indihuNotificationService.notifyDeleted(user.getEmail());
        userRepository.delete(user);
        helperService.setCurrent(null);
    }

    @ApiOperation("Allows to reactivate account of specified user. Role required: admin.")
    @RolesAllowed("ROLE_ADMIN")
    @RequestMapping(method = RequestMethod.POST, value = "/reactivate/{id}")
    public void reactivateUser(@PathVariable("id") String userId) {
        userService.reactivateUser(userId);
    }

    @RolesAllowed("ROLE_EDITOR")
    @RequestMapping(method = RequestMethod.PUT, value = "/")
    public void updateUser(@RequestBody User toUpdate) {
        userService.update(toUpdate);
    }

    @ApiOperation("resets a password for user if user in not in external LDAP")
    @RequestMapping(method = RequestMethod.POST, value = "/reset/")
    public boolean resetPassword(@RequestBody String email) {
        return userService.resetPassword(email);
    }

    @Inject
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Inject
    public void setHelperService(HelperService helperService) {
        this.helperService = helperService;
    }

    @Inject
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Inject
    public void setNotificationService(IndihuNotificationService indihuNotificationService) {
        this.indihuNotificationService = indihuNotificationService;
    }

    private Filter createFilters(String value) {
        Filter filter = new Filter();
        filter.setOperation(FilterOperation.OR);
        Filter userName = new Filter("userName", FilterOperation.CONTAINS, value, null);
        Filter firstName = new Filter("firstName", FilterOperation.CONTAINS, value, null);
        Filter surname = new Filter("surname", FilterOperation.CONTAINS, value, null);
        Filter email = new Filter("email", FilterOperation.CONTAINS, value, null);
        Filter institution = new Filter("institution", FilterOperation.CONTAINS, value, null);
        Filter state = new Filter("state",FilterOperation.EQ,value,null);
        filter.setFilter(asList(userName, firstName, surname, email, institution, state));
        return filter;
    }
}
