import { useState } from "react";
import { Formik } from "formik";
import DialogWrap from "../dialog-wrap-noredux-typed";
import InfopointForm from "./InfopointForm";
import { infopointSchema } from "./schema";
import { InfopointFormData, InfopointFormDataProcessed } from "./models";
import { Infopoint } from "models";
import { createFormDataProcessed } from "./utils";

// - - - - - - - -

interface InfopointDialogEditProps {
  closeThisDialog: () => void;
  onDialogSubmit: (
    infopointIndexToEdit: number,
    formData: InfopointFormDataProcessed
  ) => Promise<void>;
  infopoint: Infopoint;
  infopointIndex: number;
}

const InfopointDialogEdit = ({
  closeThisDialog,
  onDialogSubmit,
  infopoint,
  infopointIndex,
}: InfopointDialogEditProps) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  return (
    <Formik<InfopointFormData>
      // Dont forget for backwards compatibility
      initialValues={{
        header: infopoint.header ?? "",
        bodyContentType: infopoint.bodyContentType ?? "TEXT",
        text: infopoint.text ?? "",
        imageName: infopoint.imageFile?.name ?? "",
        imageFile: infopoint.imageFile ?? null,
        videoName: infopoint.videoFile?.name ?? "",
        videoFile: infopoint.videoFile ?? null,
        alwaysVisible: infopoint.alwaysVisible ?? false,
        isUrlIncluded: infopoint.isUrlIncluded ?? false,
        url: infopoint.url ?? "",
        urlName: infopoint.urlName ?? "",
        shape: infopoint.shape ?? "SQUARE",
        pxSize: infopoint.pxSize ?? 24,
        color: infopoint.color ?? "#d2a473",
        iconName: infopoint.iconFile?.name ?? "",
        iconFile: infopoint.iconFile ?? null,
      }}
      onSubmit={async (formData) => {
        const formDataProcessed = createFormDataProcessed(formData);
        await onDialogSubmit(infopointIndex, formDataProcessed);
        setIsSubmitted(true);
        return;
      }}
      validationSchema={infopointSchema}
    >
      {(formik) => (
        <DialogWrap
          closeThisDialog={closeThisDialog}
          title="Upravit"
          handleSubmit={async () => {
            await formik.submitForm();
          }}
          //onClose={() => console.log("here onClose() closing edit dialog!")}
          closeAfterSuccessfulSubmit
          isSubmitSuccessful={isSubmitted}
          closeOnEsc
        >
          <InfopointForm formik={formik} />
        </DialogWrap>
      )}
    </Formik>
  );
};

export default InfopointDialogEdit;
