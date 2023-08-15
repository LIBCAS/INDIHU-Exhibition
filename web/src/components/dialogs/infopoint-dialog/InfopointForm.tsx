import { Form, FormikProps } from "formik";
import { InfopointFormData } from "./models";

// FileChooseDialog stuff
import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "../dialog-types";

// Components
import {
  ReactMdTextField,
  ReactMdRadioGroup,
  ReactMdCheckbox,
  ReactMdSelectField,
} from "components/form/formik/react-md";
import Button from "react-md/lib/Buttons/Button";
import ColorPicker from "components/form/formik/ColorPicker";

// - - - - - - -

interface InfopointFormProps {
  formik: FormikProps<InfopointFormData>;
}

const InfopointForm = ({ formik }: InfopointFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Form>
      <div>
        <ReactMdTextField
          name="header"
          label="Nadpis infopointu"
          id="infopoint-header-textfield"
        />
      </div>

      <div>
        <ReactMdRadioGroup
          controls={[
            {
              label: "Text",
              value: "TEXT",
            },
            {
              label: "Obrázok",
              value: "IMAGE",
            },
            {
              label: "Video",
              value: "VIDEO",
            },
          ]}
          name="bodyContentType"
          label="Typ tela infopointu"
          inline
          className="mt-6"
          labelClassName="mb-0 font-['Work_Sans'] text-[13px] text-black/[.54]"
        />
      </div>

      {formik.values.bodyContentType === "TEXT" && (
        <div>
          <ReactMdTextField
            name="text"
            label="Textový popis infopointu"
            multiLine
            maxLength={150}
          />
        </div>
      )}

      {formik.values.bodyContentType === "IMAGE" && (
        <div className="flex flex-col">
          <ReactMdTextField name="imageName" label="Soubor obrázku" disabled />

          <Button
            flat
            label="Vybrat"
            onClick={() => {
              dispatch(
                setDialog(DialogType.ScreenFileChoose, {
                  onChoose: (file) => {
                    formik.setFieldValue("imageName", file.name);
                    formik.setFieldValue("imageFile", file);
                  },
                  typeMatch: new RegExp(/^image\/.*$/),
                  accept: "image/*",
                  style: { zIndex: 10002 },
                })
              );
            }}
          />
        </div>
      )}

      {formik.values.bodyContentType === "VIDEO" && (
        <div className="flex flex-col">
          <ReactMdTextField name="videoName" label="Soubor videa" disabled />

          <Button
            flat
            label="Vybrat"
            onClick={() => {
              dispatch(
                setDialog(DialogType.ScreenFileChoose, {
                  onChoose: (file) => {
                    formik.setFieldValue("videoName", file.name);
                    formik.setFieldValue("videoFile", file);
                  },
                  typeMatch: new RegExp(/^video\/.*$/),
                  accept: "video/*",
                  style: { zIndex: 10002 },
                })
              );
            }}
          />
        </div>
      )}

      <div>
        <div className="mt-4 mb-1 font-['Work_Sans'] text-[15px] text-black/[.83] underline">
          Voliteľné možnosti:
        </div>

        <ReactMdCheckbox name="alwaysVisible" label="Stále zobrazen" />
        <ReactMdCheckbox name="isUrlIncluded" label="Pridat odkaz" />

        {formik.values.isUrlIncluded && (
          <div className="-mt-4">
            <ReactMdTextField name="url" label="URL adresa" />
            <ReactMdTextField
              name="urlName"
              label="Název odkazovaného souboru"
            />
          </div>
        )}
      </div>

      <div>
        <div className="mt-4 mb-1 font-['Work_Sans'] text-[15px] text-black/[.83] underline">
          Tvar, velikost a farba infopointu:
        </div>

        <div className="w-full flex items-start gap-2">
          <div className="w-3/6">
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
              name="shape"
              fullWidth
            />
          </div>

          <div className="w-3/6">
            <ReactMdTextField
              name="pxSize"
              label="Velkosť v pixeloch"
              type="number"
            />
          </div>
        </div>

        {formik.values.shape !== "ICON" && (
          <ColorPicker name="color" label="Farba infopointu" />
        )}

        {formik.values.shape === "ICON" && (
          <div className="flex flex-col">
            <ReactMdTextField
              name="iconName"
              label="Soubor vlastnej ikony"
              disabled
            />

            <Button
              flat
              label="Vybrat"
              onClick={() => {
                dispatch(
                  setDialog(DialogType.ScreenFileChoose, {
                    onChoose: (file) => {
                      formik.setFieldValue("iconName", file.name);
                      formik.setFieldValue("iconFile", file);
                    },
                    // TODO - maybe better typeMatch and accept
                    typeMatch: new RegExp(/^image\/.*$/),
                    accept: "image/*",
                    style: { zIndex: 10002 },
                  })
                );
              }}
            />
          </div>
        )}
      </div>
    </Form>
  );
};

export default InfopointForm;
