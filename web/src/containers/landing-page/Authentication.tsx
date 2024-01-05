import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useTranslation } from "react-i18next";

// Components
import AppHeader from "components/app-header/AppHeader";
import ComponentLoader from "components/loaders/component-loader";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Snackbar, Alert } from "@mui/material";

// Models
import { AppState, AppDispatch } from "store/store";

// Actions and utils
import { fetcher } from "utils/fetcher";
import { getHandleInfoBody } from "./getHandleInfoBody";
import { getHandleGDPRBody } from "./getHandleGDPRBody";

import { setDialog } from "actions/dialog-actions";
import { availableRegistration } from "actions/user-actions";
import { DialogType } from "components/dialogs/dialog-types";
import Footer from "containers/footer";
import { clearOAuthLoginResponseType } from "actions/app-actions";

// - -

const stateSelector = createSelector(
  ({ app }: AppState) => app.oAuthLoginResponse,
  (oAuthLoginResponse) => ({ oAuthLoginResponse })
);

// - -

export type OAuthProviderNames = "Facebook" | "Github" | "Google";

export type OAuthConfigObj = {
  providerName: OAuthProviderNames;
  loginPath: string;
  clientId: string;
  redirectUrl: string;
};

type AuthenticationProps = {
  isSignIn: boolean; // whether it is "/" sign or "/register" page
};

// - -

const Authentication = ({ isSignIn }: AuthenticationProps) => {
  const { oAuthLoginResponse } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("landing-screen");

  const [isRegAvailable, setIsRegAvailable] = useState<boolean | null>(null); // while null.. show loader
  const [oauthConfigs, setOauthConfigs] = useState<OAuthConfigObj[] | null>(
    null
  );

  const isRegLoader = useMemo(
    () => !isSignIn && isRegAvailable === null,
    [isRegAvailable, isSignIn]
  );

  // Handle OAuth error snackbar
  const isOAuthSnackbarOpen = useMemo(
    () => oAuthLoginResponse !== null,
    [oAuthLoginResponse]
  );

  const closeOAuthSnackbar = () => dispatch(clearOAuthLoginResponseType());

  // Handle register availability
  useEffect(() => {
    const handleRegisterAvailability = async () => {
      if (!isSignIn) {
        const regAvail = await dispatch(availableRegistration());
        setIsRegAvailable(regAvail);
      }
    };

    handleRegisterAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignIn]);

  // Handle fetch of available OAuth possibilities and their configs
  useEffect(() => {
    const handleOAuthConfigs = async () => {
      const response = await fetcher("/api/oauth/configs");
      if (response.status !== 200) {
        return;
      }
      const configs = await response.json();
      setOauthConfigs(configs);
    };

    handleOAuthConfigs();
  }, []);

  // - -

  const handleInfo = useCallback(() => {
    const infoBody = getHandleInfoBody();
    dispatch(
      setDialog(DialogType.InfoDialog, {
        ...infoBody,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGDPR = useCallback(() => {
    const gdprBody = getHandleGDPRBody();
    dispatch(
      setDialog(DialogType.InfoDialog, {
        ...gdprBody,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="authentication-container">
      <AppHeader
        authStyle
        isSignIn={!!isSignIn}
        handleInfo={handleInfo}
        handleGDPR={handleGDPR}
      />

      <div className="authentication">
        <div className="left">
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </div>

        <div className="right">
          {isRegLoader && (
            <div className="full-width flex-col flex-centered margin-top-small">
              <ComponentLoader />
              <h4 className="margin-top">
                {t("formular.loadingRegistrationFormular")}
              </h4>
            </div>
          )}

          {!isSignIn && isRegAvailable === false && (
            <h4 className="text-center margin-none">
              <strong>{t("formular.registrationNotAllowed")}</strong>
            </h4>
          )}

          {!isRegLoader && (isRegAvailable === true || isSignIn) ? (
            <div>
              <h3 style={{ marginTop: "1em" }}>
                <strong>
                  {isSignIn
                    ? t("formular.login")
                    : t("formular.startCreatingExhibitions")}
                </strong>
              </h3>
              {!isSignIn && <p>{t("formular.appIsFree")}</p>}
            </div>
          ) : (
            <div />
          )}

          {!isRegLoader && isSignIn && (
            <LoginForm oauthConfigs={oauthConfigs} />
          )}

          {!isRegLoader && !isSignIn && (
            <RegisterForm handleInfo={handleInfo} />
          )}
        </div>
      </div>

      <Footer />

      {/* OAUTH SNACKBAR ALERT */}
      <Snackbar
        open={isOAuthSnackbarOpen}
        //autoHideDuration={6000}
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

export default Authentication;
