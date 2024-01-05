import { useDispatch } from "react-redux";
import { Formik } from "formik";

// Components
import ThemeForm from "./ThemeForm";
import Footer from "./Footer";

// Utils
import {
  createThemeProcessedFormData,
  defaultInitialValues,
  saveExpoDesignData,
} from "./utils";

import { isEmpty } from "lodash";

// Models
import { AppDispatch } from "store/store";
import { ActiveExpo } from "models";
import { ThemeFormData } from "./models";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - - - - - - - -

interface ExpoThemeProps {
  activeExpo: ActiveExpo;
}

const ExpoTheme = (props: ExpoThemeProps) => {
  const dispatch = useDispatch<AppDispatch>();

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
        const respBody = await saveExpoDesignData(processedFormData, expoId);
        if (!respBody) {
          dispatch(
            setDialog(DialogType.InfoDialog, {
              title: "Uloženie zmien nebolo úspešné",
              text: "Pri ukladaní zmien motívu nastala chyba.",
              noStornoButton: true,
            })
          );
        } else {
          dispatch(
            setDialog(DialogType.InfoDialog, {
              title: "Uloženie zmien prebehlo úspešné",
              text: "Zmeny motívu boli úspešné uložené.",
              noStornoButton: true,
            })
          );
        }
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

export default ExpoTheme;
