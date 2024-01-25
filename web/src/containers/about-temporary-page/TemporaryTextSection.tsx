import "./temporary-text-section.scss";

import { useTranslation, Trans } from "react-i18next";

import ExternalLink from "i18n/ExternalLink";
import MailLink from "i18n/MailLink";

// - -

const TemporaryTextSection = () => {
  const { t } = useTranslation("about-page");

  return (
    <section
      id="temporary-text-section"
      className="temporary-text-section py-[96px]"
    >
      <div className="px-[30px] md:px-[46px] flex flex-col gap-12 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <div className="flex flex-col gap-2">
          <p>{t("paragraph1")}</p>
          <p>
            <Trans
              t={t}
              i18nKey={"paragraph2"}
              components={{
                externalLink: <ExternalLink className="temp-about-link" />,
              }}
            />
          </p>
          <p>
            <Trans
              t={t}
              i18nKey={"paragraph3"}
              components={{
                externalLink: <ExternalLink className="temp-about-link" />,
              }}
            />
          </p>
          <p id="contact-email">
            <Trans
              t={t}
              i18nKey={"paragraph4"}
              components={{
                mailLink: <MailLink className="temp-about-link" />,
              }}
            />
          </p>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <h2 className="title">{t("creationSubtitle")}</h2>
          <p>
            <Trans
              t={t}
              i18nKey={"creationParagraph"}
              components={{
                externalLink: <ExternalLink className="temp-about-link" />,
              }}
            />
          </p>
        </div>
      </div>
    </section>
  );
};

export default TemporaryTextSection;
