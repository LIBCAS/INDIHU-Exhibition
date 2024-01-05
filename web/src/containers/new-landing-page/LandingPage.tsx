import "./landing-page.scss";

import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

// Components
import Header from "./header/Header";
import IntroSection from "./intro-section/IntroSection";
import FunctionalitySection from "./functionality-section/FunctionalitySection";
import SelectedExhibitionsSection from "./selected-exhibitions-section/SelectedExhibitionsSection";
import RegistrationSection from "./registration-section/RegistrationSection";
import Footer from "./footer/Footer";

import { Snackbar, Alert } from "@mui/material";

// Models
import { AppState, AppDispatch } from "store/store";

// Actions and utils
import { clearOAuthLoginResponseType } from "actions/app-actions";

// - -

export type OAuthProviderNames = "Facebook" | "Github" | "Google";

export type OAuthConfigObj = {
  providerName: OAuthProviderNames;
  loginPath: string;
  clientId: string;
  redirectUrl: string;
};

// - -

const stateSelector = createSelector(
  ({ app }: AppState) => app.oAuthLoginResponse,
  (oAuthLoginResponse) => ({ oAuthLoginResponse })
);

// - -

type LandingPageProps = {
  oauthConfigs: OAuthConfigObj[] | null;
};

const LandingPage = ({ oauthConfigs }: LandingPageProps) => {
  const { oAuthLoginResponse } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  // - -

  const isOAuthSnackbarOpen = useMemo(
    () => oAuthLoginResponse !== null,
    [oAuthLoginResponse]
  );

  const closeOAuthSnackbar = () => dispatch(clearOAuthLoginResponseType());

  // - -

  return (
    <div className="new-landing-page">
      <Header oauthConfigs={oauthConfigs} />
      <IntroSection />

      <FunctionalitySection />
      <SelectedExhibitionsSection />
      <RegistrationSection oauthConfigs={oauthConfigs} />
      <Footer />

      {/* OAUTH SNACKBAR ALERT */}
      <Snackbar
        open={isOAuthSnackbarOpen}
        autoHideDuration={6000}
        onClose={(_e, reason) => {
          if (reason === "clickaway") {
            return;
          }
          closeOAuthSnackbar();
        }}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Alert
          onClose={closeOAuthSnackbar}
          severity={
            oAuthLoginResponse?.oAuthResponseType === "waitingForAdminAccept"
              ? "info"
              : "error"
          }
          sx={{ fontSize: "13px" }}
        >
          {oAuthLoginResponse?.oAuthResponseType === "publicEmailError"
            ? `V nastavení profilu u poskytovatele (${oAuthLoginResponse.providerName}) je potřeba nastavit verejnú emailovou adresu.`
            : oAuthLoginResponse?.oAuthResponseType === "waitingForAdminAccept"
            ? "Registrace proběhla úspěšně, avšak čeká se na schválení od administrátora."
            : oAuthLoginResponse?.oAuthResponseType === "stillNotAcceptedError"
            ? "Už jste registrováni a stále neproběhlo potvrzení administrátorem."
            : "Při pokusu o přihlášení došlo k neočekávané chybě."}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LandingPage;
