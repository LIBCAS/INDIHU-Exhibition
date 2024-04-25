import { useTranslation } from "react-i18next";

import DialogWrap from "../dialog-wrap-noredux-typed";
import { ViewFinishInfo } from "containers/views/view-finish/view-finish-info";

import { ViewExpo, StartScreen } from "models";

export type FinishInfoDialogProps = {
  closeThisDialog: () => void;
  viewExpo?: ViewExpo | null;
  viewStart?: StartScreen;
};

export const FinishInfoDialog = ({
  closeThisDialog,
  viewExpo,
  viewStart,
}: FinishInfoDialogProps) => {
  const { t } = useTranslation("view-exhibition");

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={<span className="text-2xl font-bold">{t("info")}</span>}
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      <ViewFinishInfo viewExpo={viewExpo} viewStart={viewStart} />
    </DialogWrap>
  );
};
