import { useTranslation } from "react-i18next";
import "./privacy-policy-intro-section.scss";

const PrivacyPolicyIntroSection = () => {
  const { t } = useTranslation("privacy-policy");

  return (
    <section id="pp-intro-section" className="pp-intro-section">
      <div className="background-overlay" />

      <div className="page-title px-[30px] md:pl-[54px] flex justify-center items-center max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <h1>{t("title")}</h1>
      </div>
    </section>
  );
};

export default PrivacyPolicyIntroSection;
