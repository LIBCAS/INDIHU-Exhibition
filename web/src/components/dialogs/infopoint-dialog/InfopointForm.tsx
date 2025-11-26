import { Form, FormikProps } from "formik";
import { InfopointFormData } from "./models";

import { useTranslation } from "react-i18next";

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
import ScreenChooser from "containers/expo-administration/expo-editor/screen-signpost/ScreenChooser";

// Utils
import { retrieveInfopointFormTranslations } from "./translations";

// - - - - - - -

export type InfopointFormType = "classic" | "timeline";

type InfopointFormProps = {
  formik: FormikProps<InfopointFormData>;
  type?: InfopointFormType;
};

const InfopointForm = ({ formik, type = "classic" }: InfopointFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", { keyPrefix: "infopointsForm" });

  const isScreenIdReferenceError =
    !!formik.touched.screenIdReference && !!formik.errors.screenIdReference;

  // - - - Translations - - -

  const {
    headerLabel,
    bodyContentTypeLabel,
    textBodyLabel,
    additionalPropertiesSubheader,
    shapeLabel,
    colorLabel,
  } = retrieveInfopointFormTranslations(t, type);

  // - - - GUI - - -

  return (
    <Form>
      <div>
        <ReactMdTextField
          name="header"
          label={headerLabel}
          id="infopoint-header-textfield"
        />
      </div>

      <div>
        <ReactMdRadioGroup
          controls={[
            {
              label: t("bodyContentTextOption"),
              value: "TEXT",
            },
            {
              label: t("bodyContentImageOption"),
              value: "IMAGE",
            },
            {
              label: t("bodyContentVideoOption"),
              value: "VIDEO",
            },
          ]}
          name="bodyContentType"
          label={bodyContentTypeLabel}
          inline
          className="mt-6"
          labelClassName="mb-0 font-['Work_Sans'] text-[13px] text-black/[.54]"
        />
      </div>

      {formik.values.bodyContentType === "TEXT" && (
        <div>
          <ReactMdTextField
            name="text"
            label={textBodyLabel}
            multiLine
            maxLength={150}
          />
        </div>
      )}

      {formik.values.bodyContentType === "IMAGE" && (
        <div className="flex flex-col">
          <ReactMdTextField
            name="imageName"
            label={t("imageFileLabel")}
            disabled
          />

          <Button
            flat
            label={t("selectButtonLabel")}
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
          <ReactMdTextField
            name="videoName"
            label={t("videoFileLabel")}
            disabled
          />

          <Button
            flat
            label={t("selectButtonLabel")}
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
          {t("optionalOptionsSectionSubheader")}
        </div>

        <ReactMdCheckbox name="alwaysVisible" label={t("alwaysVisibleLabel")} />
        <ReactMdCheckbox name="isUrlIncluded" label={t("urlIncludeLabel")} />
        <ReactMdCheckbox
          name="isScreenIdIncluded"
          label={t("screenUrlIncludeLabel")}
        />

        {formik.values.isUrlIncluded && (
          <div>
            <ReactMdTextField name="url" label={t("urlAdressLabel")} />
            <ReactMdTextField name="urlName" label={t("urlNameLabel")} />
          </div>
        )}

        {formik.values.isScreenIdIncluded && (
          <div className="my-4">
            <div>
              <ScreenChooser
                label={t("screenUrlChooseLabel")}
                value={formik.values.screenIdReference}
                onChange={(newScreenId) =>
                  formik.setFieldValue("screenIdReference", newScreenId)
                }
                error={isScreenIdReferenceError}
                helperText={
                  isScreenIdReferenceError
                    ? formik.errors.screenIdReference
                    : undefined
                }
              />
            </div>
            <div className="mt-2">
              <ReactMdTextField
                name="screenNameReference"
                label={t("screenUrlNameLabel")}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="mt-8 mb-1 font-['Work_Sans'] text-[15px] text-black/[.83] underline">
          {additionalPropertiesSubheader}
        </div>

        <div className="w-full flex items-start gap-2">
          <div className="w-3/6">
            <ReactMdSelectField
              controls={[
                {
                  label: t("shapeSquareOption"),
                  value: "SQUARE",
                },
                {
                  label: t("shapeCircleOption"),
                  value: "CIRCLE",
                },
                {
                  label: t("shapeIconOption"),
                  value: "ICON",
                },
              ]}
              label={shapeLabel}
              name="shape"
              fullWidth
            />
          </div>

          <div className="w-3/6">
            <ReactMdTextField
              name="pxSize"
              label={t("sizeLabel")}
              type="number"
            />
          </div>
        </div>

        {formik.values.shape !== "ICON" && (
          <ColorPicker name="color" label={colorLabel} />
        )}

        {formik.values.shape === "ICON" && (
          <div className="flex flex-col">
            <ReactMdTextField
              name="iconName"
              label={t("iconFileLabel")}
              disabled
            />

            <Button
              flat
              label={t("selectButtonLabel")}
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
