import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";

import Dialog from "./dialog-wrap";
import { removeCollaborator } from "../../actions/expoActions";

const ExpoShareRemoveCollaborator = ({ handleSubmit, data }) => (
  <Dialog
    title="Odebrání spolupracovníka"
    name="ExpoShareRemoveCollaborator"
    submitLabel="Odebrat"
    handleSubmit={handleSubmit}
  >
    <p>
      Spolupracovník {data && data.name ? `${data.name} ` : ""}bude odebrán.
    </p>
  </Dialog>
);

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      if (await dispatch(removeCollaborator(props.data.id)))
        dialog.closeDialog();
    },
  }),
  reduxForm({
    form: "expoShareRemoveCollaborator",
  })
)(ExpoShareRemoveCollaborator);
