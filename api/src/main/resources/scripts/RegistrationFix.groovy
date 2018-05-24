import cz.inqool.uas.indihu.entity.domain.Registration
import cz.inqool.uas.indihu.repository.RegistrationRepository
import cz.inqool.uas.indihu.repository.UserRepository

RegistrationRepository repository = spring.getBean(RegistrationRepository.class)
UserRepository userRepository = spring.getBean(UserRepository.class)
Collection<Registration> registrations = repository.findAll()
for(Registration registration : registrations){
    registration.getToAccept().setVerifiedEmail(false);
    userRepository.save(registration.getToAccept())
}