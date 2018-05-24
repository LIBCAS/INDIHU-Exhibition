package cz.inqool.uas.indihu.service;

import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.enums.UserState;
import org.junit.Test;

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
        assertThat(edited.getState(),is(UserState.DELETED));
    }
}
