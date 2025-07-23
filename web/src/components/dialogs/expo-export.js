import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import Dialog from "./dialog-wrap";
import { useTranslation } from "react-i18next";

const ExpoExport = ({ handleSubmit }) => {
  const { t } = useTranslation("expo");

  return (
    <Dialog
      title={t("expoExportDialog.title")}
      name="ExpoExport"
      handleSubmit={handleSubmit}
      submitLabel={t("expoExportDialog.submitLabel")}
    >
      <form onSubmit={handleSubmit}>
        <p>{t("expoExportDialog.content")}</p>
      </form>
    </Dialog>
  );
};

export default compose(
  withRouter,
  withHandlers({
    onSubmit: (dialog) => async () => {
      dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "expoExport",
  })
)(ExpoExport);
