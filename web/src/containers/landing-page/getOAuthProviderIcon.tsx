import { OAuthProviderNames } from "./Authentication";

// OAuth Icons
import githubIcon from "../../assets/img/oauth/github_icon.png";
import facebookIcon from "../../assets/img/oauth/facebook_icon.png";
import googleIcon from "../../assets/img/oauth/google_icon.png";

export const getOAuthProviderIcon = (providerName: OAuthProviderNames) => {
  if (providerName === "Facebook") {
    return facebookIcon;
  }
  if (providerName === "Github") {
    return githubIcon;
  }
  if (providerName === "Google") {
    return googleIcon;
  }

  return null;
};
