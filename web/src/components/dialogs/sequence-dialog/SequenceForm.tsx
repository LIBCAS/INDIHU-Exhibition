import { Form, FormikProps } from "formik";
import { SequenceFormData } from "./models";

// Components
import {
  ReactMdTextField,
  ReactMdSelectField,
} from "components/form/formik/react-md";

// - -

interface SequenceFormProps {
  formik: FormikProps<SequenceFormData>;
}

const SequenceForm = (_props: SequenceFormProps) => {
  return (
    <Form>
      <div className="flex flex-col gap-4">
        <div>
          <ReactMdTextField
            name="text"
            label="Popis sekvencie"
            multiLine
            maxLength={150}
            helpText='"Vložte popis zoomu"'
          />
        </div>

        <div className="flex gap-2">
          <div className="w-1/2">
            <ReactMdSelectField
              name="zoom"
              label="Priblížení"
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
              label="Doba priblížení"
            />
          </div>
        </div>

        <div className="w-1/2">
          <ReactMdTextField
            name="stayInDetailTime"
            type="number"
            label="Doba setrvání na detailu"
            parseAsFloat
          />
        </div>
      </div>
    </Form>
  );
};

export default SequenceForm;
