package cz.inqool.uas.indihu.service.notification;

import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.domain.Registration;
import cz.inqool.uas.indihu.entity.domain.User;

public interface IndihuNotificationService {

    void notifyAddedToCollaborate(String email, User byUser, Exposition exposition);

    void notifyRemovedFromCollaboration(String toNotify, User byUser, Exposition exposition);

    void notifyAccepted(String toNotify);

    void notifyNewRegistration(Registration registration);

    void notifyPasswordReset(User user, String password);

    void notifyReactivated(String userEmail);

    void notifyDeletedByAdmin(String userEmail);

    void notifyDeleted(String userEmail);

    void notifyMovedExposition(String oldOwner, String newOwner, Exposition exposition);

    void notifyDeletedExposition(String recipient, Exposition exposition);

    void verifyEmail(Registration registration);

    void notifyLdapReset(String email);

    void notifyAuthor(String text, Exposition exposition);

    void notifyRejected(String email);
}
