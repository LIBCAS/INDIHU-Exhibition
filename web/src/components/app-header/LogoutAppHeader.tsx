import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import LanguageSelect from "components/language-select/LanguageSelect";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// Utils
import { openInNewTab } from "utils";
// - - -

type LogoutAppHeaderProps = {
  isSignIn?: boolean;
  handleInfo?: () => void;
  handleGDPR?: () => void;
};

const LogoutAppHeader = ({
  isSignIn,
  handleInfo,
  handleGDPR,
}: LogoutAppHeaderProps) => {
  const { t } = useTranslation(["app-header", "expo"]);
  const history = useHistory();

  const [rightSignOutMenuAnchor, setRightSignOutMenuAnchor] =
    useState<HTMLElement | null>(null);

  return (
    <div className="w-full flex justify-between items-center gap-4">
      {/* LEFT PART */}
      <div className="flex items-center gap-8">
        <div
          className="cursor-pointer text-white font-medium text-2xl"
          onClick={() => history.push("/")}
        >
          INDIHU Exhibition
        </div>

        <div className="hidden xl:flex items-center gap-6">
          {handleInfo && (
            <button
              className="text-white !font-['Work_Sans'] cursor-pointer hover:text-[#bbddfe]"
              onClick={() => handleInfo()}
            >
              {t("logout.conditionsOfUse")}
            </button>
          )}

          {handleGDPR && (
            <button
              className="text-white !font-['Work_Sans'] cursor-pointer hover:text-[#bbddfe]"
              onClick={() => handleGDPR()}
            >
              {t("logout.personalData")}
            </button>
          )}

          <a
            className="text-white !font-['Work_Sans'] cursor-pointer hover:text-[#bbddfe]"
            href="https://indihu.cz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("logout.projectIndihu")}
          </a>

          <a
            className="text-white !font-['Work_Sans'] cursor-pointer hover:text-[#bbddfe]"
            href="https://libcas.github.io/indihu-manual/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("manual")}
          </a>
        </div>
      </div>

      {/* RIGHT PART */}
      <div className="flex items-center gap-6">
        <div className="hidden xl:flex">
          <LanguageSelect isSmallerVariant forceWhiteColoring />
        </div>

        <div
          className="text-white !font-['Work_Sans'] cursor-pointer hover:text-[#bbddfe]"
          onClick={() => history.push(isSignIn ? "/register" : "/")}
        >
          {isSignIn ? t("logout.registration") : t("logout.login")}
        </div>

        {/* on small screens */}
        <div className="flex xl:hidden">
          <IconButton
            sx={{
              color: "white",
              "& .MuiSvgIcon-root": { fontSize: "26px" },
            }}
            onClick={(e) => setRightSignOutMenuAnchor(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="app-header-right-sign-in-mobile-menu"
            anchorEl={rightSignOutMenuAnchor}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(rightSignOutMenuAnchor)}
            onClose={() => setRightSignOutMenuAnchor(null)}
            sx={{ "& .MuiMenuItem-root": { height: "40px" } }}
          >
            <MenuItem
              onClick={() => {
                history.push(isSignIn ? "/register" : "/");
                setRightSignOutMenuAnchor(null);
              }}
            >
              {isSignIn ? t("logout.registration") : t("logOut.login")}
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleInfo?.();
                setRightSignOutMenuAnchor(null);
              }}
            >
              {t("logout.conditionsOfUse")}
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleGDPR?.();
                setRightSignOutMenuAnchor(null);
              }}
            >
              {t("logout.personalData")}
            </MenuItem>

            <MenuItem onClick={() => openInNewTab("https://indihu.cz/")}>
              {t("logout.projectIndihu")}
            </MenuItem>

            <MenuItem
              onClick={() =>
                openInNewTab("https://libcas.github.io/indihu-manual/")
              }
            >
              {t("manual")}
            </MenuItem>

            <MenuItem>
              <LanguageSelect isSmallerVariant />
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default LogoutAppHeader;
