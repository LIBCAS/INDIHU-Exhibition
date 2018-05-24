package cz.inqool.uas.indihu.service;

import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.indihu.entity.domain.Collaborator;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.CollaborationType;
import cz.inqool.uas.indihu.entity.enums.CollaboratorCreateState;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.enums.UserState;
import cz.inqool.uas.indihu.security.UserDelegate;
import cz.inqool.uas.security.UserDetails;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;
import java.util.List;

import static java.util.Arrays.asList;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class CollaboratorServiceTest extends SetUpTests {

    //todo add test na to ze neexistuje collaborator a je dovoleny

    @Test
    public void addCollaboratorTest() {
        int before = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        collaboratorService.addCollaborator(admin2.getEmail(), exposition.getId(), CollaborationType.READ_ONLY, false);
        int after = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        assertThat(after, is(before + 1));
    }

    @Test
    public void readOnlyAddTest() {
        int before = collaboratorRepository.findAllForExposition(exposition2.getId()).size();
        collaboratorService.addCollaborator(testUser2.getEmail(), exposition2.getId(), CollaborationType.READ_ONLY, false);
        int after = collaboratorRepository.findAllForExposition(exposition2.getId()).size();
        assertThat(after, is(before));
    }

    @Test
    public void cantAddCollaborators() {
        int before = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        Authentication authentication = Mockito.mock(Authentication.class);
        UserDetails details = new UserDelegate(testUser1);
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        Mockito.when(securityContext.getAuthentication().getPrincipal()).thenReturn(details);
        collaboratorService.addCollaborator(testUser2.getEmail(), exposition.getId(), CollaborationType.EDIT, false);
        int after = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        assertThat(after, is(before));
    }

    @Test
    public void addCollaborators() {
        User toAdd = new User();
        toAdd.setRole(UserRole.ROLE_EDITOR);
        toAdd.setEmail("some@email.cz");
        toAdd.setState(UserState.NOT_VERIFIED);
        userRepository.save(toAdd);
        int before = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        collaboratorService.addCollaborator(toAdd.getEmail(), exposition.getId(), CollaborationType.EDIT, false);
        int after = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        assertThat(after, is(before + 1));
    }

    @Test
    public void addCollaboratorsByEmail() {
        CollaboratorCreateState collaboratorCreateState = collaboratorService.addCollaboratorWithoutMailNotification("ja@som.email", exposition.getId(), CollaborationType.EDIT, true);
        assertThat(collaboratorCreateState,is(CollaboratorCreateState.EMAIL_SENT));
        collaboratorCreateState = collaboratorService.addCollaboratorWithoutMailNotification("ja@som.email", exposition.getId(), CollaborationType.EDIT, true);
        assertThat(collaboratorCreateState,is(CollaboratorCreateState.FORBIDDEN));
    }

    @Test
    //fixme
    public void addCollaborators1() {
//        User toAdd = new User();
//        toAdd.setRole(UserRole.ROLE_EDITOR);
//        toAdd.setEmail("some@email.cz");
//        userRepository.save(toAdd);
//        User another  = new User();
//        another.setRole(UserRole.ROLE_EDITOR);
//        another.setEmail("email@email.com");
//        userRepository.save(another);
//        int before = collaboratorRepository.findAllForExposition(exposition.getId()).size();
//        collaboratorService.addCollaborators(asList(toAdd.getEmail(),another.getEmail()),exposition.getId(),CollaborationType.EDIT,false);
//        int after = collaboratorRepository.findAllForExposition(exposition.getId()).size();
//        assertThat(after, is(before + 2));
    }

    @Test
    public void removeCollaborators() {
        int before = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        UserDetails details = new UserDelegate(testUser1);
        Authentication authentication = Mockito.mock(Authentication.class);
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        Mockito.when(securityContext.getAuthentication().getPrincipal()).thenReturn(details);
        collaboratorService.removeCollaborators(exposition.getId(), asList(admin1.getId()));
        int after = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        assertThat(after, is(before));
    }

    @Test
    public void removeWithoutUserAccCollaborator() {
        int before = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        Collaborator col = new Collaborator();
        col.setSince(Instant.now());
        col.setCollaborationType(CollaborationType.READ_ONLY);
        col.setUserEmail("som@mail.cz");
        col.setExposition(exposition);
        collaboratorRepository.save(col);
        int after = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        assertThat(after - 1 == before, is(true));
        collaboratorService.removeCollaborators(exposition.getId(),asList(col.getId()));
        after = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        assertThat(after == before, is(true));
    }

    @Test
    public void removeAllCollaboratorsTest() {
        collaboratorService.removeAllCollaborators(exposition.getId());
        int after = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        assertThat(after, is(0));
    }

    @Test
    public void removeCollaborators1() {
        int before = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        collaboratorService.removeCollaborators(exposition.getId(), asList(collaborator.getId()));
        int after = collaboratorRepository.findAllForExposition(exposition.getId()).size();
        assertThat(after, is(before - 1));
    }

    @Test
    public void removeCurrentTest() {
        int before = collaboratorRepository.findAllForExposition(exposition2.getId()).size();
        collaboratorService.removeCurrentCollaborator(exposition2.getId());
        int after = collaboratorRepository.findAllForExposition(exposition2.getId()).size();
        assertThat(after, is(before - 1));
    }

    @Test
    public void canEdit() {
        boolean can = collaboratorService.canEdit(exposition.getId());
        assertThat(can, is(true));
    }

    @Test
    public void updateCollaborator() {
        boolean updated = collaboratorService.update(collaborator.getId(), CollaborationType.READ_ONLY);
        assertThat(updated, is(true));
        Collaborator updatedCollaborator = collaboratorRepository.find(collaborator.getId());
        assertThat(updatedCollaborator.getCollaborationType(), is(CollaborationType.READ_ONLY));
    }

    @Test
    public void updateCollaboratorCant() {
        boolean updated = collaboratorService.update(collaborator1.getId(), CollaborationType.EDIT);
        assertThat(updated, is(false));
        Collaborator updatedCollaborator = collaboratorRepository.find(collaborator1.getId());
        assertThat(updatedCollaborator.getCollaborationType(), is(CollaborationType.READ_ONLY));
    }

    @Test
    public void listCollaboratorsEmails(){
        List<String> emails = collaboratorService.getCollaboratorsEmailsForExposition(exposition.getId());
        assertThat(emails.size(),is(2));
    }
}
