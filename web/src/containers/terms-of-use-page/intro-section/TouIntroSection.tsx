import { useTranslation } from "react-i18next";
import "./tou-intro-section.scss";

const TouIntroSection = () => {
  const { t } = useTranslation("terms-of-use");

  return (
    <section id="tou-intro-section" className="tou-intro-section">
      <div className="background-overlay" />

      <div className="page-title px-[30px] md:pl-[54px] flex justify-center items-center max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <h1>{t("pageTitle")}</h1>
      </div>
    </section>
  );
};

export default TouIntroSection;
