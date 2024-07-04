import "./functionality-section.scss";
import { useTranslation, Trans } from "react-i18next";

import ExternalLink from "i18n/ExternalLink";

import f1Icon from "../../../assets/img/landing-page/functionality-section/png/blue/icon-f-1.png";
import f2Icon from "../../../assets/img/landing-page/functionality-section/png/blue/icon-f-2.png";
import f3Icon from "../../../assets/img/landing-page/functionality-section/png/blue/icon-f-3.png";
import f4Icon from "../../../assets/img/landing-page/functionality-section/png/blue/icon-f-4.png";
import f5Icon from "../../../assets/img/landing-page/functionality-section/png/blue/icon-f-5.png";
import f6Icon from "../../../assets/img/landing-page/functionality-section/png/blue/icon-f-6.png";

// - -

const FunctionalitySection = () => {
  const { t } = useTranslation("new-landing-screen");

  return (
    <section
      id="functionality-section"
      className="functionality-section py-[96px]"
    >
      <div className="px-[30px] md:px-[46px] flex flex-col gap-16 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <h2>{t("functionalitySection.title")}</h2>
        <p>{t("functionalitySection.subtitle")}</p>
        <div className="flex flex-wrap mx-[-16px]">
          <FunctionalityBlock
            iconSrc={f1Icon}
            label={t("functionalitySection.func1Text")}
          />
          <FunctionalityBlock
            iconSrc={f2Icon}
            label={t("functionalitySection.func2Text")}
          />
          <FunctionalityBlock
            iconSrc={f3Icon}
            label={t("functionalitySection.func3Text")}
          />
          <FunctionalityBlock
            iconSrc={f4Icon}
            label={
              <Trans
                t={t}
                i18nKey={"functionalitySection.func4Text"}
                components={{
                  externalLink: <ExternalLink className="external-link" />,
                }}
              />
            }
          />
          <FunctionalityBlock
            iconSrc={f5Icon}
            label={t("functionalitySection.func5Text")}
          />
          <FunctionalityBlock
            iconSrc={f6Icon}
            label={t("functionalitySection.func6Text")}
          />
        </div>
      </div>
    </section>
  );
};

export default FunctionalitySection;

// - -

type FunctionalityBlockProps = {
  iconSrc: any;
  label: string | JSX.Element;
};

const FunctionalityBlock = ({ iconSrc, label }: FunctionalityBlockProps) => {
  return (
    <div className="px-[16px] mb-[64px] max-w-[50%] flex flex-col basis-1/2 gap-4 md:max-w-[33%] md:basis-1/3 lg:pr-[116px]">
      <img width={100} height={100} src={iconSrc} />
      <p>{label}</p>
    </div>
  );
};
