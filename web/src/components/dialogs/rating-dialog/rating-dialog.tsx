import { useTranslation } from "react-i18next";

import DialogWrap from "../dialog-wrap-noredux-typed";
import RatingPanel from "containers/views/view-finish/rating-panel/RatingPanel";

import { ExpoRates } from "models";

// - - - - - - - -

export type RatingDialogProps = {
  closeThisDialog: () => void;
  openInformationFailDialog: () => void;
  expoId: string;
  setExpoRates: (
    value: ExpoRates | ((prevValue: ExpoRates) => ExpoRates)
  ) => void;
};

export const RatingDialog = ({
  closeThisDialog,
  openInformationFailDialog,
  expoId,
  setExpoRates,
}: RatingDialogProps) => {
  const { t } = useTranslation("view-screen", { keyPrefix: "rating" });

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={<div className="text-2xl font-medium">{t("title")}</div>}
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      <RatingPanel
        expoId={expoId}
        openInformationFailDialog={openInformationFailDialog}
        setExpoRates={setExpoRates}
        closeRatingDialog={closeThisDialog}
      />
    </DialogWrap>
  );
};
