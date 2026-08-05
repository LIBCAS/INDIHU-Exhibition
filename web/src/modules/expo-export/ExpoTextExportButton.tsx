import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "react-md/lib/Buttons/Button";

import HelpIcon from "components/help-icon";
import { Spinner } from "components/loaders/spinner";

const sleep = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

const ExpoTextExportButton = () => {
  const { t } = useTranslation("expo");

  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      await sleep(3000);
    } finally {
      setIsExporting(false);
    }
  }, []);

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
