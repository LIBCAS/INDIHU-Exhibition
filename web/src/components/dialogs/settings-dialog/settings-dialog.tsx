import { useTranslation } from "react-i18next";
import DialogWrap from "../dialog-wrap-noredux-typed";
import LanguageSelect from "components/language-select/LanguageSelect";

// - - - - - - - -

interface SettingsDialogProps {
  closeThisDialog: () => void;
}

export const SettingsDialog = ({ closeThisDialog }: SettingsDialogProps) => {
  const { t } = useTranslation("view-screen", {
    keyPrefix: "overlay.settingsDialog",
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
      <div className="flex flex-col gap-4 px-2 ">
        {/* 1. Language option*/}
        <div className="flex justify-between items-center gap-2">
          <div className="text-xl font-medium w-1/2 ">
            {t("languageSelectLabel")}
          </div>
          <div className="w-1/2">
            <LanguageSelect />
          </div>
        </div>
      </div>
    </DialogWrap>
  );
};
