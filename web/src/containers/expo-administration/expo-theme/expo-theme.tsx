import { useDispatch } from "react-redux";
import { Formik } from "formik";

// Components
import ThemeForm from "./ThemeForm";
import Footer from "./Footer";

// Utils
import {
  createThemeFormData,
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
import { useTranslation } from "react-i18next";

// - - - - - - - -

interface ExpoThemeProps {
  activeExpo: ActiveExpo;
}

const ExpoTheme = (props: ExpoThemeProps) => {
  const { t } = useTranslation("expo", { keyPrefix: "theming" });
  const dispatch = useDispatch<AppDispatch>();

  const activeExpo = props.activeExpo;
  const isActiveExpoEmpty = isEmpty(activeExpo);

  if (isActiveExpoEmpty) {
    return null;
  }

  const expoDesignData = activeExpo.expositionDesignData;

  // if expo does not contain expoDesignData (e.g. new expo with no previously saved design data)
  // use the default ones
  const themeFormData = expoDesignData
    ? createThemeFormData(expoDesignData)
    : defaultInitialValues;

  return (
    <Formik<ThemeFormData>
      initialValues={themeFormData}
      onSubmit={async (formData) => {
        const processedFormData = createThemeProcessedFormData(formData);
        const respBody = await saveExpoDesignData(
          processedFormData,
          activeExpo.id
        );
        if (!respBody) {
          dispatch(
            setDialog(DialogType.InfoDialog, {
              title: t("saveThemeFailureDialog.title") ?? "",
              text: t("saveThemeFailureDialog.text"),
              noStornoButton: true,
            })
          );
        } else {
          dispatch(
            setDialog(DialogType.InfoDialog, {
              title: t("saveThemeSuccessDialog.title") ?? "",
              text: t("saveThemeSuccessDialog.text"),
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
          <Footer formik={formik} expoTitle={activeExpo.title} />
        </>
      )}
    </Formik>
  );
};

export default ExpoTheme;
