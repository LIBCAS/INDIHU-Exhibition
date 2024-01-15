import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field } from "redux-form";

import Dialog from "./dialog-wrap";
import TextField from "../form/redux-form/text-field";
import * as Validation from "../form/redux-form/validation";
import { renameFile, tabFile } from "../../actions/file-actions";
import { useTranslation } from "react-i18next";

const FileRename = ({ handleSubmit }) => {
  const { t } = useTranslation("expo", { keyPrefix: "fileRenameDialog" });

  return (
    <Dialog
      title={t("title")}
      name="FileRename"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          componentId="filerename-textfield-name"
          label={t("newNameField")}
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
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      dispatch(renameFile(props.data.id, formData.name));
      dispatch(tabFile(null));
      dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "fileRename",
    enableReinitialize: true,
  })
)(FileRename);
