import "./landing-page.scss";

import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation, Trans } from "react-i18next";

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
  const { t } = useTranslation("new-landing-screen");

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
          {oAuthLoginResponse?.oAuthResponseType === "publicEmailError" ? (
            <Trans
              t={t}
              i18nKey="loginResponseErrors.publicEmailError"
              values={{ providerName: oAuthLoginResponse.providerName }}
            />
          ) : oAuthLoginResponse?.oAuthResponseType ===
            "waitingForAdminAccept" ? (
            t("loginResponseErrors.waitingForAdminAcceptInfo")
          ) : oAuthLoginResponse?.oAuthResponseType ===
            "stillNotAcceptedError" ? (
            t("loginResponseErrors.stillNotAcceptedError")
          ) : (
            t("loginResponseErrors.otherUnknownError")
          )}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LandingPage;
