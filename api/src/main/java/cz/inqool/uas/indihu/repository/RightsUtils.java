package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.indihu.entity.domain.Collaborator;
import cz.inqool.uas.indihu.entity.domain.Exposition;
import cz.inqool.uas.indihu.entity.enums.CollaborationType;

import java.util.stream.Collectors;

public class RightsUtils {

    public static String getRights(Exposition exposition, CollaborationType collaborationType) {
        String rights = exposition.getAuthor().getEmail();

        if (exposition.getCollaborators() != null) {
            String additional = exposition.getCollaborators().stream()
                    .filter(collaborator -> collaborator.getCollaborationType().equals(collaborationType))
                    .map(Collaborator::getUserEmail)
                    .collect(Collectors.joining(", "));

            rights += ", " + additional;
        }

        return rights;
    }

    public static boolean canRead(Exposition exposition, String email) {
        return hasRight(exposition, email, CollaborationType.READ_ONLY) || hasRight(exposition, email, CollaborationType.EDIT);
    }

    public static boolean hasRight(Exposition exposition, String email, CollaborationType collaborationType) {
        return getRights(exposition, collaborationType).contains(email);
    }
}
