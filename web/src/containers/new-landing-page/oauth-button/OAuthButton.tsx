import "./oauth-button.scss";
import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { OAuthConfigObj } from "../LandingPage";

// Icons
import { BsFacebook } from "react-icons/bs";
import { BsGithub } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";

// - -

type OAuthButtonProps = {
  backgroundColor: CSSProperties["backgroundColor"];
  provider: "Facebook" | "Google" | "Github";
  oauthConfig: OAuthConfigObj | undefined;
};

const OAuthButton = ({
  backgroundColor,
  provider,
  oauthConfig,
}: OAuthButtonProps) => {
  const { t } = useTranslation("new-landing-screen");

  const ProviderIcon =
    provider === "Facebook" ? (
      <BsFacebook size={16} color="white" />
    ) : provider === "Google" ? (
      <BsGoogle size={16} color="white" />
    ) : provider === "Github" ? (
      <BsGithub size={16} color="white" />
    ) : null;

  const oauthPath = oauthConfig
    ? `${oauthConfig.loginPath}&redirect_uri=${oauthConfig.redirectUrl}&client_id=${oauthConfig.clientId}`
    : null;

  return (
    <a
      href={oauthPath ?? undefined}
      className="oauth-button flex items-center gap-1 cursor-pointer"
      style={{ backgroundColor: backgroundColor, color: "white" }}
    >
      {ProviderIcon}
      <span className="text-inherit">{t("oauth.login")}</span>
    </a>
  );
};

export default OAuthButton;
