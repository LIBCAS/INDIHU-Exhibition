import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

// Contexts
import { Route, useHistory } from "react-router-dom";

// Contexts relative
import DialogsRef from "context/dialog-ref-provider/DialogsRef";

// Components
import AuthController from "components/AuthController";
import Loader from "components/loaders/Loader";

import Dialogs from "components/dialogs";
import WarningDialog from "components/dialogs/warning-dialog";

// Pages
import Verify from "containers/verify";
import Expositions from "containers/expositions/Expositions";
import Expo from "containers/expo-administration/Expo";
import { ExpoViewer } from "containers/expo-viewer/expo-viewer";
import Profile from "containers/profile/Profile";
import Users from "containers/users/Users";
import Admin from "containers/admin/admin";
import OAuthProviderPage from "containers/OAuthProviderPage";

import LandingPage from "containers/new-landing-page/LandingPage";
// import AboutPage from "containers/about-page/AboutPage";
import TermsOfUsePage from "containers/terms-of-use-page/TermsOfUsePage";
import PrivacyPolicyPage from "containers/privacy-policy-page/PrivacyPolicyPage";

import AboutTemporaryPage from "containers/about-temporary-page/AboutTemporaryPage";

// Models
import { AppDispatch, AppState } from "store/store";
import { OAuthConfigObj } from "containers/new-landing-page/LandingPage";

// Utils
import { isAdmin, isIE, isProduction } from "utils";
import * as storage from "./utils/storage";
import { setActiveScreenEdited } from "actions/expoActions";
import { fetcher } from "utils/fetcher";

// - -

const stateSelector = createSelector(
  ({ user }: AppState) => user.role,
  (role) => ({ role })
);

// - -

const VERSION = 12;

export const App = () => {
  const { role } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

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

  // - -

  const history = useHistory();

  useEffect(() => {
    // Listen for changes in the route
    const unlisten = history.listen((_location, _action) => {
      dispatch(setActiveScreenEdited(false));
    });
    return () => unlisten();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  // - -

  // Load oauth configs
  const [oauthConfigs, setOauthConfigs] = useState<OAuthConfigObj[] | null>(
    null
  );

  useEffect(() => {
    const fetchOAuthConfigs = async () => {
      const response = await fetcher("/api/oauth/configs");
      if (response.status !== 200) {
        return;
      }
      const configs = await response.json();
      setOauthConfigs(configs);
    };

    fetchOAuthConfigs();
  }, []);

  return (
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
          component={() => <LandingPage oauthConfigs={oauthConfigs} />}
        />

        {/* <Route
          path="/about"
          component={() => <AboutPage oauthConfigs={oauthConfigs} />}
        /> */}

        <Route
          path="/about"
          component={() => <AboutTemporaryPage oauthConfigs={oauthConfigs} />}
        />

        <Route
          path="/terms-of-use"
          component={() => <TermsOfUsePage oauthConfigs={oauthConfigs} />}
        />

        <Route
          path="/privacy-policy"
          component={() => <PrivacyPolicyPage oauthConfigs={oauthConfigs} />}
        />

        <Route path="/verify/:secret" component={Verify} />
        <Route path="/exhibitions" component={Expositions} />
        <Route path="/expo/:id" component={Expo} />
        <Route path="/view/:name" component={ExpoViewer} />
        <Route path="/profile" render={() => <Profile isAdmin={admin} />} />
        <Route path="/oauth/:providerName" component={OAuthProviderPage} />
        {admin && <Route path="/users" component={Users} />}
        {admin && <Route path="/administration" component={Admin} />}
      </AuthController>

      {!isProduction() && <div className="test-env">TEST</div>}
    </div>
  );
};
