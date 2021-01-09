package cz.inqool.uas.indihu.service;

import cz.inqool.uas.indihu.repository.UserRepository;
import cz.inqool.uas.indihu.security.UserDelegate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 * Created by Michal on 20. 7. 2017.
 */
@Service
@Slf4j
public class IndihuService {

    private UserRepository userRepository;

    public UserDelegate findUser(String id) {
        UserDelegate delegate = new UserDelegate(userRepository.find(id));
        return delegate;
    }

    @Inject
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
