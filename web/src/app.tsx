import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Contexts
import { BrowserRouter, Route } from "react-router-dom";

// Contexts relative
import DialogsRef from "context/dialog-ref-provider/DialogsRef";

// Components
import AuthController from "components/AuthController";
import Loader from "components/loaders/Loader";

import Dialogs from "components/dialogs";
import WarningDialog from "components/dialogs/warning-dialog";

// Pages
import Authentication from "containers/authentication";
import Verify from "containers/verify";
import Expositions from "containers/expositions/Expositions";
import Expo from "containers/expo-administration/Expo";
import { ExpoViewer } from "containers/expo-viewer/expo-viewer";
import Profile from "containers/profile/profile";
import Users from "containers/users/users";
import Admin from "containers/admin/admin";

// Models
import { AppState } from "store/store";

// Utils
import { isAdmin, isIE, isProduction } from "utils";
import * as storage from "./utils/storage";

// - -

const stateSelector = createSelector(
  ({ user }: AppState) => user.role,
  (role) => ({ role })
);

// - -

const VERSION = 12;

export const App = () => {
  const { role } = useSelector(stateSelector);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAppReady, setIsAppReady] = useState<boolean>(false);
  const [warning, setWarning] = useState<string | null>(null);

  const closeWarning = () => setWarning(null);
  const admin = isAdmin(role);

  useEffect(() => {
    const version = Number(storage.get("version"));
    if (version !== VERSION) {
      storage.set("version", VERSION.toString());
      window.location.reload();
      return;
    }

    setIsAppReady(true);

    if (isIE()) {
      setWarning(
        "Používáte nepodporovaný prohlížeč, doporučujeme používat Google Chrome!"
      );
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <AuthController>
          <Helmet>
            <title>INDIHU Exhibition</title>
            <meta
              name="description"
              content="Vývoj nástrojů a infrastruktury pro digital humanities"
            />
          </Helmet>

          <Loader />
          <DialogsRef />
          <Dialogs />
          <WarningDialog content={warning} onClose={closeWarning} />

          <Route
            exact
            path="/"
            component={() => <Authentication isSignIn={true} />}
          />
          <Route exact path="/register" component={Authentication} />
          <Route path="/verify/:secret" component={Verify} />
          <Route path="/exhibitions" component={Expositions} />
          <Route path="/expo/:id" component={Expo} />
          <Route path="/view/:name" component={ExpoViewer} />
          <Route path="/profile" component={Profile} />
          {admin && <Route path="/users" component={Users} />}
          {admin && <Route path="/administration" component={Admin} />}
        </AuthController>

        {!isProduction() && <div className="test-env">TEST</div>}
      </div>
    </BrowserRouter>
  );
};
