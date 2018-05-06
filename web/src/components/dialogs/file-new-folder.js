import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";
import { addFolder } from "../../actions/file-actions";
import { useTranslation, withTranslation } from "react-i18next";

const FileNewFolder = ({ handleSubmit }) => {
  const { t } = useTranslation("expo", { keyPrefix: "fileNewFolderDialog" });

  return (
    <Dialog
      title={t("title")}
      name="FileNewFolder"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="expo-new-folder-textfield-name"
          name="name"
          label={t("folderNameField")}
          validate={[Validation.required]}
        />
      </form>
    </Dialog>
  );
};

export default compose(
  withTranslation("expo", { keyPrefix: "fileNewFolderDialog" }),
  withHandlers({
    onSubmit:
      (dialog) =>
      async (formData, dispatch, { t }) => {
        if (await dispatch(addFolder(formData.name))) dialog.closeDialog();
        else
          throw new SubmissionError({
            name: t("folderWithThisNameAlreadyExists"),
          });
      },
  }),
  reduxForm({
    form: "fileNewFolder",
  })
)(FileNewFolder);
