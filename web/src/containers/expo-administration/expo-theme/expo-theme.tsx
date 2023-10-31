// import { useHistory } from "react-router-dom";
import { Formik, FormikProps } from "formik";
import { useTranslation } from "react-i18next";

// Components
import ThemeForm from "./ThemeForm";
import Button from "react-md/lib/Buttons/Button";

// Utils
import {
  createThemeProcessedFormData,
  defaultInitialValues,
  saveExpoDesignData,
} from "./utils";
import { downloadFile } from "utils";
import { isEmpty } from "lodash";

// Models
import { ActiveExpo } from "models";
import { ThemeFormData } from "./models";

// - - - - - - - -

interface ExpoThemeProps {
  activeExpo: ActiveExpo;
}

// - - - - - - -

const ExpoTheme = (props: ExpoThemeProps) => {
  const activeExpo = props.activeExpo;

  if (isEmpty(activeExpo)) {
    return null;
  }

  const expoId = activeExpo.id;
  const expoTitle = activeExpo.title;
  const expoDesignData = activeExpo.expositionDesignData;

  return (
    <Formik<ThemeFormData>
      initialValues={
        expoDesignData
          ? {
              theme: expoDesignData.theme,
              backgroundColor: expoDesignData.backgroundColor,
              iconsColor: expoDesignData.iconsColor,
              tagsColor: expoDesignData.tagsColor,
              logoType: expoDesignData.logoType,
              logoPosition: expoDesignData.logoPosition,
              logoFileName: expoDesignData.logoFile?.name ?? "",
              logoFile: expoDesignData.logoFile ?? null,
              defaultInfopointShape: expoDesignData.defaultInfopointShape,
              defaultInfopointPxSize: expoDesignData.defaultInfopointPxSize,
              defaultInfopointColor: expoDesignData.defaultInfopointColor,
              defaultInfopointIconFileName:
                expoDesignData.defaultInfopointIconFile?.name ?? "",
              defaultInfopointIconFile:
                expoDesignData.defaultInfopointIconFile ?? null,
            }
          : defaultInitialValues
      }
      onSubmit={async (formData) => {
        const processedFormData = createThemeProcessedFormData(formData);
        saveExpoDesignData(processedFormData, expoId);
      }}
    >
      {(formik) => (
        <>
          <div className="container container-tabMenu">
            <div className="p-4">
              <ThemeForm formik={formik} activeExpo={activeExpo} />
            </div>
          </div>
          <Footer formik={formik} expoTitle={expoTitle} />
        </>
      )}
    </Formik>
  );
};

// - - - - - -

interface FooterProps {
  formik: FormikProps<ThemeFormData>;
  expoTitle: string;
}

const Footer = ({ formik, expoTitle }: FooterProps) => {
  const { t } = useTranslation("expo");
  // const history = useHistory();

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
          />
        </div>
        <div className="flex gap-2">
          <Button
            raised
            label={t("theming.resetSettingsLabel")}
            style={{ backgroundColor: "white" }}
            onClick={resetDesignSettings}
          />
          <Button
            raised
            label={t("theming.saveChangesLabel")}
            style={{ backgroundColor: "white" }}
            onClick={() => {
              formik.submitForm();
              // history.go(0); // refresh page
            }}
          />
        </div>
      </div>
    </div>
  );
};

// - - - - - -

export default ExpoTheme;
