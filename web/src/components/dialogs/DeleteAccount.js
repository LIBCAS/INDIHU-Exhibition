import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";

import Dialog from "./DialogWrap";

import { deleteAccount, signOut } from "../../actions/userActions";

const DeleteAccount = ({ handleSubmit, data, fail }) => (
  <Dialog
    title="Zrušit účet"
    name="DeleteAccount"
    handleSubmit={handleSubmit}
    submitLabel="Zrušit účet"
  >
    <p>Opravdu chcete zrušit účet?</p>
    <p>
      <strong>
        Zrušením účtu dojde k uzamknutí všech výstav, které vlastníte, a nebude
        možné s nimi dále pracovat!
      </strong>
    </p>
    {fail && <span className="invalid">Nepodařilo se odstranit účet!</span>}
  </Dialog>
);

export default compose(
  connect(
    ({ dialog: { data } }) => ({
      data
    }),
    { deleteAccount, signOut }
  ),
  withState("fail", "setFail", false),
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      const { setFail, signOut, history } = props;

      if (await dispatch(deleteAccount())) {
        dialog.closeDialog();
        signOut();
        history.replace("/");
      } else {
        setFail(true);
      }
    }
  }),
  reduxForm({
    form: "deleteAccountForm"
  })
)(DeleteAccount);
