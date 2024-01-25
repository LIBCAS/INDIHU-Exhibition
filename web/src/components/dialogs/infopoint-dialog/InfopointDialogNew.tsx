import { useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

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
  onDialogSubmit: (formData: InfopointFormDataProcessed) => void;
}

const InfopointDialogNew = ({
  closeThisDialog,
  onDialogSubmit,
}: InfopointDialogNewProps) => {
  const { t } = useTranslation("expo-editor", { keyPrefix: "infopointsForm" });

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
        isScreenIdIncluded: false,
        screenIdReference: "",
        screenNameReference: "",
        shape: expoDesignData?.defaultInfopointShape ?? "SQUARE",
        pxSize: expoDesignData?.defaultInfopointPxSize ?? 24,
        color: expoDesignData?.defaultInfopointColor ?? "#d2a473",
        iconName: expoDesignData?.defaultInfopointIconFile?.name ?? "",
        iconFile: expoDesignData?.defaultInfopointIconFile ?? null,
      }}
      onSubmit={(formData) => {
        const formDataProcessed = createFormDataProcessed(formData);
        onDialogSubmit(formDataProcessed);
        setIsSubmitted(true);
        return;
      }}
      validationSchema={infopointSchema}
    >
      {(formik) => (
        <DialogWrap
          closeThisDialog={closeThisDialog}
          title={t("addInfopointTitle")}
          handleSubmit={() => {
            formik.submitForm();
          }}
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
