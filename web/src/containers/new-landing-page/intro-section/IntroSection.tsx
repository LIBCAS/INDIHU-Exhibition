import "./intro-section.scss";
import { useTranslation } from "react-i18next";

import { Link as ScrollLink } from "react-scroll";

import heroVideoPreview from "../../../assets/video/hero_video_preview.mp4";
import { BsChevronDoubleDown } from "react-icons/bs";
import { useMediaDevice } from "context/media-device-provider/media-device-provider";

import cx from "classnames";
// - -

const IntroSection = () => {
  const { t } = useTranslation("new-landing-screen");

  const { isMobileLandscape } = useMediaDevice();

  return (
    <section id="intro-section" className="intro-section">
      <div className="video-background-overlay" />
      <video playsInline autoPlay muted loop>
        <source src={heroVideoPreview} type="video/mp4" />
      </video>

      {/*  */}
      <div
        className={cx(
          "description px-[30px] md:pl-[54px] flex flex-col justify-center items-start gap-3 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]",
          {
            "!px-[0px] !justify-start !max-w-[575px]": isMobileLandscape,
          }
        )}
      >
        <div
          className={cx(
            "flex flex-col justify-center items-start gap-3 xl:max-w-[66.66%]",
            {
              "mt-[75px]": isMobileLandscape, // header height on mobile
            }
          )}
        >
          <h1>{t("introSection.title")}</h1>
          <p>{t("introSection.subtitle")}</p>
          <ScrollLink
            className={cx({ "mt-[4px] text-[15px]": isMobileLandscape })}
            to="registration-section"
            smooth
            duration={800}
          >
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
