import { useTranslation } from "react-i18next";
import DialogWrap from "../dialog-wrap-noredux-typed";
import GlassMagnifierSettings from "containers/views/view-screen-overlay/ActionsPanel/GlassMagnifierButton/GlassMagnifierSettings";

// - -

interface GlassMagnifierProps {
  closeThisDialog: () => void;
}

export const GlassMagnifierDialog = ({
  closeThisDialog,
}: GlassMagnifierProps) => {
  const { t } = useTranslation("view-screen", {
    keyPrefix: "overlay.glassMagnifier",
  });

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={<span className="text-2xl font-bold">{t("title")}</span>}
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      <GlassMagnifierSettings biggerElements />
    </DialogWrap>
  );
};
