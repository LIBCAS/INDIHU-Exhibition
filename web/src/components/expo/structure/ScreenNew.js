import React from "react";
import { map } from "lodash";
import { connect } from "react-redux";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";
import Subheader from "react-md/lib/Subheaders";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";

import * as expoActions from "../../../actions/expoActions";
import { newScreen, screenType } from "../../../enums/screenType";

const CardStyle = () =>
  <Card raise className="new-content">
    <CardText className="new-screen">
      <i className="material-icons">add</i>
      <p>Nová obrazovka</p>
    </CardText>
  </Card>;

const ScreenNew = ({ large, section, addScreen, rowNum, colNum }) =>
  <MenuButton
    id={large ? "large" : "icon"}
    buttonChildren={large ? <CardStyle /> : "add"}
    position="tl"
    flat={large}
    icon={!large}
  >
    {section &&
      <div>
        <Subheader className="add-menu-header" primaryText="Kapitola" primary />
        <ListItem
          className="add-menu-item"
          primaryText="Úvod do kapitoly"
          onClick={() => addScreen(rowNum, 0, screenType.INTRO, section)}
        />
      </div>}
    <Subheader className="add-menu-header" primaryText="Obrazovka" primary />
    <div>
      {map(newScreen.SCREEN, s =>
        <ListItem
          key={s[0]}
          className="add-menu-item"
          primaryText={s[1]}
          onClick={() => addScreen(rowNum, colNum, s[0], section)}
        />
      )}
    </div>
    <Subheader className="add-menu-header" primaryText="Minihra" primary />
    <div>
      {map(newScreen.GAME, s =>
        <ListItem
          key={s[0]}
          className="add-menu-item"
          primaryText={s[1]}
          onClick={() => addScreen(rowNum, colNum, s[0], section)}
        />
      )}
    </div>
  </MenuButton>;

export default connect(null, { ...expoActions })(ScreenNew);
