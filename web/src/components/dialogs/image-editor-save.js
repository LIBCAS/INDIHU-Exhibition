import { connect } from "react-redux";
import { get } from "lodash";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field } from "redux-form";
import { Card, Button } from "react-md";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";
import { postExpoFile, addFile } from "../../actions/file-actions";
import { blobToFile } from "../../utils";
import { withKeyShortcuts } from "../hoc";
import { useTranslation } from "react-i18next";

const BUTTON_ID = "dialog-submit-button-ImageEditorSave;";

const getSuffix = (blob) =>
  `.${get(get(blob, "type", "/png").match(/\/([^/]+)$/), "[1]")}`;

const ImageEditorSave = ({ handleSubmit, data, closeDialog }) => {
  const { t } = useTranslation("expo", { keyPrefix: "imageEditorSaveDialog" });

  return (
    <Dialog
      title={t("title")}
      name="ImageEditorSave"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
      noDialogMenu={true}
      className="image-editor-save-dialog"
    >
      <div className="image-editor-save-dialog-content">
        <Card className="image-view">
          <img src={get(data, "dataUrl")} alt="Náhled obrázku" />
        </Card>
        <div className="field-view">
          <div className="flex flex-bottom">
            <Field
              component={TextField}
              componentId="imageEditorSave-textfield-name"
              label={t("fileNameField")}
              name="name"
              validate={[Validation.required]}
            />
            <div style={{ marginBottom: 12, marginLeft: 5 }}>
              {getSuffix(get(data, "blob"))}
            </div>
          </div>
          <div className="flex flex-centered">
            <Button
              flat
              secondary
              label={t("stornoActionLabel")}
              onClick={closeDialog}
              className="margin-right-small"
            />
            <Button
              id={BUTTON_ID}
              raised
              primary
              label={t("confirmActionLabel")}
              onClick={handleSubmit}
              className="margin-right-small"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default compose(
  connect(({ dialog: { data } }) => ({ data, initialValues: { ...data } }), {
    addFile,
  }),
  withHandlers({
    onSubmit: (dialog) => async (formData, _, props) => {
      if (props.data.onSubmitStart) {
        props.data.onSubmitStart();
      }

      dialog.closeDialog();

      const file = blobToFile(
        get(props, "data.blob"),
        `${formData.name}${getSuffix(get(props, "data.blob"))}`
      );
      const response = await postExpoFile(get(props, "data.expoId"), file);

      if (response) {
        const ok = await dialog.addFile(response, get(props, "data.folder"));

        if (ok) {
          props.data.onSave(response.name);
          return;
        }
      }

      if (props.data.onError) {
        props.data.onError();
      }
    },
  }),
  withProps({
    onEnterButtonId: BUTTON_ID,
  }),
  withKeyShortcuts,
  reduxForm({
    form: "ImageEditorSave",
    enableReinitialize: true,
  })
)(ImageEditorSave);
