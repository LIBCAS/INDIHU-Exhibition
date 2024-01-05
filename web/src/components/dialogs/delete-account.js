import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";

import Dialog from "./dialog-wrap";

import { deleteAccount, signOut } from "../../actions/user-actions";
import { useTranslation } from "react-i18next";

const DeleteAccount = ({ handleSubmit, fail }) => {
  const { t } = useTranslation("profile", {
    keyPrefix: "deactivateAccountDialog",
  });

  return (
    <Dialog
      title={t("title")}
      name="DeleteAccount"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      <p>{t("reallyWantToDeactivateAccount")}</p>
      <p>
        <strong>{t("deactivateConsequences")}</strong>
      </p>
      {fail && <span className="invalid">{t("failedToDeactivate")}</span>}
    </Dialog>
  );
};

export default compose(
  connect(
    ({ dialog: { data } }) => ({
      data,
    }),
    { deleteAccount, signOut }
  ),
  withState("fail", "setFail", false),
  withHandlers({
    onSubmit: (dialog) => async (formData, dispatch, props) => {
      const { setFail, signOut, history } = props;

      if (await dispatch(deleteAccount())) {
        dialog.closeDialog();
        signOut();
        history.replace("/");
      } else {
        setFail(true);
      }
    },
  }),
  reduxForm({
    form: "deleteAccountForm",
  })
)(DeleteAccount);
