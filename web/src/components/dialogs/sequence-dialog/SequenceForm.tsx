import { useMemo } from "react";
import { Form, FormikProps } from "formik";
import { useTranslation } from "react-i18next";

// Hooks
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

// Components
import {
  ReactMdTextField,
  ReactMdSelectField,
} from "components/form/formik/react-md";
import ColorPicker from "components/form/formik/ColorPicker";

// Types
import { SequenceFormData } from "./models";

// - - - - - -

interface SequenceFormProps {
  formik: FormikProps<SequenceFormData>;
}

const SequenceForm = (_props: SequenceFormProps) => {
  const { t } = useTranslation("expo-editor", { keyPrefix: "sequenceForm" });

  const { isLightMode, palette } = useExpoDesignData();

  const backupTextColor = useMemo(
    () => (isLightMode ? palette["light-mode-f"] : palette["dark-mode-f"]),
    [isLightMode, palette]
  );

  const backupBgColor = useMemo(
    () => (isLightMode ? palette["light-mode-b"] : palette["dark-mode-b"]),
    [isLightMode, palette]
  );

  return (
    <Form>
      <div className="flex flex-col gap-4">
        <div>
          <ReactMdTextField
            name="text"
            label={t("sequenceDescriptionLabel")}
            multiLine
            maxLength={150}
            helpText={t("sequenceDescriptionHelpText")}
          />
        </div>

        <div className="flex gap-2">
          <div className="w-1/2">
            <ReactMdSelectField
              name="zoom"
              label={t("sequenceZoomLabel")}
              controls={[
                { label: "2x", value: 2 },
                { label: "3x", value: 3 },
                { label: "4x", value: 4 },
              ]}
              fullWidth
            />
          </div>
          <div className="w-1/2">
            <ReactMdTextField
              name="time"
              type="number"
              parseAsFloat
              label={t("sequenceZoomTimeLabel")}
            />
          </div>
        </div>

        <div className="w-1/2">
          <ReactMdTextField
            name="stayInDetailTime"
            type="number"
            label={t("sequenceStayOnDetailTimeLabel")}
            parseAsFloat
          />
        </div>

        <ColorPicker
          name="textColor"
          label="TODO - Farba textu"
          backupColor={backupTextColor}
        />

        <ColorPicker
          name="bgColor"
          label="TODO - Farba pozadia"
          backupColor={backupBgColor}
        />
      </div>
    </Form>
  );
};

export default SequenceForm;
