import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";
import { FontIcon } from "react-md/lib";

import Dialog from "./dialog-wrap";
import { deleteExpo } from "../../actions/expoActions";

const ExpoDelete = ({ handleSubmit, data }) => (
  <Dialog
    title={<FontIcon className="color-black">delete</FontIcon>}
    name="ExpoDelete"
    handleSubmit={handleSubmit}
    submitLabel="Smazat"
  >
    <p>
      Vybraná výstava s názvem <strong>{get(data, "name")}</strong> bude
      smazána.
    </p>
    <div className="flex-row-nowrap flex-center">
      <FontIcon className="color-red">priority_high</FontIcon>
      <p>
        <strong style={{ fontSize: "0.9em" }}>
          Akce je nevratná a smaže výstavu včetne všech dokumentů a podkladů!
        </strong>
      </p>
    </div>
  </Dialog>
);

export default compose(
  connect(({ dialog: { data } }) => ({ data }), null),
  withRouter,
  withHandlers({
    onSubmit: (dialog) => async (_, dispatch, props) => {
      if (await dispatch(deleteExpo(props.data.id))) {
        dialog.closeDialog();
      }
    },
  }),
  reduxForm({
    form: "expoDelete",
  })
)(ExpoDelete);
