import React from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { reduxForm } from "redux-form";
import { compose, withHandlers } from "recompose";
import { FontIcon } from "react-md/lib";

import Dialog from "./DialogWrap";
import { deleteUser, getUsers } from "../../actions/adminActions";

const UserDelete = ({ handleSubmit, dialogData, data }) => (
  <Dialog
    title={<FontIcon className="color-black">delete</FontIcon>}
    name="UserDelete"
    submitLabel="Odstranit"
    handleSubmit={handleSubmit}
  >
    <p>
      Uživatel <strong>{get(data, "name", "")}</strong> bude odstraněn.
    </p>
  </Dialog>
);

export default compose(
  connect(
    ({
      dialog: { data },
      user: {
        users: { all }
      }
    }) => ({ data, users: all }),
    {
      getUsers
    }
  ),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      const { getUsers, users } = props;

      if (await dispatch(deleteUser(props.data.id))) {
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
    }
  }),
  reduxForm({
    form: "userDelete"
  })
)(UserDelete);
