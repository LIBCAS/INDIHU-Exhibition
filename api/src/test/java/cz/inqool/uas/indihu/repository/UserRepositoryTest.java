package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.helper.SetUpTests;
import cz.inqool.uas.indihu.entity.domain.User;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;

public class UserRepositoryTest extends SetUpTests{


    @Test
    public void getByUser(){
        User found = userRepository.findByLogin("joker");
        assertNotNull(found);
        assertEquals(found.getEmail(), editor.getEmail());
    }

    @Test
    public void getByNonExistentUser(){
        User found = userRepository.findByLogin("santa");
        assertNull(found);
    }

    @Test(expected = IllegalArgumentException.class)
    public void getByNullUser(){
        User found = userRepository.findByLogin(null);
        assertNull(found);
    }

    @Test
    public void getAdminMails() {
        List<String> mails = userRepository.getAdminMails();
        assertTrue(mails.containsAll(Arrays.asList("admin1@inqool.cz", "admin2@inqool.cz")));
    }

    @Test(expected = IllegalArgumentException.class)
    public void getByEmailNull(){
        User user = userRepository.findByEmail(null);
    }

    @Test
    public void findByEmail(){
        User found = userRepository.findByEmail("admin2@inqool.cz");
        assertNotNull(found);
    }

    @Test
    public void findByEmilNonExistent(){
        User user = userRepository.findByEmail("321as65df4@afasdf.ok");
        assertNull(user);
    }

}
