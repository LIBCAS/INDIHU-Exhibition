import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import Dialog from "./dialog-wrap";

const ExpoExport = ({ handleSubmit }) => (
  <Dialog
    title="Export výstavy"
    name="ExpoExport"
    handleSubmit={handleSubmit}
    submitLabel="Exportovat"
  >
    <form onSubmit={handleSubmit}>
      <p>Export výstavy</p>
    </form>
  </Dialog>
);

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
