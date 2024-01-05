import "./intro-section.scss";
import { useTranslation } from "react-i18next";

import { Link as ScrollLink } from "react-scroll";

import heroVideoPreview from "../../../assets/video/hero_video_preview.mp4";
import { BsChevronDoubleDown } from "react-icons/bs";

// - -

const IntroSection = () => {
  const { t } = useTranslation("new-landing-screen");

  return (
    <section id="intro-section" className="intro-section">
      <div className="video-background-overlay" />
      <video playsInline autoPlay muted loop>
        <source src={heroVideoPreview} type="video/mp4" />
      </video>

      {/*  */}
      <div className="description px-[30px] md:pl-[54px] flex flex-col justify-center items-start gap-3 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <div className="flex flex-col justify-center items-start gap-3 xl:max-w-[66.66%]">
          <h1>{t("introSection.title")}</h1>
          <p>{t("introSection.subtitle")}</p>
          <ScrollLink to="registration-section" smooth duration={800}>
            {t("introSection.startCreatingLabel")}
          </ScrollLink>
        </div>
      </div>

      <div className="scroll-down-container">
        <ScrollLink
          to="functionality-section"
          smooth
          duration={800}
          className="scroll-down-link flex items-center gap-2"
        >
          <span className="hover:underline">
            {t("introSection.scrollDown")}
          </span>
          <BsChevronDoubleDown size={16} color="white" />
        </ScrollLink>
      </div>
    </section>
  );
};

export default IntroSection;
