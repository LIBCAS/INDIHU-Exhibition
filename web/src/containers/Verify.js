import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";

import { setDialog } from "../actions/dialog-actions";
import { verify } from "../actions/user-actions";
import { showLoader } from "../actions/app-actions";

export default compose(
  withRouter,
  connect(null, { verify, setDialog, showLoader }),
  lifecycle({
    async componentDidMount() {
      const { history, match, verify, setDialog, showLoader } = this.props;
      showLoader(true);
      const status = await verify(match.params.secret);
      if (status === 202) {
        history.push("/exhibitions");
        setDialog("Info", {
          title: "Registrace úspěšná",
          text: "Byl jste úspěšně registrován.",
        });
      } else if (status === 201 || status == 304) {
        history.push("/");
        setDialog("Info", {
          title: "Registrace ve frontě",
          text: "Registrace čeká ve frontě na schválení od admina do 3 dnů.",
        });
      } else if (status === 200) {
        history.push("/");
        setDialog("Info", {
          title: "Vaše registrace je již schválená",
          text: "Vaše registrace je již schválená, lze se přihlásit",
        });
      } else if (status == 409) {
        history.push("/");
        setDialog("Info", {
          title: "Vaše registrace byla zamítnuta",
          text: "Vaše registrace byla zamítnuta, zkuste kontaktovat administrátora",
        });
      } else {
        history.push("/");
        setDialog("Info", {
          title: "Registrace neúspěšná",
          text: "Prosím zkuste kontaktovat administrátora.",
        });
      }

      showLoader(false);
    },
  })
)(() => <div />);
