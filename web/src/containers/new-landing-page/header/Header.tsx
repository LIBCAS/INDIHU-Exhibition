import "./header.scss";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";
import { useMediaDevice } from "context/media-device-provider/media-device-provider";

// Components
import RegisterDialog from "components/dialogs/register-dialog/register-dialog";
import LoginDialog from "components/dialogs/login-dialog/login-dialog";
import LanguageSelect from "./LanguageSelect";

import DialogPortal from "context/dialog-ref-provider/DialogPortal";

// Models
import { OAuthConfigObj } from "../LandingPage";

// Utils
import cx from "classnames";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";

// Assets
import headerLogoWhite from "../../../assets/img/landing-page/header/png/logo-white.png";
import headerLogoColor from "../../../assets/img/landing-page/header/png/logo-color.png";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { BsBoxArrowUpRight } from "react-icons/bs";

// - -

type HeaderProps = {
  oauthConfigs: OAuthConfigObj[] | null;
};

const Header = ({ oauthConfigs }: HeaderProps) => {
  const { t } = useTranslation("new-landing-screen");

  const { isMobile, isTablet, isDesktop, isMobileLandscape } = useMediaDevice();

  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState<boolean>(false);
  const location = useLocation();

  const isHomePageLinkActive = location.pathname === "/";
  const isAboutPageLinkActive = location.pathname === "/about";
  const isTermsOfUsePageLinkActive = location.pathname === "/terms-of-use";

  const {
    openNewTopDialog,
    closeTopDialog,
    isRegisterDialogOpen,
    isLoginDialogOpen,
  } = useDialogRef();

  // - -

  // Scrolling of header
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // - -

  return (
    <header className={cx({ scrolled: isScrolled === true })}>
      <div className="h-auto px-[16px] py-[15px]">
        <div className="h-full pl-[2.5%] pr-[5%] sm:px-[8px] lg:px-[8px] flex justify-between items-center gap-12">
          {/* 1. Logo */}
          <div>
            <a href="/" className="no-underline">
              <img
                src={isScrolled ? headerLogoColor : headerLogoWhite}
                width={isMobile || isMobileLandscape ? 132 : 176}
                height={isMobile || isMobileLandscape ? 30 : 40}
                alt="INDIHU Exhibition"
                title="INDIHU Exhibition"
              />
            </a>
          </div>

          {/* 2. */}
          <nav>
            {(isMobile || isTablet) && (
              <button type="button" onClick={() => setIsMobilePanelOpen(true)}>
                <MenuIcon
                  sx={{
                    fontSize: isMobile || isMobileLandscape ? "30px" : "40px",
                  }}
                />
              </button>
            )}

            {isDesktop && (
              <ul className="flex justify-start items-center gap-4">
                <li className={cx({ active: isHomePageLinkActive })}>
                  <a href="/">{t("header.introduction")}</a>
                </li>
                <li className={cx({ active: isAboutPageLinkActive })}>
                  <a href="/about">{t("header.about")}</a>
                </li>
                <li className={cx({ active: isTermsOfUsePageLinkActive })}>
                  <a href="/terms-of-use">{t("header.termsOfUse")}</a>
                </li>
                <li className="flex gap-[4px]">
                  <a
                    href="https://libcas.github.io/indihu-manual/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("header.manual")}
                  </a>
                  <i>
                    <BsBoxArrowUpRight />
                  </i>
                </li>
              </ul>
            )}
          </nav>

          {/* 3. Language, login and register panel */}
          {isDesktop && (
            <div className="flex justify-start items-center gap-4">
              <div>
                <LanguageSelect isHeaderScrolled={isScrolled} />
              </div>
              <button
                className={cx("login-button", { scrolled: isScrolled })}
                onClick={() => openNewTopDialog(DialogRefType.LoginDialog)}
              >
                {t("header.login")}
              </button>
              <button
                className={cx("register-button", { scrolled: isScrolled })}
                onClick={() => openNewTopDialog(DialogRefType.RegisterDialog)}
              >
                {t("header.register")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DIALOGS */}
      {isRegisterDialogOpen && (
        <DialogPortal
          component={
            <RegisterDialog
              closeThisDialog={closeTopDialog}
              oauthConfigs={oauthConfigs}
            />
          }
        />
      )}

      {isLoginDialogOpen && (
        <DialogPortal
          component={
            <LoginDialog
              closeThisDialog={closeTopDialog}
              oauthConfigs={oauthConfigs}
            />
          }
        />
      )}

      {/* COLLAPSE PANEL ON MOBILE */}
      <div
        className={cx("collapse-mobile-panel flex flex-col justify-between", {
          open: isMobilePanelOpen,
        })}
      >
        <div className="h-[90px] w-full px-[16px] py-[8px]">
          <div className="h-full pl-[2.5%] pr-[5%] sm:px-[8px] lg:px-[8px] flex justify-between items-center">
            <div>
              <LanguageSelect isHeaderScrolled={true} />
            </div>

            <nav>
              <button type="button" onClick={() => setIsMobilePanelOpen(false)}>
                <CloseIcon sx={{ fontSize: "40px" }} />
              </button>
            </nav>
          </div>
        </div>

        <div
          className={cx("grow flex items-center", {
            "flex-col justify-between": !isMobileLandscape,
            "flex-row-reverse justify-around": isMobileLandscape,
          })}
        >
          {/* Login and Register button */}
          <div className="flex flex-col gap-1 justify-start items-center">
            <ul className="flex flex-col justify-start items-center gap-3">
              <li className="min-w-[100px] pb-[4px] flex justify-center items-center">
                <button
                  className={cx("login-button", { scrolled: true })}
                  style={{ paddingLeft: "20px", paddingRight: "20px" }}
                  onClick={() => openNewTopDialog(DialogRefType.LoginDialog)}
                >
                  {t("header.login")}
                </button>
              </li>
              <li className="min-w-[100px] pb-[4px] flex justify-center items-center">
                <button
                  className={cx("register-button", { scrolled: true })}
                  style={{ paddingLeft: "20px", paddingRight: "20px" }}
                  onClick={() => openNewTopDialog(DialogRefType.RegisterDialog)}
                >
                  {t("header.register")}
                </button>
              </li>
            </ul>
          </div>

          {/* Content */}
          <ul className="pb-[32px] flex flex-col justify-end items-center gap-10">
            <li
              className={cx(
                "min-w-[100px] pb-[4px] flex justify-center items-center",
                {
                  "border-b-2 border-b-solid border-b-primary-blue":
                    isHomePageLinkActive,
                }
              )}
            >
              <a href="/" className="font-bold">
                {t("header.introduction")}
              </a>
            </li>

            <li
              className={cx(
                "min-w-[100px] pb-[4px] flex justify-center items-center",
                {
                  "border-b-2 border-b-solid border-b-primary-blue":
                    isAboutPageLinkActive,
                }
              )}
            >
              <a href="/about" className="font-bold">
                {t("header.about")}
              </a>
            </li>

            <li
              className={cx(
                "min-w-[100px] pb-[4px] flex justify-center items-center",
                {
                  "border-b-2 border-b-solid border-b-primary-blue":
                    isTermsOfUsePageLinkActive,
                }
              )}
            >
              <a href="/terms-of-use" className="font-bold">
                {t("header.termsOfUse")}
              </a>
            </li>

            <li className="min-w-[100px] pb-[4px] flex justify-center items-center gap-[4px]">
              <a
                href="https://libcas.github.io/indihu-manual/"
                target="_blank"
                rel="noreferrer"
                className="font-bold"
              >
                {t("header.manual")}
              </a>
              <i>
                <BsBoxArrowUpRight />
              </i>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
