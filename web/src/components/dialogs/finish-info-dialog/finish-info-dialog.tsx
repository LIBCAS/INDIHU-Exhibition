import { StartScreen } from "models/screen";

import { ViewFinishInfo } from "containers/views/view-finish/view-finish-info";
import { ViewExpo } from "reducers/expo-reducer";

import { DialogProps, DialogType } from "../dialog-types";
import Dialog from "../dialog-wrap-typed";
import { useTranslation } from "react-i18next";

export type FinishInfoDialogDataProps = {
  viewExpo?: ViewExpo | null;
  viewStart?: StartScreen;
};

export const FinishInfoDialog = ({
  dialogData,
}: DialogProps<DialogType.FinishInfoDialog>) => {
  const { viewExpo, viewStart } = dialogData ?? {};
  const { t } = useTranslation("exhibition");

  return (
    <Dialog
      large
      title={<span className="text-2xl font-bold">{t("info")}</span>}
      name={DialogType.FinishInfoDialog}
      noDialogMenu
    >
      <ViewFinishInfo viewExpo={viewExpo} viewStart={viewStart} />
    </Dialog>
  );
};
