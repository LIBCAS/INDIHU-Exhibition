import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Form, FormikProps } from "formik";

// Components
import {
  ReactMdSelectField,
  ReactMdTextField,
} from "components/form/formik/react-md";
import ColorPicker from "components/form/formik/ColorPicker";
import Button from "react-md/lib/Buttons/Button";

// Utils
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";
import { handleImportedFile } from "./utils";

// Models
import { ThemeFormData } from "./models";
import { ActiveExpo } from "models";
import { AppDispatch } from "store/store";

// - - - - - - - -

interface ThemeFormProps {
  formik: FormikProps<ThemeFormData>;
  activeExpo: ActiveExpo;
}

const ThemeForm = ({ formik, activeExpo }: ThemeFormProps) => {
  const { t } = useTranslation("expo");
  const dispatch = useDispatch<AppDispatch>();

  const [importedFile, setImportedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!importedFile) {
      return;
    }

    handleImportedFile(activeExpo, formik, importedFile, setImportedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedFile]);

  useEffect(() => {
    if (
      formik.values.theme === "LIGHT" &&
      formik.values.tagsColor === "#6c757d"
    ) {
      formik.setFieldValue("tagsColor", "#000000");
    }
    if (
      formik.values.theme === "DARK" &&
      formik.values.tagsColor === "#000000"
    ) {
      formik.setFieldValue("tagsColor", "#6c757d");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.theme]);

  return (
    <Form>
      <div className="flex flex-col gap-10 w-full desktop:w-1/3 mb-8">
        {/* 1. General Expo Settings */}
        <div className="flex flex-col gap-1">
          <p className="font-bold text-xl underline mb-2">
            {t("theming.generalThemeSettings.title")}
          </p>
          <div>
            <ReactMdSelectField
              name="theme"
              label={t("theming.generalThemeSettings.expoThemeLabel")}
              controls={[
                {
                  label: t("theming.generalThemeSettings.expoThemeLight"),
                  value: "LIGHT",
                },
                {
                  label: t("theming.generalThemeSettings.expoThemeDark"),
                  value: "DARK",
                },
              ]}
              fullWidth
            />
          </div>
          <div>
            <ColorPicker
              name="backgroundColor"
              label={t("theming.generalThemeSettings.expoBackgroundColorLabel")}
            />
          </div>
          <div>
            <ColorPicker
              name="iconsColor"
              label={t("theming.generalThemeSettings.expoIconsColorLabel")}
            />
          </div>
          <div>
            <ColorPicker
              name="tagsColor"
              label={t("theming.generalThemeSettings.expoTagsColorLabel")}
            />
          </div>
        </div>

        {/* 2. Logo vs Vodoznak */}
        <div className="flex flex-col gap-1">
          <p className="font-bold text-xl underline mb-2">
            {t("theming.logoAndWatermarkSettings.title")}
          </p>
          <div>
            <ReactMdSelectField
              name="logoType"
              label={t("theming.logoAndWatermarkSettings.expoLogoTypeLabel")}
              controls={[
                {
                  label: t("theming.logoAndWatermarkSettings.expoLogoTypeLogo"),
                  value: "LOGO",
                },
                {
                  label: t(
                    "theming.logoAndWatermarkSettings.expoLogoTypeWatermark"
                  ),
                  value: "WATERMARK",
                },
              ]}
              fullWidth
            />
          </div>
          <div>
            <ReactMdSelectField
              name="logoPosition"
              label={t(
                "theming.logoAndWatermarkSettings.expoLogoPositionLabel"
              )}
              controls={[
                {
                  label: t(
                    "theming.logoAndWatermarkSettings.expoLogoPositionUpRight"
                  ),
                  value: "UPPER_RIGHT",
                },
                {
                  label: t(
                    "theming.logoAndWatermarkSettings.expoLogoPositionUpLeft"
                  ),
                  value: "UPPER_LEFT",
                },
                {
                  label: t(
                    "theming.logoAndWatermarkSettings.expoLogoPositionDownLeft"
                  ),
                  value: "LOWER_LEFT",
                },
              ]}
              fullWidth
            />
          </div>
          <div className="flex flex-col">
            <ReactMdTextField
              name="logoFileName"
              label={t("theming.logoAndWatermarkSettings.expoLogoFileLabel")}
              disabled
            />

            <Button
              flat
              label={t("theming.selectLabel")}
              onClick={() => {
                dispatch(
                  setDialog(DialogType.ScreenFileChoose, {
                    onChoose: (file) => {
                      formik.setFieldValue("logoFileName", file.name);
                      formik.setFieldValue("logoFile", file);
                    },
                    typeMatch: new RegExp(/^image\/.*$/),
                    accept: "image/*",
                    style: { zIndex: 10002 },
                  })
                );
              }}
            />
          </div>
        </div>

        {/* 3. Infopoint default values section */}
        <div className="flex flex-col gap-1">
          <p className="font-bold text-xl underline mb-2">
            {t("theming.defaultInfopointSettings.title")}
          </p>
          <div>
            <ReactMdSelectField
              controls={[
                {
                  label: t(
                    "theming.defaultInfopointSettings.infopointShapeSquare"
                  ),
                  value: "SQUARE",
                },
                {
                  label: t(
                    "theming.defaultInfopointSettings.infopointShapeCircle"
                  ),
                  value: "CIRCLE",
                },
                {
                  label: t(
                    "theming.defaultInfopointSettings.infopointShapeIcon"
                  ),
                  value: "ICON",
                },
              ]}
              label={t("theming.defaultInfopointSettings.infopointShapeLabel")}
              name="defaultInfopointShape"
              fullWidth
            />
          </div>
          <div>
            <ReactMdTextField
              name="defaultInfopointPxSize"
              label={t("theming.defaultInfopointSettings.infopointPxSizeLabel")}
              type="number"
            />
          </div>
          <div>
            <ColorPicker
              name="defaultInfopointColor"
              label={t("theming.defaultInfopointSettings.infopointColorLabel")}
            />
          </div>

          <div className="flex flex-col">
            <ReactMdTextField
              name="defaultInfopointIconFileName"
              label={t(
                "theming.defaultInfopointSettings.infopointIconFileLabel"
              )}
              disabled
            />

            <Button
              flat
              label={t("theming.selectLabel")}
              onClick={() => {
                dispatch(
                  setDialog(DialogType.ScreenFileChoose, {
                    onChoose: (file) => {
                      formik.setFieldValue(
                        "defaultInfopointIconFileName",
                        file.name
                      );
                      formik.setFieldValue("defaultInfopointIconFile", file);
                    },
                    typeMatch: new RegExp(/^image\/.*$/),
                    accept: "image/*",
                    style: { zIndex: 10002 },
                  })
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* IMPORT Helper input, hidden with display: none, programatically clicked */}
      <input
        type="file"
        accept="application/json"
        id="input-import-file"
        style={{ display: "none" }}
        onChange={(e) => {
          const fileList = e.currentTarget.files;
          const importFile: File | null =
            fileList && fileList.length > 0 ? fileList.item(0) : null;
          setImportedFile(importFile);
        }}
        // Handler required in order when the same file is selected twice in a row, to fire the onChange event
        onClick={(e) => {
          e.currentTarget.value = "";
        }}
      />
    </Form>
  );
};

export default ThemeForm;
