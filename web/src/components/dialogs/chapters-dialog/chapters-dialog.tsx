import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useScreenChapters } from "hooks/view-hooks/screen-chapters-hook";

import Dialog from "../dialog-wrap-typed";
import { DialogProps, DialogType } from "../dialog-types";

import { ScreenItem } from "./screen-item";

import { Screen } from "models/screen";
import { ScreenHighlight } from "models/screen";

// - -

export type ChaptersDialogDataProps = {
  screens?: Screen[][];
  viewExpoUrl?: string;
  hightlight?: ScreenHighlight;
  onClick?: () => void;
};

export const ChaptersDialog = ({
  dialogData,
  closeDialog,
}: DialogProps<DialogType.ChaptersDialog>) => {
  const { t } = useTranslation("exhibition");
  const { screens, viewExpoUrl, hightlight, onClick } = dialogData ?? {};

  const screenChapters = useScreenChapters(screens);

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
      {screenChapters?.map((screenChapter) => (
        <ScreenItem
          key={`${screenChapter.sectionIndex}-${screenChapter.screenIndex}`}
          screen={screenChapter}
          viewExpoUrl={viewExpoUrl}
          onClick={handleClick}
          highlight={hightlight}
          usedInDialog
        />
      ))}
    </Dialog>
  );
};
