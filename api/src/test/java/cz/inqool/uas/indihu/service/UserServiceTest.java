package cz.inqool.uas.indihu.service;

import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.indihu.entity.domain.Registration;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.enums.UserState;
import org.junit.Test;

import java.time.Instant;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNot.not;
import static org.junit.Assert.*;

public class UserServiceTest extends SetUpTests {

    @Test
    public void passwordResetTest(){
        String old = editor.getPassword();
        userService.resetPassword(editor.getEmail());
        User updated = userRepository.findByEmail(editor.getEmail());
        assertThat(updated.getPassword(), not(old));
    }

    @Test
    public void reactivate(){
        userRepository.delete(editor);
        userService.reactivateUser(editor.getId());
        User updated = userRepository.find(editor.getId());
        assertNull(updated.getDeleted());
    }

    @Test
    public void updateTestElevation(){
        String old = userRepository.find(testUser1.getId()).getPassword();
        testUser1.setRole(UserRole.ROLE_ADMIN);
        testUser1.setPassword("new password");
        userService.update(testUser1);
        User edited = userRepository.find(testUser1.getId());
        assertNotEquals(old,edited.getPassword());
        assertThat(edited.getRole(), is(UserRole.ROLE_EDITOR));
    }

    @Test
    public void updateTest(){
        admin1.setRole(UserRole.ROLE_EDITOR);
        userService.update(admin1);
        User edited = userRepository.find(admin1.getId());
        assertThat(edited.getRole(),is(UserRole.ROLE_ADMIN));
    }

    @Test
    public void updateTestStays(){
        admin1.setRole(UserRole.ROLE_ADMIN);
        String old = admin1.getInstitution();
        admin1.setInstitution("new institution");
        userService.update(admin1);
        User edited = userRepository.find(admin1.getId());
        assertThat(edited.getRole(),is(UserRole.ROLE_ADMIN));
        assertNotEquals(old,edited.getInstitution());
    }

    @Test
    public void deleteUser(){
        userService.deleteUser(testUser1.getId());
        User edited = userRepository.find(testUser1.getId());
        assertNotNull(edited.getDeleted());
    }

    @Test
    public void restoreUser() {
        String userId = testUser1.getId();

        userService.deleteUser(userId);
        User deleted = userRepository.findUser(userId);
        assertNotNull(deleted.getDeleted());
        UserState userState = deleted.getState();

        userService.restore(userId);

        User restored = userRepository.findNotDeleted(userId);

        assertEquals(userState, restored.getState());
    }


    public User userWithRegistration() {
        Registration registration = new Registration();
        registration.setIssued(Instant.now());
        registration.setSecret("not needed");

        User user = new User();
        user.setUserName("registered");
        user.setEmail("registered@test.cz");
        user.setSurname("test");
        user.setFirstName("test");
        user.setRole(UserRole.ROLE_EDITOR);
        user.setState(UserState.NOT_VERIFIED);

        registration.setToAccept(user);
        user.setRegistration(registration);

        User saved = userRepository.save(user);
        registrationRepository.save(registration);

        return saved;
    }

    @Test
    public void acceptUserSuccessfully() {
        User testingUser = userWithRegistration();

        testingUser.setState(UserState.TO_ACCEPT);
        userRepository.save(testingUser);

        userService.accept(testingUser.getId());

        User user = userRepository.find(testingUser.getId());
        assertEquals(UserState.ACCEPTED, user.getState());
        assertTrue(user.isAccepted());
    }

    @Test(expected = IllegalStateException.class)
    public void acceptUserIllegalState() {
        User testingUser = userWithRegistration();

        testingUser.setState(UserState.NOT_VERIFIED);
        userRepository.save(testingUser);

        userService.accept(testingUser.getId());
    }

    @Test
    public void rejectUserSuccessfully() {
        User testingUser = userWithRegistration();

        testingUser.setState(UserState.TO_ACCEPT);
        userRepository.save(testingUser);

        userService.reject(testingUser.getId());

        User user = userRepository.find(testingUser.getId());
        assertEquals(UserState.REJECTED, user.getState());
        assertFalse(user.isAccepted());
    }

    @Test(expected = IllegalStateException.class)
    public void rejectUserIllegalState() {
        User testingUser = userWithRegistration();

        testingUser.setState(UserState.ACCEPTED);
        userRepository.save(testingUser);

        userService.reject(testingUser.getId());
    }

    @Test
    public void removeUser() {
        // assert the property of how many exposition the editor owns
        int beforeSize = expositionRepository.findAll().size();

        assertTrue(beforeSize > 2);

        helperService.setCurrent(editor);
        userService.removeCurrentUser();

        int afterSize = expositionRepository.findAll().size();
        assertEquals(2, beforeSize - afterSize);
    }
}
