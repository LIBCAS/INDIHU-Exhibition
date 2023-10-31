import { useState } from "react";
import { Formik } from "formik";
import DialogWrap from "../dialog-wrap-noredux-typed";

import SequenceForm from "./SequenceForm";
import { sequenceSchema } from "./schema";
import { SequenceFormData } from "./models";

import { ZOOM_SCREEN_DEFAULT_STAY_IN_DETAIL_TIME } from "constants/screen";

// - -

interface SequenceDialogNewProps {
  closeThisDialog: () => void;
  onDialogSubmit: (formData: SequenceFormData) => void;
}

const SequenceDialogNew = ({
  closeThisDialog,
  onDialogSubmit,
}: SequenceDialogNewProps) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  return (
    <Formik<SequenceFormData>
      initialValues={{
        text: "",
        zoom: 2,
        time: 1,
        stayInDetailTime: ZOOM_SCREEN_DEFAULT_STAY_IN_DETAIL_TIME,
      }}
      onSubmit={(formData) => {
        onDialogSubmit(formData);
        setIsSubmitted(true);
        return;
      }}
      validationSchema={sequenceSchema}
    >
      {(formik) => (
        <DialogWrap
          closeThisDialog={closeThisDialog}
          title="Vytvořit"
          handleSubmit={() => {
            formik.submitForm();
          }}
          // onClose={}
          closeAfterSuccessfulSubmit
          isSubmitSuccessful={isSubmitted}
          closeOnEsc
        >
          <SequenceForm formik={formik} />
        </DialogWrap>
      )}
    </Formik>
  );
};

export default SequenceDialogNew;
