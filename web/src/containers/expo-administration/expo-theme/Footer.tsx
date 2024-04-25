import { useTranslation } from "react-i18next";
import { FormikProps } from "formik";

// Components
import Button from "react-md/lib/Buttons/Button";

// Models
import { ThemeFormData } from "./models";

// Utils
import { defaultInitialValues, createThemeProcessedFormData } from "./utils";
import { downloadFile } from "utils";
import { useActiveExpoAccess } from "context/active-expo-access-provider/active-expo-access-provider";

// - -

interface FooterProps {
  formik: FormikProps<ThemeFormData>;
  expoTitle: string;
}

const Footer = ({ formik, expoTitle }: FooterProps) => {
  const { t } = useTranslation("expo");
  // const history = useHistory();

  const { isReadWriteAccess } = useActiveExpoAccess();

  const importThemeFile = () => {
    const element = document.querySelector("#input-import-file");
    const inputElement = element as HTMLInputElement | null;
    inputElement?.click();
  };

  const exportThemeFile = () => {
    const processedData = createThemeProcessedFormData(formik.values);
    const stringifiedValues = JSON.stringify(processedData);
    const blob = new Blob([stringifiedValues], { type: "application/json" });
    const fileName = expoTitle
      ? `${expoTitle}-export.json`
      : "expo-design-export.json";
    downloadFile(blob, fileName);
  };

  const resetDesignSettings = () => {
    formik.setValues(defaultInitialValues);
  };

  return (
    <div className="sticky bottom-0 left-0 z-[1000] bg-[#083d77] h-[3.8em]">
      <div className="h-full flex justify-between items-center py-2 px-4">
        <div className="flex gap-2">
          <Button
            raised
            label={t("theming.exportLabel")}
            style={{ backgroundColor: "white" }}
            onClick={exportThemeFile}
          />
          <Button
            raised
            label={t("theming.importLabel")}
            style={{ backgroundColor: "white" }}
            onClick={importThemeFile}
            disabled={!isReadWriteAccess}
          />
        </div>
        <div className="flex gap-2">
          <Button
            raised
            label={t("theming.resetSettingsLabel")}
            style={{ backgroundColor: "white" }}
            onClick={resetDesignSettings}
            disabled={!isReadWriteAccess}
          />
          <Button
            raised
            label={t("theming.saveChangesLabel")}
            style={{ backgroundColor: "white" }}
            onClick={() => {
              formik.submitForm();
              // history.go(0); // refresh page
            }}
            disabled={!isReadWriteAccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
