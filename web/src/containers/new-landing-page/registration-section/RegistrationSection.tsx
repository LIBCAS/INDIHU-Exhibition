import "./registration-section.scss";
import { useTranslation } from "react-i18next";

import RegistrationForm from "./RegistrationForm";
import { OAuthConfigObj } from "../LandingPage";

// - -

type RegistrationSectionProps = {
  oauthConfigs: OAuthConfigObj[] | null;
};

const RegistrationSection = ({ oauthConfigs }: RegistrationSectionProps) => {
  const { t } = useTranslation("new-landing-screen");

  return (
    <section
      id="registration-section"
      className="registration-section py-[96px]"
    >
      <div className="px-[30px] flex flex-col gap-1 max-w-[540px] mx-auto md:pl-[54px] md:pr-[16px] md:flex-row md:max-w-[1140px] md:gap-8 xl:gap-20">
        <div className="flex flex-col gap-16 md:w-[45%]">
          <h2>{t("registrationSection.title")}</h2>
          <p>{t("registrationSection.subtitle")}</p>

          <div className="font-bold text-[16px]">
            {t("registrationSection.toolIsFree")}
          </div>
        </div>

        <div className="md:flex-1">
          <RegistrationForm isInDialog={false} oauthConfigs={oauthConfigs} />
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
