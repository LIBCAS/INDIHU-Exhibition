import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// Components
import { LabeledItem } from "components/labeled-item/labeled-item";
import TagsList from "components/tags-list/TagsList";
import RatingPanel from "./rating-panel/RatingPanel";

// Models
import { ViewExpo, StartScreen, ExpoRates } from "models";

// - - - - - - - -

type ViewFinishInfoProps = {
  viewExpo?: ViewExpo | null;
  viewStart?: StartScreen;
  openInformationFailDialog?: () => void;
  setExpoRates?: (
    value: ExpoRates | ((prevValue: ExpoRates) => ExpoRates)
  ) => void;
  isExpoAlreadyRated?: boolean;
};

export const ViewFinishInfo = ({
  viewExpo,
  viewStart,
  openInformationFailDialog,
  setExpoRates,
  isExpoAlreadyRated,
}: ViewFinishInfoProps) => {
  const collaborators = viewStart?.collaborators ?? [];
  const { t } = useTranslation(["view-exhibition", "view-screen"]);

  const tags = useMemo(() => viewExpo?.tags, [viewExpo?.tags]);

  const shouldIncludeRatingSection =
    openInformationFailDialog &&
    setExpoRates &&
    isExpoAlreadyRated !== undefined;

  return (
    <div>
      <section className="my-4">
        <span className="text-2xl font-bold">{t("authors")}</span>
      </section>

      {/* Tags */}
      {tags && (
        <div className="mb-4">
          <TagsList tags={tags} />
        </div>
      )}

      <hr />

      <section className="my-4">
        <span>{viewExpo?.author?.institution}</span>
      </section>

      <hr />

      <section className="my-4">
        {!collaborators.length && t("no-authors")}
        {collaborators.map(({ role, text }: any, i: number) => (
          <LabeledItem key={i} label={role}>
            {text}
          </LabeledItem>
        ))}
      </section>

      {/* Rating section */}
      {shouldIncludeRatingSection && (
        <>
          <hr />

          <section className="my-4">
            <span className="text-2xl font-bold">
              {t("rating.expoRating", { ns: "view-screen" })}
            </span>
            {isExpoAlreadyRated === false ? (
              <RatingPanel
                expoId={viewExpo?.id}
                openInformationFailDialog={openInformationFailDialog}
                setExpoRates={setExpoRates}
              />
            ) : (
              <div className="mt-2 italic">
                {t("rating.expoAlreadyRatedText", { ns: "view-screen" })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};
