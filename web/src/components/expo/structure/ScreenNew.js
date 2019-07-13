import React from "react";
import { map, get } from "lodash";
import { connect } from "react-redux";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";
import Subheader from "react-md/lib/Subheaders";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import ReactTooltip from "react-tooltip";

import * as expoActions from "../../../actions/expoActions";
import { newScreen, screenType } from "../../../enums/screenType";
import { helpIconText } from "../../../enums/text";

const CardStyle = () => (
  <Card raise className="new-content">
    <CardText className="new-screen">
      <i className="material-icons">add</i>
      <p>Nová obrazovka</p>
    </CardText>
  </Card>
);

const ScreenNew = ({
  large,
  section,
  addScreen,
  rowNum,
  colNum,
  position,
  style
}) => (
  <div style={{ cursor: "auto", ...style }}>
    <MenuButton
      id={large ? "large" : "icon"}
      buttonChildren={large ? <CardStyle /> : "add"}
      position={position || "tl"}
      flat={large}
      icon={!large}
    >
      {section && (
        <div>
          <Subheader
            className="add-menu-header"
            primaryText="Kapitola"
            primary
          />
          <ListItem
            id="expo-structure-screen-new-intro"
            className="add-menu-item"
            primaryText="Úvod do kapitoly"
            onClick={() => addScreen(rowNum, 0, screenType.INTRO, section)}
            data-tip={get(helpIconText, "EXPO_STRUCTURE_SCREEN_NEW_INTRO")}
            data-for="expo-structure-screen-new-tooltip"
            onMouseEnter={() =>
              ReactTooltip.show(
                document.getElementById("expo-structure-screen-new-intro")
              )
            }
            onMouseLeave={() => ReactTooltip.hide()}
          />
        </div>
      )}
      <Subheader className="add-menu-header" primaryText="Obrazovka" primary />
      <div>
        {map(newScreen.SCREEN, s => (
          <ListItem
            key={s[0]}
            id={`expo-structure-screen-new-${s[0]}`}
            className="add-menu-item"
            style={{ marginBottom: 3 }}
            primaryText={s[1]}
            onClick={() => addScreen(rowNum, colNum, s[0], section)}
            data-tip={get(helpIconText, `EXPO_STRUCTURE_SCREEN_NEW_${s[0]}`)}
            data-for="expo-structure-screen-new-tooltip"
            onMouseEnter={() =>
              ReactTooltip.show(
                document.getElementById(`expo-structure-screen-new-${s[0]}`)
              )
            }
            onMouseLeave={() => ReactTooltip.hide()}
          />
        ))}
      </div>
      <Subheader className="add-menu-header" primaryText="Minihra" primary />
      <div>
        {map(newScreen.GAME, s => (
          <ListItem
            key={s[0]}
            id={`expo-structure-screen-new-${s[0]}`}
            className="add-menu-item"
            style={{ marginBottom: 3 }}
            primaryText={s[1]}
            onClick={() => addScreen(rowNum, colNum, s[0], section)}
            data-tip={get(helpIconText, `EXPO_STRUCTURE_SCREEN_NEW_${s[0]}`)}
            data-for="expo-structure-screen-new-tooltip"
            onMouseEnter={() =>
              ReactTooltip.show(
                document.getElementById(`expo-structure-screen-new-${s[0]}`)
              )
            }
            onMouseLeave={() => ReactTooltip.hide()}
          />
        ))}
      </div>
    </MenuButton>
  </div>
);

export default connect(
  null,
  { ...expoActions }
)(ScreenNew);
