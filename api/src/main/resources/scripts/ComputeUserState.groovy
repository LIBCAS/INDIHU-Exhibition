import cz.inqool.uas.indihu.entity.domain.User
import cz.inqool.uas.indihu.entity.enums.UserState
import cz.inqool.uas.indihu.repository.UserRepository

UserRepository userRepository = spring.getBean(UserRepository.class)
List<User> userList = userRepository.findAll();
List<User> toSave = new ArrayList<>();
for (User user:userList){
    if(user.getVerifiedEmail() != null && user.getVerifiedEmail()){
        user.setState(UserState.TO_ACCEPT)
    }else {
        user.setState(UserState.NOT_VERIFIED)
    }
    if (user.accepted != null && user.accepted){
        user.setState(UserState.ACCEPTED)
    }
    if (user.getDeleted()!=null){
        user.setState(UserState.DELETED)
    }
    toSave.add(user)
}
userRepository.save(toSave)
23