import Carousel from "./carousel/Carousel";
import "./selected-exhibitions-section.scss";
import { useTranslation } from "react-i18next";

// - -

const SelectedExhibitionsSection = () => {
  const { t } = useTranslation("new-landing-screen");

  return (
    <section
      id="selected-exhibitions-section"
      className="selected-exhibitions-section py-[96px]"
    >
      <div className="px-[30px] md:px-[46px] flex flex-col gap-16 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <h2 className="section__title">
          {t("selectedExhibitionsSection.title")}
        </h2>
        <p className="section__description">
          {t("selectedExhibitionsSection.subtitle")}
        </p>
      </div>

      {/* Exhibitions react-slick carousel */}
      <div className="mt-16 px-[8px] flex justify-center items-center">
        <Carousel />
      </div>
    </section>
  );
};

export default SelectedExhibitionsSection;
