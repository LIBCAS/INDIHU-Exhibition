import { useTranslation } from "react-i18next";

import { Fragment } from "react";
import { connect } from "react-redux";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";
import Subheader from "react-md/lib/Subheaders";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";

import * as expoActions from "../../../actions/expoActions";
import {
  mapScreenTypeValuesToKeys,
  screenCategories,
  screenType,
} from "../../../enums/screen-type";

// - -

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
}) => {
  const { t } = useTranslation("expo");

  return (
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
              primaryText={t("structure.screenCategoryLabels.chapter")}
              primary
            />
            <ListItem
              id="expo-structure-screen-new-intro"
              className="add-menu-item"
              primaryText={t("structure.screenLabels.start")}
              onClick={() => addScreen(rowNum, 0, screenType.INTRO, section)}
              data-tooltip-id="expo-structure-screen-new-tooltip"
              data-tooltip-content={t("structure.screenTooltips.intro")}
            />
          </div>
        )}
        {screenCategories.map(({ categoryId, screens }) => (
          <Fragment key={categoryId}>
            <Subheader
              className="add-menu-header"
              primaryText={t(
                `structure.screenCategoryLabels.${categoryId.toLowerCase()}`
              )}
              primary
            />
            <div>
              {screens.map(({ id }) => {
                return (
                  <ListItem
                    key={id}
                    id={`expo-structure-screen-new-${id}`}
                    className="add-menu-item"
                    style={{ marginBottom: 3 }}
                    primaryText={t(
                      `structure.screenLabels.${mapScreenTypeValuesToKeys[
                        id
                      ].toLowerCase()}`
                    )}
                    onClick={() => addScreen(rowNum, colNum, id, section)}
                    data-tooltip-id="expo-structure-screen-new-tooltip"
                    data-tooltip-content={t(
                      `structure.screenTooltips.${mapScreenTypeValuesToKeys[
                        id
                      ].toLowerCase()}`
                    )}
                  />
                );
              })}
            </div>
          </Fragment>
        ))}
      </MenuButton>
    </div>
  );
};

export default connect(null, { ...expoActions })(ScreenNew);
