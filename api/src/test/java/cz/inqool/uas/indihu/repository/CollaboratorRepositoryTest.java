package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.indihu.entity.domain.Collaborator;
import cz.inqool.uas.indihu.entity.enums.CollaborationType;
import org.junit.Test;

import java.util.List;

import static java.util.Arrays.asList;
import static java.util.Arrays.stream;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class CollaboratorRepositoryTest extends SetUpTests{

    @Test
    public void getCollaborator(){
        Collaborator found = collaboratorRepository.findExpositionCollaborator(admin1.getId(),exposition.getId());
        assertNotNull(found);
        assertThat(found.getCollaborationType(),is(CollaborationType.EDIT));
    }

    @Test
    public void getCollaborators(){
        List<Collaborator> collaborators = collaboratorRepository.findAllForExposition(exposition.getId());
        assertNotNull(collaborators);
        assertThat(collaborators.size(),is(2));
    }

    @Test(expected = IllegalArgumentException.class)
    public void getCollaboratorNull(){
        List<Collaborator> collaborators = collaboratorRepository.findAllForExposition(null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void removeCollaboratorsNull(){
        collaboratorRepository.removeAllCollaborators(null);
    }

    @Test
    public void removeAllCollaborators(){
        collaboratorRepository.removeAllCollaborators(exposition.getId());
        List<Collaborator> collaborators = collaboratorRepository.findAllForExposition(exposition.getId());
        assertNotNull(collaborators);
        assertThat(collaborators.size(),is(0));
    }

    @Test
    public void removeCollaborator(){
        collaboratorRepository.removeCollaborators(asList(admin1.getId()),exposition.getId());
        List<Collaborator> collaborators = collaboratorRepository.findAllForExposition(exposition.getId());
        assertNotNull(collaborators);
        assertThat(collaborators.size(),is(1));
    }

    @Test(expected = NullPointerException.class)
    public void removeCollaboratorsByListNull(){
        collaboratorRepository.removeCollaborators(null,exposition.getId());
    }

    @Test(expected = IllegalArgumentException.class)
    public void removeCollaboratorsByListNull1(){
        collaboratorRepository.removeCollaborators(asList(admin1.getId()),null);
    }

    /**
     * one is not a collaborator (admin2)
     */
    @Test
    public void removeCollaborators(){
        collaboratorRepository.removeCollaborators(asList(admin1.getId(),admin2.getId()),exposition.getId());
        List<Collaborator> collaborators = collaboratorRepository.findAllForExposition(exposition.getId());
        assertNotNull(collaborators);
        assertThat(collaborators.size(),is(1));
    }

    @Test
    public void removeCollaborators1(){
        collaboratorRepository.removeCollaborators(asList(admin1.getId(),testUser1.getId()),exposition.getId());
        List<Collaborator> collaborators = collaboratorRepository.findAllForExposition(exposition.getId());
        assertNotNull(collaborators);
        assertThat(collaborators.size(),is(0));
    }

    @Test
    public void removeCollaboratorsNotInExposition(){
        collaboratorRepository.removeCollaborators(asList(admin2.getId(),testUser2.getId()),exposition.getId());
        List<Collaborator> collaborators = collaboratorRepository.findAllForExposition(exposition.getId());
        assertNotNull(collaborators);
        assertThat(collaborators.size(),is(2));
    }
}
