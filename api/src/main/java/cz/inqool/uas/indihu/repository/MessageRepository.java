package cz.inqool.uas.indihu.repository;

import cz.inqool.uas.indihu.entity.domain.Message;
import cz.inqool.uas.indihu.entity.domain.QMessage;
import cz.inqool.uas.store.DatedStore;
import org.springframework.stereotype.Repository;

@Repository
public class MessageRepository extends DatedStore<Message, QMessage> {

    public MessageRepository() {
        super(Message.class, QMessage.class);
    }
}
