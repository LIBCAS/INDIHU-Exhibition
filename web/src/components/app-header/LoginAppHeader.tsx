import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import LanguageSelect from "components/language-select/LanguageSelect";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Models
import { ActiveExpo, Screen } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import cx from "classnames";
import { signOut } from "actions/user-actions";
import { openInNewTab } from "utils";
import { mapScreenTypeValuesToKeys } from "enums/screen-type";
import { useActiveExpoAccess } from "context/active-expo-access-provider/active-expo-access-provider";
import { Icon } from "components/icon/icon";

// - -

type LoginAppHeaderProps = {
  activeExpo: ActiveExpo;
  activeScreen: Screen;
  admin: boolean;
  expositionsStyle?: boolean;
  expoStyle?: boolean;
  screenStyle?: boolean;
  adminStyle?: boolean;
  profileStyle?: boolean;
};

const LoginAppHeader = ({
  activeExpo,
  activeScreen,
  admin,
  expositionsStyle,
  expoStyle,
  screenStyle,
  adminStyle,
  profileStyle,
}: LoginAppHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation(["app-header", "expo"]);
  const history = useHistory();
  const match = useRouteMatch();

  const [rightSignInMenuAnchor, setRightSignInMenuAnchor] =
    useState<HTMLElement | null>(null);

  const { isReadWriteAccess } = useActiveExpoAccess();

  return (
    <div className="w-full flex justify-between items-center gap-4">
      {/* LEFT PART */}
      <div className="flex items-center gap-6 max-w-[75%] xl:max-w-[45%]">
        {expoStyle && (
          <IconButton
            onClick={() => history.push("/exhibitions")}
            sx={{
              color: "white",
              "& .MuiSvgIcon-root": { fontSize: "26px" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {screenStyle && (
          <IconButton
            onClick={() => history.push(`/expo/${activeExpo.id}/structure`)}
            sx={{
              color: "white",
              "& .MuiSvgIcon-root": { fontSize: "26px" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        <div
          className="font-medium text-white !font-['Work_Sans'] cursor-pointer whitespace-nowrap overflow-x-hidden text-ellipsis"
          style={{
            fontSize:
              expositionsStyle || adminStyle || profileStyle ? "24px" : "20px",
          }}
          onClick={() => {
            if (expositionsStyle || adminStyle || profileStyle) {
              history.push("/exhibitions");
            }
          }}
        >
          {screenStyle && activeScreen && activeScreen.type
            ? t(
                `structure.screenLabels.${mapScreenTypeValuesToKeys[
                  activeScreen.type
                ].toLowerCase()}`,
                { ns: "expo" }
              )
            : activeExpo.title || "INDIHU Exhibition"}
        </div>

        {(expoStyle || (screenStyle && activeScreen)) && (
          <div className="hidden md:flex gap-2 text-white whitespace-nowrap !font-['Work_Sans']">
            <div>
              {t("logged.expositionState")}{" "}
              {t(`expoState.${activeExpo.state.toLowerCase()}`, { ns: "expo" })}{" "}
            </div>
            <div className="self-center border-[1px] border-solid border-white rounded-full p-[1px]">
              {isReadWriteAccess ? (
                <div>
                  <Icon
                    useMaterialUiIcon
                    name="edit-on"
                    iconStyle={{
                      fontSize: "14px",
                      color: "#cccccc",
                    }}
                    tooltip={{
                      id: "md-edit-on",
                      content: t("read-write-permission-tooltip"),
                      variant: "dark",
                    }}
                  />
                </div>
              ) : (
                <div>
                  <Icon
                    useMaterialUiIcon
                    name="edit-off"
                    iconStyle={{
                      fontSize: "14px",
                      color: "#cccccc",
                    }}
                    tooltip={{
                      id: "md-edit-off",
                      content: t("read-only-permission-tooltip"),
                      variant: "dark",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PART */}
      <div className="hidden xl:flex items-center gap-6">
        <LanguageSelect isSmallerVariant forceWhiteColoring />

        {!expoStyle && !screenStyle && admin && (
          <div
            onClick={() => history.push("/administration")}
            className={cx(
              "text-white !font-['Work_Sans'] cursor-pointer hover:text-[#bbddfe]",
              {
                "border-b-[1px] border-b-solid border-b-white":
                  match.path === "/administration",
              }
            )}
          >
            {t("logged.settings")}
          </div>
        )}

        {!expoStyle && !screenStyle && admin && (
          <div
            onClick={() => history.push("/users")}
            className={cx(
              "text-white !font-['Work_Sans'] cursor-pointer hover:text-[#bbddfe]",
              {
                "border-b-[1px] border-b-solid border-b-white":
                  match.path === "/users",
              }
            )}
          >
            {t("logged.users")}
          </div>
        )}

        {!expoStyle && !screenStyle && (
          <div
            onClick={() => history.push("/exhibitions")}
            className={cx(
              "text-white !font-['Work_Sans'] cursor-pointer hover:text-[#bbddfe]",
              {
                "border-b-[1px] border-b-solid border-b-white":
                  match.path === "/exhibitions",
              }
            )}
          >
            {t("logged.exhibitions")}
          </div>
        )}

        <div
          onClick={() =>
            openInNewTab("https://libcas.github.io/indihu-manual/")
          }
          className="text-white !font-['Work_Sans'] cursor-pointer hover:text-[#bbddfe]"
        >
          {t("manual")}
        </div>

        <div className="flex gap-0 items-center cursor-pointer text-white hover:text-[#bbddfe]">
          <i className="fa fa-fw fa-user m-auto" />
          <div
            onClick={() => history.push("/profile")}
            className={cx(
              "text-inherit !font-['Work_Sans'] whitespace-nowrap hover:text-[#bbddfe]",
              {
                "border-b-[1px] border-b-solid border-b-white":
                  match.path === "/profile",
              }
            )}
          >
            {t("logged.accountManagement")}
          </div>
        </div>

        <div className="flex gap-0 items-center cursor-pointer text-white hover:text-[#bbddfe]">
          <i className="fa fa-fw fa-sign-out m-auto" />
          <div
            onClick={() => {
              dispatch(signOut());
              history.replace("/");
            }}
            className="text-inherit !font-['Work_Sans'] whitespace-nowrap"
          >
            {t("logged.logout")}
          </div>
        </div>
      </div>

      {/* on small screens */}
      <div className="flex xl:hidden">
        <IconButton
          sx={{
            color: "white",
            "& .MuiSvgIcon-root": { fontSize: "26px" },
          }}
          onClick={(e) => setRightSignInMenuAnchor(e.currentTarget)}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          id="app-header-right-sign-in-mobile-menu"
          anchorEl={rightSignInMenuAnchor}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(rightSignInMenuAnchor)}
          onClose={() => setRightSignInMenuAnchor(null)}
          sx={{ "& .MuiMenuItem-root": { height: "40px" } }}
        >
          <MenuItem onClick={() => history.push("/profile")}>
            {t("logged.accountManagement")}
          </MenuItem>

          <MenuItem onClick={() => history.push("/administration")}>
            {t("logged.settings")}
          </MenuItem>

          <MenuItem onClick={() => history.push("/users")}>
            {t("logged.users")}
          </MenuItem>

          <MenuItem onClick={() => history.push("/exhibitions")}>
            {t("logged.exhibitions")}
          </MenuItem>

          <MenuItem
            onClick={() =>
              openInNewTab("https://libcas.github.io/indihu-manual/")
            }
          >
            {t("manual")}
          </MenuItem>

          <MenuItem
            onClick={() => {
              dispatch(signOut());
              history.replace("/");
            }}
          >
            {t("logged.logout")}
          </MenuItem>

          <MenuItem>
            <LanguageSelect isSmallerVariant />
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default LoginAppHeader;
