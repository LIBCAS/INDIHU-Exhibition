import React from "react";
import { connect } from "react-redux";
import {
  compose,
  withProps,
  lifecycle,
  withState,
  withHandlers,
} from "recompose";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";

import AuthController from "./components/AuthController";
import Dialogs, { WarningDialog } from "./components/dialogs";
import Authentication from "./containers/Authentication";
import Verify from "./containers/Verify";
import Expositions from "./containers/Expositions";
import Expo from "./containers/Expo";
import ScreenViewer from "./containers/ScreenViewer";
import ExpoViewer from "./containers/ExpoViewer";
import Profile from "./containers/Profile";
import Users from "./containers/Users";
import Admin from "./containers/Admin";

import { isAdmin, isIE, isIOS, isProduction } from "./utils";
import * as storage from "./utils/storage";

const VERSION = 11;

const App = ({ warning, closeWarning, ...props }) => (
  <div>
    <Provider store={props.store}>
      <Router>
        <AuthController>
          <Helmet>
            <title>INDIHU Exhibition</title>
            <meta
              name="description"
              content="Vývoj nástrojů a infrastruktury pro digital humanities"
            />
          </Helmet>
          <Dialogs />
          <WarningDialog content={warning} onClose={closeWarning} />
          <Route exact path="/" component={Authentication} />
          <Route
            exact
            path="/sign-in"
            component={withProps({ isSignIn: true })(Authentication)}
          />
          <Route path="/verify/:secret" component={Verify} />
          <Route path="/exhibitions" component={Expositions} />
          <Route path="/expo/:id" component={Expo} />
          <Route path="/screen/:id" component={ScreenViewer} />
          <Route path="/view/:name" component={ExpoViewer} />
          <Route path="/profile" component={Profile} />
          {props.admin && <Route path="/users" component={Users} />}
          {props.admin && <Route path="/administration" component={Admin} />}
        </AuthController>
      </Router>
    </Provider>
    {!isProduction() && <div className="test-env">TEST</div>}
  </div>
);

export default compose(
  connect(({ user: { role } }) => ({ admin: isAdmin(role) })),
  withState("appReady", "setAppReady", false),
  withState("warning", "setWarning", null),
  withHandlers({
    closeWarning: ({ setWarning }) => () => setWarning(null),
  }),
  lifecycle({
    componentWillMount() {
      const { setAppReady, setWarning } = this.props;

      const version = Number(storage.get("version"));

      if (version !== VERSION) {
        storage.set("version", VERSION);
        window.location.reload(true);
        return;
      }

      setAppReady(true);

      if (isIE()) {
        setWarning(
          "Používáte nepodporovaný prohlížeč, doporučujeme používat Google Chrome!"
        );
      } else if (isIOS()) {
        setWarning(
          "Zařízení iPhone, iPad a iPod v současnosti nejsou podporována. Aplikace, na těchto zařízeních, nemusí fungovat správně!"
        );
      }
    },
  })
)(App);
