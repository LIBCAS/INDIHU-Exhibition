import { useTranslation } from "react-i18next";

import LoginForm from "containers/new-landing-page/registration-section/LoginForm";
import DialogWrap from "../dialog-wrap-noredux-typed";

import { OAuthConfigObj } from "containers/new-landing-page/LandingPage";

// - -

type LoginDialogProps = {
  closeThisDialog: () => void;
  oauthConfigs: OAuthConfigObj[] | null;
};

const LoginDialog = ({ closeThisDialog, oauthConfigs }: LoginDialogProps) => {
  const { t } = useTranslation("new-landing-screen");

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={
        <span className="text-[28px] font-medium text-primary-blue font-inter">
          {t("registrationSection.loginForm.login")}
        </span>
      }
      big
      noDialogMenu
      closeOnEsc
      style={{
        maxWidth: "500px",
        borderRadius: "4px",
        padding: 0,
        position: "fixed",
        top: "32px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
      sectionStyle={{ padding: 0 }}
    >
      <LoginForm
        oauthConfigs={oauthConfigs}
        closeLoginDialog={closeThisDialog}
      />
    </DialogWrap>
  );
};

export default LoginDialog;
