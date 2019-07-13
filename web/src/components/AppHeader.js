import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import classNames from "classnames";
import { get } from "lodash";
import FontIcon from "react-md/lib/FontIcons";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";

import { signOut } from "../actions/userActions";
import { expoStateText } from "../enums/expoState";
import { screenTypeText } from "../enums/screenType";
import { isAdmin } from "../utils";

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
  match
}) => (
  <header
    className={classNames(mdStyles, "toolbar", {
      "toolbar-noshadow": expoStyle || screenStyle
    })}
  >
    <div className="toolbar-left toolbar-flex">
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
        className="md-title md-title--toolbar toolbar-title"
        style={
          adminStyle || authStyle || profileStyle || expositionsStyle
            ? {
                fontWeight: 700,
                fontSize: 26,
                cursor: "pointer"
              }
            : undefined
        }
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
    </div>

    {authStyle && (
      <div className="toolbar-right-auth">
        <p
          className="toolbar-button"
          onClick={() => {
            history.push(isSignIn ? "/" : "/sign-in");
          }}
        >
          {isSignIn ? "Registrace" : "Přihlášení"}
        </p>
        <MenuButton
          id="appheader-header-auth-menu"
          icon
          buttonChildren="menu"
          position="tr"
        >
          <ListItem
            primaryText="INDIHU OCR (nástroj na konverzi obrázků na text)"
            onClick={() =>
              (window.location.href = "http://inqooltest.libj.cas.cz/ocr-web/")
            }
          />
          <ListItem
            primaryText="O projektu INDIHU"
            onClick={() => (window.location.href = "https://indihu.cz/")}
          />
        </MenuButton>
      </div>
    )}

    {!authStyle && (
      <div className="toolbar-right toolbar-flex">
        {(expoStyle || (screenStyle && activeScreen)) && (
          <p className="toolbar-button nonclickable">
            stav: {expoStateText[activeExpo.state]}
          </p>
        )}
        {!expoStyle &&
          !screenStyle &&
          admin &&
          get(match, "path") !== "/administration" && (
            <p
              className="toolbar-button"
              onClick={() => {
                history.push("/administration");
              }}
            >
              Nastavení
            </p>
          )}
        {!expoStyle &&
          !screenStyle &&
          admin &&
          get(match, "path") !== "/users" && (
            <p
              className="toolbar-button"
              onClick={() => {
                history.push("/users");
              }}
            >
              Uživatelé
            </p>
          )}
        {!expoStyle && !screenStyle && get(match, "path") !== "/exhibitions" && (
          <p
            className="toolbar-button"
            onClick={() => history.push("/exhibitions")}
          >
            Výstavy
          </p>
        )}
        {get(match, "path") !== "/profile" && (
          <p
            className="toolbar-button"
            onClick={() => history.push("/profile")}
          >
            <i className="fa fa-fw fa-user" />
            Správa účtu
          </p>
        )}
        <p
          className="toolbar-button"
          onClick={() => {
            signOut();
            history.replace("/sign-in");
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

export default withRouter(
  connect(
    ({ user: { role, userName }, expo: { activeExpo, activeScreen } }) => ({
      admin: isAdmin(role),
      userName,
      activeExpo,
      activeScreen
    }),
    { signOut }
  )(AppHeader)
);
