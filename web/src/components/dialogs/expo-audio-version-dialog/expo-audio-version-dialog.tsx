import { useTranslation } from "react-i18next";

// Components
import DialogWrap from "../dialog-wrap-noredux-typed";
import { FileItem } from "../files-dialog/file-item";

// Models
import { File } from "models";

// - - - - - -

export type ExpoAudioVersionDialogProps = {
  closeThisDialog: () => void;
  expoAudioVersionFile: File | null;
};

export const ExpoAudioVersionDialog = ({
  closeThisDialog,
  expoAudioVersionFile,
}: ExpoAudioVersionDialogProps) => {
  const { t } = useTranslation("view-exhibition");

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={
        <span className="text-2xl font-bold">{t("expo-audio-version")}</span>
      }
      big
      noDialogMenu
      closeOnEsc
      applyTheming
    >
      {expoAudioVersionFile && (
        <FileItem
          file={{
            ...expoAudioVersionFile,
            fileName: expoAudioVersionFile.name,
          }}
        />
      )}

      {!expoAudioVersionFile && <div>{t("no-expo-audio-version")}</div>}
    </DialogWrap>
  );
};
