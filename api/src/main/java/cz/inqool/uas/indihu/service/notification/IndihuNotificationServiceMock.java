package cz.inqool.uas.indihu.service.notification;

import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.Registration;
import cz.inqool.uas.indihu.entity.domain.User;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Mock implementation of {@link IndihuNotificationService}
 */
@Component
@ConditionalOnProperty(prefix = "notifications", name = "enabled", havingValue = "false", matchIfMissing = true)
public class IndihuNotificationServiceMock implements IndihuNotificationService {

    @Override
    public void notifyAddedToCollaborate(String email, User byUser, Exposition exposition) {

    }

    @Override
    public void notifyRemovedFromCollaboration(String toNotify, User byUser, Exposition exposition) {

    }

    @Override
    public void notifyAccepted(String toNotify) {

    }

    @Override
    public void notifyNewRegistration(Registration registration) {

    }

    @Override
    public void notifyPasswordReset(User user, String password) {

    }

    @Override
    public void notifyReactivated(String userEmail) {

    }

    @Override
    public void notifyDeletedByAdmin(String userEmail) {

    }

    @Override
    public void notifyDeleted(String userEmail) {

    }

    @Override
    public void notifyMovedExposition(String oldOwner, String newOwner, Exposition exposition) {

    }

    @Override
    public void notifyDeletedExposition(String recipient, Exposition exposition) {

    }

    @Override
    public void verifyEmail(Registration registration) {

    }

    @Override
    public void notifyLdapReset(String email) {

    }

    @Override
    public void notifyAuthor(String text, Exposition exposition) {

    }

    @Override
    public void notifyRejected(String email) {

    }
}
