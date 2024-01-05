import { Form, FormikProps } from "formik";
import { SequenceFormData } from "./models";

// Components
import {
  ReactMdTextField,
  ReactMdSelectField,
} from "components/form/formik/react-md";
import { useTranslation } from "react-i18next";

// - -

interface SequenceFormProps {
  formik: FormikProps<SequenceFormData>;
}

const SequenceForm = (_props: SequenceFormProps) => {
  const { t } = useTranslation("expo-editor", { keyPrefix: "sequenceForm" });

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
      </div>
    </Form>
  );
};

export default SequenceForm;
