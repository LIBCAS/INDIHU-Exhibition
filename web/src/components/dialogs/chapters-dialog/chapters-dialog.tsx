import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useScreenChapters } from "hooks/view-hooks/screen-chapters-hook";

import DialogWrap from "../dialog-wrap-noredux-typed";

import { ScreenItem } from "./screen-item";

import { Screen } from "models/screen";
import { ScreenHighlight } from "models/screen";

// - -

export type ChaptersDialogProps = {
  closeThisDialog: () => void;
  screens?: Screen[][];
  viewExpoUrl?: string;
  hightlight?: ScreenHighlight;
  onClick?: () => void;
};

export const ChaptersDialog = ({
  closeThisDialog,
  screens,
  viewExpoUrl,
  hightlight,
  onClick,
}: ChaptersDialogProps) => {
  const { t } = useTranslation("view-exhibition");

  const screenChapters = useScreenChapters(screens);

  const handleClick = useCallback(() => {
    closeThisDialog();
    onClick?.();
  }, [closeThisDialog, onClick]);

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={<span className="text-2xl font-bold">{t("chapters")}</span>}
      big
      noDialogMenu
      closeOnEsc
      applyTheming
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
    </DialogWrap>
  );
};
