import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import classNames from "classnames";
import { get } from "lodash";
import FontIcon from "react-md/lib/FontIcons";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";

import Logo from "../assets/img/logo-white.png";
import { signOut } from "../actions/userActions";
import { expoStateText } from "../enums/expoState";
import { screenTypeText } from "../enums/screenType";
import { isAdmin } from "../utils";

const mdStyles =
  "md-paper md-paper--2 md-background--primary md-toolbar--text-white md-toolbar--discrete md-toolbar--fixed";

const AppHeader = ({
  history,
  userName,
  authStyle,
  expoStyle,
  screenStyle,
  adminStyle,
  profileStyle,
  expositionsStyle,
  activeExpo,
  activeScreen,
  admin,
  signOut
}) =>
  <header
    className={classNames(mdStyles, "toolbar", {
      "toolbar-noshadow": expoStyle || screenStyle,
      "toolbar-centered": authStyle
    })}
  >
    <div className="toolbar-left toolbar-flex">
      {expoStyle &&
        <FontIcon
          className="toolbar-back"
          onClick={() => history.push("/expositions")}
        >
          arrow_back
        </FontIcon>}
      {screenStyle &&
        <FontIcon
          className="toolbar-back"
          onClick={() => history.push(`/expo/${activeExpo.id}/structure`)}
        >
          arrow_back
        </FontIcon>}
      <h2 className="md-title md-title--toolbar toolbar-title">
        {adminStyle || authStyle || profileStyle || expositionsStyle
          ? <img
              src={Logo}
              alt="INDIHU - Editor virtuálních výstav"
              onClick={() => history.push(authStyle ? "/" : "/expositions")}
            />
          : screenStyle && activeScreen
            ? activeScreen.type
              ? screenTypeText[activeScreen.type]
              : get(activeExpo, "title", "INDIHU - Editor virtuálních výstav")
            : get(activeExpo, "title", "INDIHU - Editor virtuálních výstav")}
      </h2>
    </div>

    {!authStyle &&
      <div className="toolbar-right toolbar-flex">
        {(expoStyle || (screenStyle && activeScreen)) &&
          <p className="toolbar-button">
            stav: {expoStateText[activeExpo.state]}
          </p>}
        {!expoStyle &&
          !screenStyle &&
          admin &&
          <p
            className="toolbar-button"
            onClick={() => {
              history.push("/administration");
            }}
          >
            Nastavení
          </p>}
        {!expoStyle &&
          !screenStyle &&
          admin &&
          <p
            className="toolbar-button"
            onClick={() => {
              history.push("/users");
            }}
          >
            Uživatelé
          </p>}
        {!expoStyle &&
          !screenStyle &&
          <p
            className="toolbar-button"
            onClick={() => history.push("/expositions")}
          >
            Výstavy
          </p>}
        <p className="toolbar-button" onClick={() => history.push("/profile")}>
          <i className="fa fa-fw fa-user" />
          Správa účtu
        </p>
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
          {admin &&
            <ListItem
              primaryText="Nastavení"
              onClick={() => {
                history.push("/administration");
              }}
            />}
          {admin &&
            <ListItem
              primaryText="Uživatelé"
              onClick={() => {
                history.push("/users");
              }}
            />}
          <ListItem
            primaryText="Výstavy"
            onClick={() => history.push("/expositions")}
          />
          <ListItem
            primaryText="Odhlásit"
            onClick={() => {
              signOut();
              history.replace("/");
            }}
          />
        </MenuButton>
      </div>}
  </header>;

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
