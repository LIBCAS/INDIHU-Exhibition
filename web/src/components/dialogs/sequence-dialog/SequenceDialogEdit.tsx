import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Formik } from "formik";
import DialogWrap from "../dialog-wrap-noredux-typed";

import SequenceForm from "./SequenceForm";
import { sequenceSchema } from "./schema";
import { SequenceFormData } from "./models";
import { Sequence } from "models";

import { ZOOM_SCREEN_DEFAULT_STAY_IN_DETAIL_TIME } from "constants/screen";

// - -

interface SequenceDialogEditProps {
  closeThisDialog: () => void;
  onDialogSubmit: (
    sequenceIndexToEdit: number,
    formData: SequenceFormData
  ) => void;
  sequence: Sequence;
  sequenceIndex: number;
}

const SequenceDialogEdit = ({
  closeThisDialog,
  onDialogSubmit,
  sequence,
  sequenceIndex,
}: SequenceDialogEditProps) => {
  const { t } = useTranslation("sequenceForm", { keyPrefix: "sequenceForm" });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  return (
    <Formik<SequenceFormData>
      initialValues={{
        text: sequence.text ?? "",
        zoom: sequence.zoom ?? 2,
        time: sequence.time ?? 1,
        stayInDetailTime:
          sequence.stayInDetailTime ?? ZOOM_SCREEN_DEFAULT_STAY_IN_DETAIL_TIME,
      }}
      onSubmit={(formData) => {
        onDialogSubmit(sequenceIndex, formData);
        setIsSubmitted(true);
        return;
      }}
      validationSchema={sequenceSchema}
    >
      {(formik) => (
        <DialogWrap
          closeThisDialog={closeThisDialog}
          title={t("editExistingSequenceTitle")}
          handleSubmit={() => {
            formik.submitForm();
          }}
          //onClose
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

export default SequenceDialogEdit;
