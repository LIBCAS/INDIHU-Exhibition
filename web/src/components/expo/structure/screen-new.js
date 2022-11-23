import { Fragment } from "react";
import { get } from "lodash";
import { connect } from "react-redux";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";
import Subheader from "react-md/lib/Subheaders";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import ReactTooltip from "react-tooltip";

import * as expoActions from "../../../actions/expoActions";
import { screenCategories, screenType } from "../../../enums/screen-type";
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
  style,
}) => (
  <div
    className="structure-screen-new-menu"
    style={{ cursor: "auto", ...style }}
  >
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
      {screenCategories.map(({ categoryId, categoryName, screens }) => (
        <Fragment key={categoryId}>
          <Subheader
            className="add-menu-header"
            primaryText={categoryName}
            primary
          />
          <div>
            {screens.map(({ id, name }) => (
              <ListItem
                key={id}
                id={`expo-structure-screen-new-${id}`}
                className="add-menu-item"
                style={{ marginBottom: 3 }}
                primaryText={name}
                onClick={() => addScreen(rowNum, colNum, id, section)}
                data-tip={get(helpIconText, `EXPO_STRUCTURE_SCREEN_NEW_${id}`)}
                data-for="expo-structure-screen-new-tooltip"
                onMouseEnter={() =>
                  ReactTooltip.show(
                    document.getElementById(`expo-structure-screen-new-${id}`)
                  )
                }
                onMouseLeave={() => ReactTooltip.hide()}
              />
            ))}
          </div>
        </Fragment>
      ))}
    </MenuButton>
  </div>
);

export default connect(null, { ...expoActions })(ScreenNew);
