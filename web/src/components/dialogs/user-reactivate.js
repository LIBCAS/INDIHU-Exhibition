import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { get } from "lodash";
import { compose, withHandlers } from "recompose";
import Dialog from "./dialog-wrap";
import { reactivateUser, getUsers } from "../../actions/admin-actions";

const UserReactivate = ({ handleSubmit, data }) => (
  <Dialog
    title="Reaktivace uživatele"
    name="UserReactivate"
    submitLabel="Aktivovat"
    handleSubmit={handleSubmit}
  >
    <p>
      Uživatel <strong>{get(data, "name", "")}</strong> bude aktivován.
    </p>
  </Dialog>
);

export default compose(
  connect(
    ({
      dialog: { data },
      user: {
        users: { all },
      },
    }) => ({ data, users: all }),
    {
      getUsers,
    }
  ),
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      const { getUsers, users } = props;

      if (await dispatch(reactivateUser(props.data.id))) {
        getUsers(
          users.page,
          users.pageSize,
          users.filter,
          users.sort,
          users.search,
          users.table
        );
        dialog.closeDialog();
      }
    },
  }),
  reduxForm({
    form: "userReactivate",
  })
)(UserReactivate);
