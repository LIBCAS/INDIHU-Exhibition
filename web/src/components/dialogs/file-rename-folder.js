import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";
import { renameFolder } from "../../actions/file-actions";
import { useTranslation, withTranslation } from "react-i18next";

const FileRenameFolder = ({ handleSubmit }) => {
  const { t } = useTranslation("expo", { keyPrefix: "fileRenameFolderDialog" });

  return (
    <Dialog
      title={t("title")}
      name="FileRenameFolder"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="file-rename-folder-textfield-name"
          label={t("newFolderNameField")}
          name="name"
          validate={[Validation.required]}
        />
      </form>
    </Dialog>
  );
};

export default compose(
  connect(
    ({ dialog: { data } }) => ({ data, initialValues: { ...data } }),
    null
  ),
  withTranslation("expo", { keyPrefix: "fileRenameFolderDialog" }),
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      if (await dispatch(renameFolder(formData.name, props.data.name))) {
        dialog.closeDialog();
      } else
        throw new SubmissionError({
          name: props.t("folderWithThisNameAlreadyExists"),
        });
    },
  }),
  reduxForm({
    form: "fileRenameFolder",
    enableReinitialize: true,
  })
)(FileRenameFolder);
