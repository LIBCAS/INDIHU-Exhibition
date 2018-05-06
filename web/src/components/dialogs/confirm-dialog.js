import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get, isFunction } from "lodash";
import Dialog from "./dialog-wrap";
import { useTranslation } from "react-i18next";

const ConfirmDialog = ({ handleSubmit, data }) => {
  const { t } = useTranslation("expo-editor", { keyPrefix: "confirmDialog" });

  return (
    <Dialog
      title={get(data, "title")}
      name="ConfirmDialog"
      handleSubmit={handleSubmit}
      submitLabel={t("submitLabel")}
    >
      {get(data, "content") ? data.content : <p>{get(data, "text")}</p>}
    </Dialog>
  );
};

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withRouter,
  withHandlers({
    onSubmit:
      ({ data, closeDialog }) =>
      async () => {
        if (data && data.closeBefore) {
          closeDialog();
        }

        if (isFunction(get(data, "onSubmit"))) {
          await data.onSubmit();
        }

        if (!data || !data.closeBefore) {
          closeDialog();
        }
      },
  }),
  reduxForm({
    form: "confirmDialog",
  })
)(ConfirmDialog);
