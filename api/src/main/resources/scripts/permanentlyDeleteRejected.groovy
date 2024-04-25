import cz.inqool.uas.history.HistoryEventService
import cz.inqool.uas.index.global.GlobalReindexer
import cz.inqool.uas.indihu.entity.domain.User
import cz.inqool.uas.indihu.repository.UserRepository

import javax.persistence.EntityManager
import javax.servlet.Registration
import java.time.temporal.ChronoUnit

UserRepository userRepository = spring.getBean(UserRepository.class)
HistoryEventService historyEventService = spring.getBean(HistoryEventService.class)
EntityManager entityManager = spring.getBean(EntityManager.class)
GlobalReindexer globalReindexer = spring.getBean(GlobalReindexer.class)

List<User> users = userRepository.findDeletedBefore(31L, ChronoUnit.DAYS, 10L)

for (User user: users) {
    if (user.getRegistration() != null) {
        entityManager.remove(user.getRegistration())
        historyEventService.createHistoryEvent("GROOVY SCRIPT", Registration.class.getSimpleName(), user.getRegistration(), null)
    }
    entityManager.remove(user)
    historyEventService.createHistoryEvent("GROOVY SCRIPT", User.class.getSimpleName(), user, null)
}

entityManager.flush()

globalReindexer.reindexSubset(false, Arrays.asList(UserRepository.class));