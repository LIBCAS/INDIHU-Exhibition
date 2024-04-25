import cz.inqool.uas.indihu.repository.UserRepository

UserRepository userRepository = spring.getBean(UserRepository.class);
userRepository.findRejected().forEach {user -> userRepository.delete(user)};