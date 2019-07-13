import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";

import { setDialog } from "../actions/dialogActions";
import { verify } from "../actions/userActions";
import { showLoader } from "../actions/appActions";

export default compose(
  withRouter,
  connect(
    null,
    { verify, setDialog, showLoader }
  ),
  lifecycle({
    async componentDidMount() {
      const { history, match, verify, setDialog, showLoader } = this.props;
      showLoader(true);
      const status = await verify(match.params.secret);
      if (status === 202) {
        history.push("/exhibitions");
        setDialog("Info", {
          title: "Registrace úspěšná",
          text: "Byl jste úspěšně registrován."
        });
      } else if (status === 201) {
        history.push("/");
        setDialog("Info", {
          title: "Registrace ve frontě",
          text: "Registrace čeká ve frontě na schválení od admina do 3 dnů."
        });
      } else {
        history.push("/");
        setDialog("Info", {
          title: "Registrace neúspěšná",
          text: "Prosím zkuste kontaktovat administrátora."
        });
      }

      showLoader(false);
    }
  })
)(() => <div />);
