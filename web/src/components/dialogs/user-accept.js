import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";
import { get } from "lodash";

import Dialog from "./dialog-wrap";

import { acceptUser, getUsers } from "../../actions/admin-actions";

const UserAccept = ({ handleSubmit, data }) => (
  <Dialog
    title="Schválení uživatele"
    name="UserAccept"
    submitLabel="Schválit"
    handleSubmit={handleSubmit}
  >
    <p>
      Uživatel{" "}
      {get(data, "user.toAccept.username")
        ? `${get(data, "user.toAccept.username")} `
        : ""}
      bude schválen.
    </p>
  </Dialog>
);

export default compose(
  connect(({ dialog: { data } }) => ({ data }), { getUsers }),
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      const { data, getUsers } = props;

      if (await dispatch(acceptUser(data.user.id))) {
        getUsers(null, null, null, null, null, "FOR_ACCEPT");
        dialog.closeDialog();
      }
    },
  }),
  reduxForm({
    form: "userAccept",
  })
)(UserAccept);
