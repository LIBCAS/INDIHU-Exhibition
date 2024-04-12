package cz.inqool.uas.indihu.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.StringPath;
import cz.inqool.uas.exception.MissingObject;
import cz.inqool.uas.index.IndexedDatedStore;
import cz.inqool.uas.indihu.entity.domain.QUser;
import cz.inqool.uas.indihu.entity.domain.User;
import cz.inqool.uas.indihu.entity.enums.UserRole;
import cz.inqool.uas.indihu.entity.enums.UserState;
import cz.inqool.uas.indihu.entity.indexed.IndexedUser;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.Instant;
import java.time.temporal.TemporalUnit;
import java.util.List;
import java.util.Optional;

/**
 * Created by Michal on 19. 7. 2017.
 */
@Repository
@Transactional
public class UserRepository extends IndexedDatedStore<User, QUser, IndexedUser> {


    public UserRepository() {
        super(User.class, QUser.class, IndexedUser.class);
    }

    @Override
    public IndexedUser toIndexObject(User user) {
        IndexedUser result = super.toIndexObject(user);
        result.setEmail(user.getEmail());
        result.setFirstName(user.getFirstName());
        result.setSurname(user.getSurname());
        result.setInstitution(user.getInstitution());
        result.setRole(user.getRole().name());
        result.setUserName(user.getUserName());
        result.setAccepted(user.isAccepted());
        result.setActive(user.isAccepted()&&user.getDeleted()==null);
        result.setState(user.getState().name());
        return result;
    }

    /**
     * finds user by user name
     */
    public User findByLogin(String userName) {
        QUser qUser = this.qObject();

        User result = query()
                .select(qUser)
                .where(qUser.userName.isNotNull().and(qUser.userName.eq(userName)))
                .fetchFirst();
        detachAll();
        return result;
    }

    /**
     * @return all email addresses of admins in system
     */
    public List<String> getAdminMails() {
        QUser qUser = this.qObject();

        List<String> result = query()
                .select(qUser.email)
                .where(qUser.role.isNotNull().and(qUser.role.eq(UserRole.ROLE_ADMIN)))
                .where(qUser.registrationNotifications.isTrue())
                .fetch();
        detachAll();
        return result;
    }

    /**
     * finds user by email
     */
    public User findByEmail(String email){
        QUser qUser = this.qObject();

        User result =  query()
                .select(qUser)
                .where(qUser.email.eq(email))
                .fetchFirst();
        detachAll();
        return result;
    }

    @Override
    protected BooleanExpression findWhereExpression() {
        StringPath id = propertyPath("id");

        return id.isNotNull();
    }

    public User findUser(String id) {
        return Optional.ofNullable(query()
                .select(qObject)
                .from(qObject)
                .where(qObject.id.eq(id)).fetchFirst())
                .orElseThrow(() -> new MissingObject(User.class, id));
    }

    public User findNotDeleted(String userId) {
        return Optional.ofNullable(query()
                .select(qObject)
                .from(qObject)
                .where(qObject.id.eq(userId).and(qObject.deleted.isNull()))
                .fetchFirst()).orElseThrow(() -> new MissingObject(User.class, userId));
    }

    public void deleteUser(User user) {
        if (!entityManager.contains(user) && user != null) {
            user = entityManager.find(type, user.getId());
        }

        entityManager.remove(user);
        entityManager.flush();
        removeIndex(user);
    }

    /**
     * Currently only used in CRON
     *
     * @return List of users in state REJECTED
     */
    public List<User> findRejected() {
        return query()
                .select(qObject)
                .from(qObject)
                .where(qObject.state.eq(UserState.REJECTED))
                .fetch();
    }

    /**
     * Currently only used in CRON
     *
     * @return List of users deleted before specified amount of time
     */
    public List<User> findDeletedBefore(long amount, TemporalUnit unit, long maxResultSize) {
        return query()
                .select(qObject)
                .from(qObject)
                .where(qObject.deleted.isNotNull().and(qObject.deleted.before(Instant.now().minus(amount, unit))))
                .limit(maxResultSize)
                .fetch();
    }
}
