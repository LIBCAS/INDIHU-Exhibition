import "./footer.scss";
import { useTranslation } from "react-i18next";

import indihuLogo from "../../../assets/img/landing-page/footer/white/indihu-logo-white.png";
import nahranoOtevrenoLogo from "../../../assets/img/landing-page/footer/white/nahrano-otevreno-logo-white.png";
import knihovnaLogo from "../../../assets/img/landing-page/footer/white/knihovna-logo-white.png";

import { BsBoxArrowUpRight } from "react-icons/bs";
// import { BsFacebook } from "react-icons/bs";
import { BsGithub } from "react-icons/bs";

// list of countries here: https://github.com/madebybowtie/FlagKit/blob/master/Assets/Flags.md
import Flag from "react-flagkit";

import { palette } from "palette";
import cx from "classnames";

import { HashLink } from "react-router-hash-link";

// - -

type FooterProps = {
  useWhiteVariant?: boolean;
};

const Footer = ({ useWhiteVariant = false }: FooterProps) => {
  const { t, i18n } = useTranslation("new-landing-screen");

  return (
    <footer id="footer" className={cx({ "white-variant": useWhiteVariant })}>
      <div className="max-w-[540px] mx-auto px-[30px] pt-[96px] pb-[60px] md:max-w-[1140px]">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* 1. About application column */}
          <div className="flex flex-col gap-8">
            <h4>{t("footer.about.title")}</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="/about#creation-section">
                  {t("footer.about.creation")}
                </a>
              </li>
              <li>
                <a href="/about#projects-section">
                  {t("footer.about.projects")}
                </a>
              </li>
              {/* <li>
                <a href="/about#history-section">{t("footer.about.history")}</a>
              </li> */}
              <li>
                <a href="/about#creators-section">
                  {t("footer.about.creators")}
                </a>
              </li>
              {/* <li>
                <a href="#">{t("footer.about.devInformation")}</a>
              </li> */}
            </ul>
          </div>

          {/* 2. Indihu Exhbition column */}
          <div className="flex flex-col gap-8">
            <h4>{t("footer.indihu.title")}</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="/terms-of-use">{t("footer.indihu.termsOfUse")}</a>
              </li>
              <li>
                <a
                  href="https://libcas.github.io/indihu-manual/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1"
                >
                  <span className="pr-1">{t("footer.indihu.manual")}</span>
                  <BsBoxArrowUpRight color="white" />
                </a>
              </li>
              {/* <li>
                <a href="#">{t("footer.indihu.events")}</a>
              </li> */}
              <li>
                <HashLink to="/about#contact-email">
                  {t("footer.indihu.adminContact")}
                </HashLink>
              </li>
              {/* <li>
                <a
                  href="https://github.com/LIBCAS/INDIHU-Exhibition"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("footer.indihu.githubSourceCode")}
                </a>
              </li> */}
            </ul>
          </div>

          {/* 3. Language column */}
          <div className="flex flex-col gap-8">
            <h4>{t("footer.language.title")}</h4>
            <ul className="flex flex-col gap-3">
              <li
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => i18n.changeLanguage("cs")}
              >
                <Flag country="CZ" />
                <span>{t("footer.language.cs")}</span>
              </li>
              <li
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => i18n.changeLanguage("en")}
              >
                <Flag country="GB" />
                <span>{t("footer.language.en")}</span>
              </li>
            </ul>
          </div>

          {/* 4. Images and logos column */}
          <div className="flex flex-col gap-10">
            <div>
              <a href="https://indihu.cz/" target="_blank" rel="noreferrer">
                <img
                  width={170}
                  height={28}
                  src={indihuLogo}
                  alt="INDIHU"
                  title="INDIHU"
                />
              </a>
            </div>

            <div>
              <a
                href="https://loaded-open.eu/cs/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  width={170}
                  height={70}
                  src={nahranoOtevrenoLogo}
                  alt="Nahráno - Otevřeno"
                  title="Nahráno - Otevřeno"
                />
              </a>
            </div>

            <div>
              <a
                href="https://www.lib.cas.cz/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  width={170}
                  height={46}
                  src={knihovnaLogo}
                  alt="Knihovna Akademie věd ČR, v. v. i."
                  title="Knihovna Akademie věd ČR, v. v. i."
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cx("border-t-[1px] opacity-50", {
          "border-t-white": !useWhiteVariant,
          "border-t-primary-blue": useWhiteVariant,
        })}
      />

      {/* Bottom */}
      <div className="bottom-footer px-[30px] py-[26px] flex flex-col gap-5 md:w-full md:flex-row md:justify-between">
        <p className="flex gap-4">© INDIHU Exhibition - v2.0</p>

        <div className="flex gap-1">
          <a href="/privacy-policy" title="Zásady ochrany osobních údajů">
            {t("footer.privacyPolicy")}
          </a>

          {/* <span className="px-2 self-center">|</span> */}

          {/* <a href="#" title="Zásady použití cookies">
            {t("footer.cookiesPolicy")}
          </a> */}
        </div>

        <div className="flex gap-1">
          {/* <a href="#" title="Facebook" className="flex items-center gap-1">
            <BsFacebook
              color={
                useWhiteVariant ? palette["primary-blue"] : palette["white"]
              }
            />
            <span>Facebook</span>
          </a> */}

          {/* <span className="px-2 self-center">|</span> */}

          <a
            href="https://github.com/LIBCAS/INDIHU-Exhibition"
            target="_blank"
            rel="noreferrer"
            title="Github"
            className="flex items-center gap-1"
          >
            <BsGithub
              color={
                useWhiteVariant ? palette["primary-blue"] : palette["white"]
              }
            />
            <span>Github</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
