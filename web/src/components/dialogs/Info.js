import { connect } from "react-redux";
import { compose, withHandlers, lifecycle } from "recompose";
import { reduxForm } from "redux-form";
import { get } from "lodash";

import Dialog from "./dialog-wrap";

const Info = ({ handleSubmit, data }) => (
  <Dialog
    title={get(data, "title", "Info")}
    name="Info"
    handleSubmit={handleSubmit}
    submitLabel="Ok"
    noDialogMenu={get(data, "noDialogMenu")}
    noToolbar={get(data, "noToolbar")}
    big={get(data, "big")}
    large={get(data, "large")}
    noStornoButton={get(data, "noStornoButton")}
  >
    {get(data, "content") ? data.content : <p>{get(data, "text", "")}</p>}
  </Dialog>
);

export default compose(
  connect(
    ({ dialog: { data } }) => ({
      data,
    }),
    null
  ),
  withHandlers({
    onSubmit: (dialog) => async () => {
      dialog.closeDialog();
    },
  }),
  lifecycle({
    UNSAFE_componentWillReceiveProps(nextProps) {
      if (get(nextProps, "data.autoClose")) {
        setTimeout(() => {
          nextProps.onSubmit();
        }, get(nextProps, "data.autoCloseTime", 2000));
      }
    },
  }),
  reduxForm({
    form: "infoForm",
  })
)(Info);
