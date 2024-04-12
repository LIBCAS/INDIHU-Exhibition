import "./privacy-policy-content-section.scss";
import { useTranslation, Trans } from "react-i18next";

import ExternalLink from "i18n/ExternalLink";
import MailLink from "i18n/MailLink";

const PrivacyPolicyContentSection = () => {
  const { t } = useTranslation("privacy-policy");

  return (
    <section id="pp-content-section" className="pp-content-section py-[96px]">
      <div className="px-[30px] md:px-[46px] flex flex-col gap-12 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <div className="flex flex-col gap-2">
          <p>
            <Trans
              t={t}
              i18nKey="paragraph1"
              components={{
                mailLink: <MailLink className="pp-link" />,
              }}
            />
          </p>
          <p>
            <Trans
              t={t}
              i18nKey="paragraph2"
              components={{
                externalLink: <ExternalLink className="pp-link" />,
              }}
            />
          </p>
          <p>{t("paragraph3")}</p>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <h2>{t("whatPersonalDataSection.title")}</h2>
          <p>{t("whatPersonalDataSection.paragraph1")}</p>
          <p>{t("whatPersonalDataSection.paragraph2")}</p>
          <p>{t("whatPersonalDataSection.paragraph3")}</p>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <h2>{t("whoAccessPersonalDataSection.title")}</h2>
          <p>{t("whoAccessPersonalDataSection.paragraph1")}</p>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <h2>{t("howLongWorkWithPersonalDataSection.title")}</h2>
          <p>{t("howLongWorkWithPersonalDataSection.paragraph1")}</p>
          <p>{t("howLongWorkWithPersonalDataSection.paragraph2")}</p>
        </div>

        {/*  */}
        <div className="flex flex-col gap-2">
          <h2>{t("youShouldAlsoKnowSection.title")}</h2>
          <p>
            <Trans
              t={t}
              i18nKey="youShouldAlsoKnowSection.paragraph1"
              components={{
                mailLink: <MailLink className="pp-link" />,
              }}
            />
          </p>
          <p>
            <Trans
              t={t}
              i18nKey="youShouldAlsoKnowSection.paragraph2"
              components={{
                mailLink: <MailLink className="pp-link" />,
              }}
            />
          </p>
          <p>{t("youShouldAlsoKnowSection.paragraph3")}</p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyContentSection;
