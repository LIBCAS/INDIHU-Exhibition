import { Formik, FormikProps } from "formik";

// Components
import ThemeForm from "./ThemeForm";
import Button from "react-md/lib/Buttons/Button";

// Utils
import {
  createThemeProcessedFormData,
  defaultInitialValues,
  saveExpoDesignData,
} from "./utils";
import { downloadFile } from "utils/download-file";
import { isEmpty } from "lodash";

// Models
import { ActiveExpo } from "models";
import { ThemeFormData } from "./models";

// - - - - - - - -

interface ExpoThemeProps {
  activeExpo: ActiveExpo;
  history: unknown;
  location: unknown;
  match: unknown;
}

// - - - - - - -

const ExpoTheme = (props: ExpoThemeProps) => {
  const activeExpo = props.activeExpo;

  if (isEmpty(activeExpo)) {
    return null;
  }

  const expoId = activeExpo.id;
  const expoDesignData = activeExpo.expositionDesignData;

  return (
    <Formik<ThemeFormData>
      initialValues={
        expoDesignData
          ? {
              theme: expoDesignData.theme,
              backgroundColor: expoDesignData.backgroundColor,
              iconsColor: expoDesignData.iconsColor,
              startButtonColor: expoDesignData.startButtonColor,
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
          <Footer formik={formik} />
        </>
      )}
    </Formik>
  );
};

// - - - - - -

interface FooterProps {
  formik: FormikProps<any>;
}

const Footer = ({ formik }: FooterProps) => {
  const importThemeFile = () => {
    const element = document.querySelector("#input-import-file");
    const inputElement = element as HTMLInputElement | null;
    inputElement?.click();
  };

  const exportThemeFile = () => {
    const processedData = createThemeProcessedFormData(formik.values);
    const stringifiedValues = JSON.stringify(processedData);
    const blob = new Blob([stringifiedValues], { type: "application/json" });
    downloadFile(blob, "expo-design-export.json");
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
            label="Exportovať"
            style={{ backgroundColor: "white" }}
            onClick={exportThemeFile}
          />
          <Button
            raised
            label="Importovať"
            style={{ backgroundColor: "white" }}
            onClick={importThemeFile}
          />
        </div>
        <div className="flex gap-2">
          <Button
            raised
            label="Resetovat nastavenia"
            style={{ backgroundColor: "white" }}
            onClick={resetDesignSettings}
          />
          <Button
            raised
            label="Uložit zmeny"
            style={{ backgroundColor: "white" }}
            onClick={formik.submitForm}
          />
        </div>
      </div>
    </div>
  );
};

// - - - - - -

export default ExpoTheme;
