import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";
import FontIcon from "react-md/lib/FontIcons";

// Models
import { AppDispatch, AppState } from "store/store";
import { ActiveExpo, Screen } from "models";

import { mapScreenTypeValuesToKeys } from "enums/screen-type";

import { signOut } from "actions/user-actions";
import { isAdmin, openInNewTab } from "utils";
import { get } from "lodash";
import cx from "classnames";
import { LanguageSelect } from "./form/mui";

const mdStyles =
  "md-paper md-paper--2 md-background--primary md-toolbar--text-white md-toolbar--discrete md-toolbar--fixed";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.activeExpo as ActiveExpo,
  ({ expo }: AppState) => expo.activeScreen as Screen,
  ({ user }: AppState) => user.userName,
  ({ user }: AppState) => user.role,
  (activeExpo, activeScreen, userName, role) => ({
    activeExpo,
    activeScreen,
    userName,
    role,
  })
);

// - -

type AppHeaderProps = {
  authStyle?: boolean;
  expositionsStyle?: boolean;
  expoStyle?: boolean;
  screenStyle?: boolean;
  adminStyle?: boolean;
  profileStyle?: boolean;
  isSignIn?: boolean;
  handleInfo?: () => void;
  handleGDPR?: () => void;
};

const AppHeader = ({
  authStyle,
  expositionsStyle,
  expoStyle,
  screenStyle,
  adminStyle,
  profileStyle,
  isSignIn,
  handleInfo,
  handleGDPR,
}: AppHeaderProps) => {
  const { activeExpo, activeScreen, role } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation(["app-header", "expo"]);

  const history = useHistory();
  const match = useRouteMatch();

  const admin = isAdmin(role);

  return (
    <header
      className={cx(mdStyles, "toolbar", {
        "toolbar-noshadow": expoStyle || screenStyle,
      })}
    >
      {/* A) Left part of header */}
      <div className={cx("toolbar-left toolbar-flex", { authStyle })}>
        {expoStyle && (
          <FontIcon
            className="toolbar-back"
            onClick={() => history.push("/exhibitions")}
          >
            arrow_back
          </FontIcon>
        )}

        {screenStyle && (
          <FontIcon
            className="toolbar-back"
            onClick={() => history.push(`/expo/${activeExpo.id}/structure`)}
          >
            arrow_back
          </FontIcon>
        )}

        <h2
          className={cx("md-title md-title--toolbar toolbar-title", {
            "with-link":
              authStyle || expositionsStyle || adminStyle || profileStyle,
          })}
          onClick={() => {
            if (authStyle || expositionsStyle || adminStyle || profileStyle) {
              history.push(authStyle ? "/" : "/exhibitions");
            }
          }}
        >
          {authStyle || expositionsStyle || adminStyle || profileStyle
            ? "INDIHU Exhibition"
            : screenStyle && activeScreen && activeScreen.type
            ? t(
                `structure.screenLabels.${mapScreenTypeValuesToKeys[
                  activeScreen.type
                ].toLowerCase()}`,
                { ns: "expo" }
              )
            : activeExpo.title || "INDIHU Exhibition"}
        </h2>

        {(expoStyle || (screenStyle && activeScreen)) && (
          <p
            className="toolbar-button nonclickable"
            style={{ marginLeft: "24px" }}
          >
            {t("logged.expositionState")}{" "}
            {t(`expoState.${activeExpo.state.toLowerCase()}`, { ns: "expo" })}{" "}
          </p>
        )}

        {authStyle && handleInfo && (
          <button
            className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
            style={{ marginLeft: 32 }}
            onClick={() => handleInfo()}
          >
            {t("logout.conditionsOfUse")}
          </button>
        )}

        {authStyle && handleGDPR && (
          <button
            className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
            style={{ marginLeft: 32 }}
            onClick={() => handleGDPR()}
          >
            {t("logout.personalData")}
          </button>
        )}

        {authStyle && (
          <a
            className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
            href="https://indihu.cz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("logout.projectIndihu")}
          </a>
        )}

        {authStyle && (
          <a
            className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
            href="https://nnis.github.io/indihu-manual/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("manual")}
          </a>
        )}
      </div>

      {/* Right part of header */}
      {authStyle && (
        <div className="toolbar-right-auth">
          <p
            className="toolbar-button screen-size-tablet-min"
            onClick={() => {
              history.push(isSignIn ? "/register" : "/");
            }}
          >
            {isSignIn ? t("logout.registration") : t("logout.login")}
          </p>

          {/* on small screens */}
          <div className="screen-size-desktop-bigger-max">
            <MenuButton
              id="appheader-header-auth-menu"
              icon
              buttonChildren="menu"
              position="tr"
            >
              <ListItem
                className="screen-size-tablet-max"
                primaryText={isSignIn ? "Registrace" : "Přihlášení"}
                onClick={() => history.push(isSignIn ? "/register" : "/")}
              />
              <ListItem
                primaryText="Podmínky použití"
                onClick={() => handleInfo?.()}
              />
              <ListItem
                primaryText="Zásady práce s osobními údaji"
                onClick={() => handleGDPR?.()}
              />
              <ListItem
                primaryText="Projekt INDIHU"
                onClick={() => openInNewTab("https://indihu.cz/")}
              />
              <ListItem
                primaryText="Manuál"
                onClick={() =>
                  openInNewTab("https://nnis.github.io/indihu-manual/")
                }
              />
            </MenuButton>
          </div>
        </div>
      )}

      {/* Right part when logged in inside */}
      {!authStyle && (
        <div className="toolbar-right toolbar-flex">
          <LanguageSelect isSmallerVariant isAppHeader />

          {!expoStyle && !screenStyle && admin && (
            <p
              className={cx("toolbar-button", {
                active: get(match, "path") === "/administration",
              })}
              onClick={() => {
                history.push("/administration");
              }}
            >
              {t("logged.settings")}
            </p>
          )}

          {!expoStyle && !screenStyle && admin && (
            <p
              className={cx("toolbar-button", {
                active: get(match, "path") === "/users",
              })}
              onClick={() => {
                history.push("/users");
              }}
            >
              {t("logged.users")}
            </p>
          )}

          {!expoStyle && !screenStyle && (
            <p
              className={cx("toolbar-button", {
                active: get(match, "path") === "/exhibitions",
              })}
              onClick={() => history.push("/exhibitions")}
            >
              {t("logged.exhibitions")}
            </p>
          )}

          <p
            className={"toolbar-button"}
            onClick={() =>
              openInNewTab("https://nnis.github.io/indihu-manual/")
            }
          >
            {t("manual")}
          </p>

          <p
            className={cx("toolbar-button", {
              active: get(match, "path") === "/profile",
            })}
            onClick={() => history.push("/profile")}
          >
            <i className="fa fa-fw fa-user" />
            {t("logged.accountManagement")}
          </p>

          <p
            className="toolbar-button"
            onClick={() => {
              dispatch(signOut());
              history.replace("/");
            }}
          >
            <i className="fa fa-fw fa-sign-out" />
            {t("logged.logout")}
          </p>

          <MenuButton
            id="appheader-header-menu"
            className="toolbar-tablet"
            icon
            buttonChildren="menu"
            position="tr"
          >
            <ListItem
              primaryText="Správa účtu"
              className="toolbar-userRow"
              onClick={() => {
                history.push("/profile");
              }}
            />
            {admin && (
              <ListItem
                primaryText="Nastavení"
                onClick={() => {
                  history.push("/administration");
                }}
              />
            )}
            {admin && (
              <ListItem
                primaryText="Uživatelé"
                onClick={() => {
                  history.push("/users");
                }}
              />
            )}
            <ListItem
              primaryText="Výstavy"
              onClick={() => history.push("/exhibitions")}
            />
            <ListItem
              primaryText="Manuál"
              onClick={() =>
                openInNewTab("https://nnis.github.io/indihu-manual/")
              }
            />
            <ListItem
              primaryText="Odhlásit"
              onClick={() => {
                signOut();
                history.replace("/");
              }}
            />
          </MenuButton>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
