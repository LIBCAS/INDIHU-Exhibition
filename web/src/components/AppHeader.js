import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import classNames from "classnames";
import { get } from "lodash";
import FontIcon from "react-md/lib/FontIcons";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";

import { signOut } from "../actions/userActions";
import { setDialog } from "../actions/dialogActions";
import { expoStateText } from "../enums/expoState";
import { screenTypeText } from "../enums/screenType";
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
  handleInfo
}) => (
  <header
    className={classNames(mdStyles, "toolbar", {
      "toolbar-noshadow": expoStyle || screenStyle
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
            adminStyle || authStyle || profileStyle || expositionsStyle
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
      {(expoStyle || (screenStyle && activeScreen)) && (
        <p className="toolbar-button nonclickable">
          stav: {expoStateText[activeExpo.state]}
        </p>
      )}
      {authStyle && (
        <a
          className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
          style={{ marginLeft: 32 }}
          onClick={handleInfo}
        >
          O aplikaci
        </a>
      )}
      {authStyle && (
        <a
          className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
          style={{ marginLeft: 32 }}
          href="https://ocr.indihu.cz/"
          target="_blank"
          rel="noopener noreferrer"
        >
          INDIHU OCR
        </a>
      )}
      {authStyle && (
        <a
          className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
          style={{ marginLeft: 32 }}
          href="https://mind.indihu.cz/"
          target="_blank"
          rel="noopener noreferrer"
        >
          INDIHU Mind
        </a>
      )}
      {authStyle && (
        <a
          className="toolbar-button toolbar-button-link screen-size-desktop-bigger-min"
          href="https://indihu.cz/"
          target="_blank"
          rel="noopener noreferrer"
        >
          O projektu INDIHU
        </a>
      )}
    </div>

    {authStyle && (
      <div className="toolbar-right-auth">
        <p
          className="toolbar-button screen-size-tablet-min"
          onClick={() => {
            history.push(isSignIn ? "/" : "/sign-in");
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
              onClick={() => history.push(isSignIn ? "/" : "/sign-in")}
            />
            <ListItem primaryText="O aplikaci" onClick={handleInfo} />
            <ListItem
              primaryText="INDIHU OCR (nástroj na konverzi obrázků na text)"
              onClick={() =>
                openInNewTab("http://inqooltest.libj.cas.cz/ocr-web/")
              }
            />
            <ListItem
              primaryText="INDIHU Mind"
              onClick={() => openInNewTab("https://mind.indihu.cz/")}
            />
            <ListItem
              primaryText="O projektu INDIHU"
              onClick={() => openInNewTab("https://indihu.cz/")}
            />
          </MenuButton>
        </div>
      </div>
    )}

    {!authStyle && (
      <div className="toolbar-right toolbar-flex">
        {(expoStyle || (screenStyle && activeScreen)) && (
          <a
            href="https://nnis.github.io/indihu-manual/"
            target="_blank"
            rel="noopener noreferrer"
            className="toolbar-button"
            style={{ textDecoration: "none" }}
          >
            <i className="fa fa-fw fa-info" />
            Manuál
          </a>
        )}
        {!expoStyle && !screenStyle && admin && (
          <p
            className={classNames("toolbar-button", {
              active: get(match, "path") === "/administration"
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
              active: get(match, "path") === "/users"
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
              active: get(match, "path") === "/exhibitions"
            })}
            onClick={() => history.push("/exhibitions")}
          >
            Výstavy
          </p>
        )}
        {
          <p
            className={classNames("toolbar-button", {
              active: get(match, "path") === "/profile"
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

export default compose(
  withRouter,
  connect(
    ({ user: { role, userName }, expo: { activeExpo, activeScreen } }) => ({
      admin: isAdmin(role),
      userName,
      activeExpo,
      activeScreen
    }),
    { signOut, setDialog }
  ),
  withHandlers({
    handleInfo: ({ setDialog }) => () => {
      setDialog("Info", {
        title: "INDIHU Exhibition - informace",
        text: (
          <div>
            <p>
              Aplikace na vytváření virtuálních výstav INDIHU Exhibition je
              provozována Knihovnou Akademie věd České republiky. Určena je
              především pracovníkům ústavů AV ČR, vysokých škol a paměťových
              institucí. Využití je bezplatné a je podmíněno registrací, která
              je následně schválena administrátorem.
            </p>
            <p>
              Knihovna AV ČR se zavazuje tuto aplikaci dlouhodobě provozovat na
              adrese{" "}
              <a
                href="https://exhibition.indihu.cz/"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                https://exhibition.indihu.cz/
              </a>
              . V případě, že by se měnily podmínky provozování, budou uživatelé
              informováni. Technické podrobnosti a popis použití jsou uvedeny v
              uživatelském manuálu{" "}
              <a
                href="https://nnis.github.io/indihu-manual/"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                https://nnis.github.io/indihu-manual/
              </a>
              .
            </p>
            <p>
              Software byl vyvinut jako open source pod licencí GNU GPL v3 v
              rámci projektu "INDIHU - vývoj nástrojů a infrastruktury pro
              digital humanities" podpořeného z programu MK ČR NAKI v letech
              2016-2020 pod označením DG16P02B039. Více o projektu na{" "}
              <a
                href="https://indihu.cz/"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                https://indihu.cz/
              </a>
              .
            </p>
            <p>
              Další informace jsou k dispozici ve vývojovém prostředí na{" "}
              <a
                href="https://github.com/LIBCAS/INDIHU-Exhibition"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                https://github.com/LIBCAS/INDIHU-Exhibition
              </a>
              .
            </p>
            <p>Kontaktní mail: info@indihu.cz</p>
          </div>
        ),
        noDialogMenu: true,
        big: true
      });
    }
  })
)(AppHeader);
