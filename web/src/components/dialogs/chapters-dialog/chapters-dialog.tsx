import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Screen } from "models/screen";

import { DialogProps, DialogType } from "../dialog-types";
import Dialog from "../dialog-wrap";
import { ScreenHighlight, ScreenItem } from "./screen-item";
import { useScreenChapters } from "./screen-chapters-hook";

export type ChaptersDialogData = {
  screens?: Screen[][];
  viewExpoUrl?: string;
  hightlight?: ScreenHighlight;
  onClick?: () => void;
};

export const ChaptersDialog = ({
  dialogData,
  closeDialog,
}: DialogProps<DialogType.ChaptersDialog>) => {
  const screenChapters = useScreenChapters(dialogData?.screens);
  const { onClick } = dialogData ?? {};
  const { t } = useTranslation("exposition");

  const handleClick = useCallback(() => {
    closeDialog();
    onClick?.();
  }, [closeDialog, onClick]);

  return (
    <Dialog
      big
      title={<span className="text-2xl font-bold">{t("chapters")}</span>}
      name={DialogType.ChaptersDialog}
      noDialogMenu
    >
      {screenChapters?.length === 0 && <span>{t("no-screens")}</span>}
      {screenChapters?.map((screen) => (
        <ScreenItem
          key={`${screen.sectionIndex}-${screen.screenIndex}`}
          screen={screen}
          viewExpoUrl={dialogData?.viewExpoUrl}
          onClick={handleClick}
          highlight={dialogData?.hightlight}
        />
      ))}
    </Dialog>
  );
};
