import "./tou-content-section.scss";

import { useTranslation, Trans } from "react-i18next";

import ExternalLink from "i18n/ExternalLink";
import MailLink from "i18n/MailLink";

const TouContentSection = () => {
  const { t } = useTranslation("terms-of-use");

  return (
    <section id="tou-content-section" className="tou-content-section py-[96px]">
      <div className="px-[30px] md:px-[46px] flex flex-col gap-12 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <div className="flex flex-col gap-2">
          <h2 className="title">{t("informationSection.title")}</h2>
          <p>{t("informationSection.paragraph1")}</p>
          <p>
            <Trans
              t={t}
              i18nKey="informationSection.paragraph2"
              components={{
                externalLink: <ExternalLink className="tou-link" />,
              }}
            />
          </p>
          <p>
            <Trans
              t={t}
              i18nKey="informationSection.paragraph3"
              components={{
                externalLink: <ExternalLink className="tou-link" />,
              }}
            />
          </p>
          <p>
            <Trans
              t={t}
              i18nKey="informationSection.paragraph4"
              components={{
                externalLink: <ExternalLink className="tou-link" />,
              }}
            />
          </p>
          <p>
            <Trans
              t={t}
              i18nKey="informationSection.paragraph5"
              components={{
                mailLink: <MailLink className="tou-link" />,
              }}
            />
          </p>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <h2>{t("termsOfUseSection.title")}</h2>
          <p>
            <Trans
              t={t}
              i18nKey="termsOfUseSection.paragraph1"
              components={{
                mailLink: <MailLink className="tou-link" />,
              }}
            />
          </p>
          <p>{t("termsOfUseSection.paragraph2")}</p>
          <p>{t("termsOfUseSection.paragraph3")}</p>
          <p>
            <Trans
              t={t}
              i18nKey="termsOfUseSection.paragraph4"
              components={{
                externalLink: <ExternalLink className="tou-link" />,
              }}
            />
          </p>
          <p>{t("termsOfUseSection.paragraph5")}</p>
          <p>
            <Trans
              t={t}
              i18nKey="termsOfUseSection.paragraph6"
              components={{
                externalLink: <ExternalLink className="tou-link" />,
              }}
            />
          </p>
          <p>
            <Trans
              t={t}
              i18nKey="termsOfUseSection.paragraph7"
              components={{
                externalLink: <ExternalLink className="tou-link" />,
              }}
            />
          </p>
          <p>
            <Trans
              t={t}
              i18nKey="termsOfUseSection.paragraph8"
              components={{
                externalLink: <ExternalLink className="tou-link" />,
              }}
            />
          </p>
          <p>{t("termsOfUseSection.paragraph9")}</p>
          <p>{t("termsOfUseSection.paragraph10")}</p>
          <p>{t("termsOfUseSection.paragraph11")}</p>
          <p>{t("termsOfUseSection.paragraph12")}</p>
          <p>
            <Trans
              t={t}
              i18nKey="termsOfUseSection.paragraph13"
              components={{
                externalLink: <ExternalLink className="tou-link" />,
              }}
            />
          </p>
        </div>
      </div>
    </section>
  );
};

export default TouContentSection;
