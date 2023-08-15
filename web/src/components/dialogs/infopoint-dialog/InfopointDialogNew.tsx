import { useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { Formik } from "formik";
import DialogWrap from "../dialog-wrap-noredux-typed";
import InfopointForm from "./InfopointForm";

import { AppState } from "store/store";
import { infopointSchema } from "./schema";
import { InfopointFormData, InfopointFormDataProcessed } from "./models";
import { createFormDataProcessed } from "./utils";

// - - - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo?.activeExpo?.expositionDesignData,
  (expositionDesignData) => ({ expositionDesignData })
);

interface InfopointDialogNewProps {
  closeThisDialog: () => void;
  onDialogSubmit: (formData: InfopointFormDataProcessed) => Promise<void>;
}

const InfopointDialogNew = ({
  closeThisDialog,
  onDialogSubmit,
}: InfopointDialogNewProps) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { expositionDesignData: expoDesignData } = useSelector(stateSelector);

  return (
    <Formik<InfopointFormData>
      initialValues={{
        header: "",
        bodyContentType: "TEXT",
        text: "",
        imageName: "",
        imageFile: null,
        videoName: "",
        videoFile: null,
        alwaysVisible: false,
        isUrlIncluded: false,
        url: "",
        urlName: "",
        shape: expoDesignData?.defaultInfopointShape ?? "SQUARE",
        pxSize: expoDesignData?.defaultInfopointPxSize ?? 24,
        color: expoDesignData?.defaultInfopointColor ?? "#d2a473",
        iconName: expoDesignData?.defaultInfopointIconFile?.name ?? "",
        iconFile: expoDesignData?.defaultInfopointIconFile ?? null,
      }}
      onSubmit={async (formData) => {
        const formDataProcessed = createFormDataProcessed(formData);
        await onDialogSubmit(formDataProcessed);
        setIsSubmitted(true);
        return;
      }}
      validationSchema={infopointSchema}
    >
      {(formik) => (
        <DialogWrap
          closeThisDialog={closeThisDialog}
          title="Vytvořit"
          handleSubmit={async () => {
            await formik.submitForm();
          }}
          //onClose={() => console.log("here onClose() closing add dialog!")}
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

export default InfopointDialogNew;
