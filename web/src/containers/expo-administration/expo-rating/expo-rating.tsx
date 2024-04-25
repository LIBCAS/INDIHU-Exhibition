import { useTranslation } from "react-i18next";
import { Container } from "@mui/material";

import { ActiveExpo } from "models";

import { isEmpty } from "lodash";
import RatingStatisticsTable from "./RatingStatisticsTable";
import RatingCommentsPanel from "./RatingCommentsPanel";

// - -

type ExpoRatingProps = {
  activeExpo: ActiveExpo;
};

const ExpoRating = ({ activeExpo }: ExpoRatingProps) => {
  const { expositionRating, messages } = activeExpo;
  const { t } = useTranslation("expo");

  if (isEmpty(activeExpo)) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <div className="w-full pt-36 pb-16 flex flex-col gap-6">
        {/* Rating statistics */}
        <div className="w-fit flex flex-col gap-2">
          <div className="font-bold text-lg">{t("rating.expoRating")}</div>
          {!expositionRating && (
            <div className="pl-2 italic">{t("rating.expoNoRatingYet")}</div>
          )}

          {expositionRating && (
            <div>
              <RatingStatisticsTable expositionRating={expositionRating} />
            </div>
          )}
        </div>

        {/* Views */}
        <div className="flex gap-4 items-center">
          <div className="font-bold text-lg">{t("rating.numberOfViews")}</div>
          <span>{activeExpo.viewCounter}</span>
        </div>

        {/* Messages to the exposition, textfield from rating dialog */}
        <div className="flex flex-col gap-3">
          <div className="font-bold text-lg">{t("rating.expoComments")}</div>
          {(!messages || messages?.length === 0) && (
            <div className="pl-2 italic">{t("rating.expoNoCommentsYet")}</div>
          )}

          {messages && (
            <div>
              <RatingCommentsPanel messages={messages} />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ExpoRating;
