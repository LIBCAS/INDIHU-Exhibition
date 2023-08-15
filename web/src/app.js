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

import AuthController from "./components/auth-controller";
import Dialogs, { WarningDialog } from "./components/dialogs";
import Authentication from "./containers/authentication";
import Verify from "./containers/verify";
import Expositions from "./containers/expositions/expositions";
import Expo from "./containers/expo-administration/expo";
import { ExpoViewer } from "./containers/expo-viewer/expo-viewer";
import Profile from "./containers/profile/profile";
import Users from "./containers/users/users";
import Admin from "./containers/admin/admin";

import { isAdmin, isIE, isIOS, isProduction } from "./utils";
import * as storage from "./utils/storage";
import { Suspense } from "react";
import { ViewLoading } from "containers/views/view-loading/view-loading";

// MUI Theme
import { ThemeProvider } from "@emotion/react";
import theme from "./mui-theme";

const VERSION = 12;

const AppComponent = ({ warning, closeWarning, ...props }) => (
  <Suspense fallback={<ViewLoading />}>
    <div className="app">
      <Provider store={props.store}>
        <ThemeProvider theme={theme}>
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
              <Route
                exact
                path="/"
                component={withProps({ isSignIn: true })(Authentication)}
              />
              <Route exact path="/register" component={Authentication} />
              <Route path="/verify/:secret" component={Verify} />
              <Route path="/exhibitions" component={Expositions} />
              <Route path="/expo/:id" component={Expo} />
              <Route path="/view/:name" component={ExpoViewer} />
              <Route path="/profile" component={Profile} />
              {props.admin && <Route path="/users" component={Users} />}
              {props.admin && (
                <Route path="/administration" component={Admin} />
              )}
            </AuthController>
          </Router>
        </ThemeProvider>
      </Provider>
      {!isProduction() && <div className="test-env">TEST</div>}
    </div>
  </Suspense>
);

export const App = compose(
  connect(({ user: { role } }) => ({ admin: isAdmin(role) })),
  withState("appReady", "setAppReady", false),
  withState("warning", "setWarning", null),
  withHandlers({
    closeWarning:
      ({ setWarning }) =>
      () =>
        setWarning(null),
  }),
  lifecycle({
    UNSAFE_componentWillMount() {
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
)(AppComponent);
