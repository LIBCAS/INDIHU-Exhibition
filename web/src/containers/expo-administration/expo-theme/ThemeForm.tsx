import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
            1. Všeobecné nastavenie motívu expozície
          </p>
          <div>
            <ReactMdSelectField
              name="theme"
              label="Expo Theme"
              controls={[
                {
                  label: "Svetlý",
                  value: "LIGHT",
                },
                {
                  label: "Tmavý",
                  value: "DARK",
                },
              ]}
              fullWidth
            />
          </div>
          <div>
            <ColorPicker name="backgroundColor" label="Farba pozadia výstavy" />
          </div>
          <div>
            <ColorPicker name="iconsColor" label="Farba ikon výstavy" />
          </div>
          <div>
            <ColorPicker
              name="startButtonColor"
              label="Farba tlačítka štart výstavy"
            />
          </div>
          <div>
            <ColorPicker name="tagsColor" label="Farba tagov výstavy" />
          </div>
        </div>

        {/* 2. Logo vs Vodoznak */}
        <div className="flex flex-col gap-1">
          <p className="font-bold text-xl underline mb-2">
            2. Nastavenie loga a vodoznaku
          </p>
          <div>
            <ReactMdSelectField
              name="logoType"
              label="Expo Logo typ"
              controls={[
                {
                  label: "Logo",
                  value: "LOGO",
                },
                {
                  label: "Vodoznak",
                  value: "WATERMARK",
                },
              ]}
              fullWidth
            />
          </div>
          <div>
            <ReactMdSelectField
              name="logoPosition"
              label="Expo Logo pozícia"
              controls={[
                {
                  label: "Hore vpravo",
                  value: "UPPER_RIGHT",
                },
                {
                  label: "Hore vľavo",
                  value: "UPPER_LEFT",
                },
                {
                  label: "Dole vľavo",
                  value: "LOWER_LEFT",
                },
              ]}
              fullWidth
            />
          </div>
          <div className="flex flex-col">
            <ReactMdTextField
              name="logoFileName"
              label="Soubor loga/vodoznaku"
              disabled
            />

            <Button
              flat
              label="Vybrat"
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
            3. Predvolený motív pre infopointy
          </p>
          <div>
            <ReactMdSelectField
              controls={[
                {
                  label: "Štvorec",
                  value: "SQUARE",
                },
                {
                  label: "Kruh",
                  value: "CIRCLE",
                },
                {
                  label: "Vlastná ikona",
                  value: "ICON",
                },
              ]}
              label="Tvar infopointu"
              name="defaultInfopointShape"
              fullWidth
            />
          </div>
          <div>
            <ReactMdTextField
              name="defaultInfopointPxSize"
              label="Velkosť v pixeloch"
              type="number"
            />
          </div>
          <div>
            <ColorPicker
              name="defaultInfopointColor"
              label="Farba infopointu"
            />
          </div>

          <div className="flex flex-col">
            <ReactMdTextField
              name="defaultInfopointIconFileName"
              label="Soubor ikony infopointu"
              disabled
            />

            <Button
              flat
              label="Vybrat"
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
