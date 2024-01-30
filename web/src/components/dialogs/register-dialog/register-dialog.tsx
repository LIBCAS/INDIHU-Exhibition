import DialogWrap from "../dialog-wrap-noredux-typed";
import RegistrationForm from "containers/new-landing-page/registration-section/RegistrationForm";

import { OAuthConfigObj } from "containers/new-landing-page/LandingPage";
import { useTranslation } from "react-i18next";

// - -

type RegisterDialogProps = {
  closeThisDialog: () => void;
  oauthConfigs: OAuthConfigObj[] | null;
};

const RegisterDialog = ({
  closeThisDialog,
  oauthConfigs,
}: RegisterDialogProps) => {
  const { t } = useTranslation("new-landing-screen");

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={
        <span className="text-[28px] font-medium text-primary-blue font-inter">
          {t("registrationSection.registerForm.formTitle")}
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
      <RegistrationForm isInDialog={true} oauthConfigs={oauthConfigs} />
    </DialogWrap>
  );
};

export default RegisterDialog;
