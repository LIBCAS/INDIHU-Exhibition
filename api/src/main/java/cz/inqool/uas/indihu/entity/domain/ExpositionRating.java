package cz.inqool.uas.indihu.entity.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.inqool.uas.domain.DomainObject;
import cz.inqool.uas.indihu.entity.dto.Preferences;
import cz.inqool.uas.indihu.entity.dto.RatingDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.util.Arrays;

/**
 * Entity representing ratings for each exposition
 */
@Getter
@Setter
@Entity
@Table(name = "in_exposition_rating")
public class ExpositionRating extends DomainObject {

    @OneToOne(optional = false, mappedBy = "expositionRating")
    @JsonIgnore
    private Exposition exposition;

    private Long ratingCount = 0L;

    private Double average = 0d;

    private Long gameCount = 0L;

    private Long mediaCount = 0L;

    private Long textCount = 0L;

    private Long topicCount = 0L;

    public void update(RatingDto ratingDto) {
        Double ratingSum = ratingCount * average;
        ratingCount += 1;

        average = (ratingSum + ratingDto.getRating()) / ratingCount;

        Preferences preferences = ratingDto.getPreferences();

        if (ratingDto.getPreferences() == null) {
            return;
        }

        gameCount += preferences.isGame() ? 1 : 0;
        mediaCount += preferences.isMedia() ? 1 : 0;
        textCount += preferences.isText() ? 1 : 0;
        topicCount += preferences.isGame() ? 1 : 0;
    }

    public Preferences getPreferences() {
        Preferences preferences = new Preferences();
        long maximum = Arrays.stream(new Long[]{gameCount, mediaCount, textCount, topicCount}).reduce(0L, Math::max);
        preferences.setGame(gameCount.equals(maximum));
        preferences.setTopic(topicCount.equals(maximum));
        preferences.setMedia(mediaCount.equals(maximum));
        preferences.setText(textCount.equals(maximum));

        return preferences;
    }
}
