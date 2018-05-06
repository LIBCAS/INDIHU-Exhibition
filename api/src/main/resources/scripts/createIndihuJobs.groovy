import cz.inqool.uas.scheduling.job.Job
import cz.inqool.uas.scheduling.job.JobService
import cz.inqool.uas.script.ScriptType

JobService jobService = spring.getBean(JobService.class)

Job deleteJob = new Job();
deleteJob.setName("flagRejectedUsersForDelete")
deleteJob.setActive(true)
deleteJob.setScriptType(ScriptType.GROOVY)
deleteJob.setScript("import cz.inqool.uas.indihu.repository.UserRepository\n" +
        "\n" +
        "UserRepository userRepository = spring.getBean(UserRepository.class);\n" +
        "userRepository.findRejected().forEach {user -> userRepository.delete(user)};")
deleteJob.setTiming("0 0 2 * * *")

jobService.save(deleteJob)

Job permaDeleteJob = new Job()
permaDeleteJob.setName("permanentlyDeleteRejected")
permaDeleteJob.setActive(true)
permaDeleteJob.setScriptType(ScriptType.GROOVY)
permaDeleteJob.setScript("import cz.inqool.uas.history.HistoryEventService\n" +
        "import cz.inqool.uas.index.global.GlobalReindexer\n" +
        "import cz.inqool.uas.indihu.entity.domain.User\n" +
        "import cz.inqool.uas.indihu.repository.UserRepository\n" +
        "\n" +
        "import javax.persistence.EntityManager\n" +
        "import javax.servlet.Registration\n" +
        "import java.time.temporal.ChronoUnit\n" +
        "\n" +
        "UserRepository userRepository = spring.getBean(UserRepository.class)\n" +
        "HistoryEventService historyEventService = spring.getBean(HistoryEventService.class)\n" +
        "EntityManager entityManager = spring.getBean(EntityManager.class)\n" +
        "GlobalReindexer globalReindexer = spring.getBean(GlobalReindexer.class)\n" +
        "\n" +
        "List<User> users = userRepository.findDeletedBefore(31L, ChronoUnit.DAYS, 10L)\n" +
        "\n" +
        "for (User user: users) {\n" +
        "    if (user.getRegistration() != null) {\n" +
        "        entityManager.remove(user.getRegistration())\n" +
        "        historyEventService.createHistoryEvent(\"GROOVY SCRIPT\", Registration.class.getSimpleName(), user.getRegistration(), null)\n" +
        "    }\n" +
        "    entityManager.remove(user)\n" +
        "    historyEventService.createHistoryEvent(\"GROOVY SCRIPT\", User.class.getSimpleName(), user, null)\n" +
        "}\n" +
        "\n" +
        "entityManager.flush()\n" +
        "\n" +
        "globalReindexer.reindexSubset(false, Arrays.asList(UserRepository.class));")
permaDeleteJob.setTiming("0 0 0 * * MON")

jobService.save(permaDeleteJob)