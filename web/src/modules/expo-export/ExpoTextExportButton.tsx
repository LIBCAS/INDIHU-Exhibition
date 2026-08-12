import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

// Components
import Button from "react-md/lib/Buttons/Button";
import HelpIcon from "components/help-icon";
import { Spinner } from "components/loaders/spinner";

// Types
import { ExpoStructure } from "models";

// Utils
import { downloadFile } from "utils";
import {
  createExpoTextExport,
  getExpoTextExportFileName,
} from "./utils/create-expo-text-export";

// - - - - - -

type ExpoTextExportButtonProps = {
  expoTitle: string;
  structure: ExpoStructure;
};

const ExpoTextExportButton = ({
  expoTitle,
  structure,
}: ExpoTextExportButtonProps): JSX.Element => {
  const { t } = useTranslation("expo");

  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExport = useCallback(async (): Promise<void> => {
    try {
      setIsExporting(true);
      const zipBlob = await createExpoTextExport(structure);
      const zipFileName = getExpoTextExportFileName(expoTitle);
      downloadFile(zipBlob, zipFileName);
    } catch (error) {
      console.error("Unable to export exhibition texts", error);
    } finally {
      setIsExporting(false);
    }
  }, [expoTitle, structure]);

  return (
    <div className="flex items-center gap-1">
      <Button
        raised
        label={t("settingsAndSharing.downloadExpoTexts")}
        onClick={handleExport}
        disabled={isExporting}
      />
      <HelpIcon
        label={t("settingsAndSharing.downloadExpoTextsTooltip")}
        id="expo-settings-download-texts"
        place="left"
      />
      {isExporting && <Spinner className="ml-4 w-5 h-5 border-2" />}
    </div>
  );
};

export default ExpoTextExportButton;
