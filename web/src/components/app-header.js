import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "recompose";
import classNames from "classnames";
import { get } from "lodash";
import FontIcon from "react-md/lib/FontIcons";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";

import { signOut } from "../actions/user-actions";
import { expoStateText } from "../enums/expo-state";
import { screenTypeText } from "../enums/screen-type";
import { isAdmin, openInNewTab } from "../utils";

const mdStyles =
  "md-paper md-paper--2 md-background--primary md-toolbar--text-white md-toolbar--discrete md-toolbar--fixed";

const AppHeader = ({
  history,
  authStyle,
  expoStyle,
  screenStyle,
  adminStyle,
  profileStyle,
  expositionsStyle,
  isSignIn,
  activeExpo,
  activeScreen,
  admin,
  signOut,
  match,
  handleInfo,
  handleGDPR,
}) => (
  <header
    className={classNames(mdStyles, "toolbar", {
      "toolbar-noshadow": expoStyle || screenStyle,
    })}
  >
    <div className={classNames("toolbar-left toolbar-flex", { authStyle })}>
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
        className={classNames("md-title md-title--toolbar toolbar-title", {
          "with-link":
            adminStyle || authStyle || profileStyle || expositionsStyle,
        })}
        onClick={() =>
          (adminStyle || authStyle || profileStyle || expositionsStyle) &&
          history.push(authStyle ? "/" : "/exhibitions")
        }
      >
        {adminStyle || authStyle || profileStyle || expositionsStyle
          ? "INDIHU Exhibition"
          : screenStyle && activeScreen
          ? activeScreen.type
            ? screenTypeText[activeScreen.type]
            : get(activeExpo, "title", "INDIHU Exhibition")
          : get(activeExpo, "title", "INDIHU Exhibition")}
      </h2>
      {authStyle && handleInfo && (
        <button
          className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
          style={{ marginLeft: 32 }}
          onClick={handleInfo}
        >
          Podmínky použití
        </button>
      )}
      {authStyle && handleGDPR && (
        <button
          className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
          style={{ marginLeft: 32 }}
          onClick={handleGDPR}
        >
          Zásady práce s osobními údaji
        </button>
      )}
      {authStyle && (
        <a
          className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
          href="https://indihu.cz/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Projekt INDIHU
        </a>
      )}
      {authStyle && (
        <a
          className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
          href="https://nnis.github.io/indihu-manual/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Manuál
        </a>
      )}
    </div>

    {authStyle && (
      <div className="toolbar-right-auth">
        <p
          className="toolbar-button screen-size-tablet-min"
          onClick={() => {
            history.push(isSignIn ? "/register" : "/");
          }}
        >
          {isSignIn ? "Registrace" : "Přihlášení"}
        </p>
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
            <ListItem primaryText="Podmínky použití" onClick={handleInfo} />
            <ListItem
              primaryText="Zásady práce s osobními údaji"
              onClick={handleGDPR}
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

    {!authStyle && (
      <div className="toolbar-right toolbar-flex">
        {(expoStyle || (screenStyle && activeScreen)) && (
          <p className="toolbar-button nonclickable">
            stav: {expoStateText[activeExpo.state]}
          </p>
        )}
        {!expoStyle && !screenStyle && admin && (
          <p
            className={classNames("toolbar-button", {
              active: get(match, "path") === "/administration",
            })}
            onClick={() => {
              history.push("/administration");
            }}
          >
            Nastavení
          </p>
        )}
        {!expoStyle && !screenStyle && admin && (
          <p
            className={classNames("toolbar-button", {
              active: get(match, "path") === "/users",
            })}
            onClick={() => {
              history.push("/users");
            }}
          >
            Uživatelé
          </p>
        )}
        {!expoStyle && !screenStyle && (
          <p
            className={classNames("toolbar-button", {
              active: get(match, "path") === "/exhibitions",
            })}
            onClick={() => history.push("/exhibitions")}
          >
            Výstavy
          </p>
        )}
        {!expoStyle && !screenStyle && (
          <p
            className={"toolbar-button"}
            onClick={() =>
              openInNewTab("https://nnis.github.io/indihu-manual/")
            }
          >
            Manuál
          </p>
        )}
        {
          <p
            className={classNames("toolbar-button", {
              active: get(match, "path") === "/profile",
            })}
            onClick={() => history.push("/profile")}
          >
            <i className="fa fa-fw fa-user" />
            Správa účtu
          </p>
        }
        <p
          className="toolbar-button"
          onClick={() => {
            signOut();
            history.replace("/");
          }}
        >
          <i className="fa fa-fw fa-sign-out" />
          Odhlásit
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

export default compose(
  withRouter,
  connect(
    ({ user: { role, userName }, expo: { activeExpo, activeScreen } }) => ({
      admin: isAdmin(role),
      userName,
      activeExpo,
      activeScreen,
    }),
    { signOut }
  )
)(AppHeader);
