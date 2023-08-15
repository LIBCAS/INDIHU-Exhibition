import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { change } from "redux-form";
import MenuButton from "react-md/lib/Menus/MenuButton";
import ListItem from "react-md/lib/Lists/ListItem";
import Divider from "react-md/lib/Dividers";
import FontIcon from "react-md/lib/FontIcons";

import { setDialog } from "../../../actions/dialog-actions";
import { openViewer } from "../../../utils";
import { screenType } from "../../../enums/screen-type";

const ScreenCardMenu = ({
  name,
  type,
  rowNum,
  colNum,
  setDialog,
  history,
  cardType,
  viewUrl,
  editUrl,
  change,
  expoId,
  aloneScreen,
  position,
}) => {
  return (
    <div className="card-menu">
      <MenuButton
        id="screen-card-menu-card-menu"
        flat
        buttonChildren="more_vert"
        position={position || "tl"}
      >
        {type !== screenType.FINISH && (
          <ListItem
            primaryText="Upravit"
            onClick={() => history.push(editUrl)}
          />
        )}
        <ListItem
          primaryText={type === "START" ? "Náhled celé výstavy" : "Náhled"}
          rightIcon={<FontIcon className="color-black">open_in_new</FontIcon>}
          onClick={() =>
            openViewer(
              type === "START" || type === "FINISH"
                ? `/view/${viewUrl}/${type === "START" ? "start" : "finish"}`
                : `/screen/${expoId}/${rowNum}/${colNum}`
            )
          }
        />
        {cardType && (
          <div>
            <ListItem
              primaryText="Přesunout"
              onClick={() => {
                change("ScreenMove", "rowNum", rowNum);
                change("ScreenMove", "colNum", colNum);
                change("ScreenMove", "aloneScreen", !!aloneScreen);
                setDialog("ScreenMove", {
                  rowNum,
                  colNum,
                  aloneScreen: !!aloneScreen,
                  type,
                });
              }}
            />
            <ListItem
              primaryText="Duplikovat"
              onClick={() => {
                change("ScreenDuplicate", "rowNum", rowNum);
                change("ScreenDuplicate", "colNum", colNum);
                setDialog("ScreenDuplicate", { rowNum, colNum });
              }}
            />
          </div>
        )}
        <ListItem
          primaryText="Získat odkaz obrazovky"
          onClick={() =>
            setDialog("ScreenLink", {
              link:
                type === "START"
                  ? `${viewUrl}/start`
                  : type === "FINISH"
                  ? `${viewUrl}/finish`
                  : `${viewUrl}/${rowNum}/${colNum}`,
            })
          }
        />
        {cardType && (
          <div>
            <Divider />
            <ListItem
              primaryText="Smazat"
              rightIcon={<FontIcon className="color-black">delete</FontIcon>}
              onClick={() =>
                setDialog("ScreenDelete", { name, rowNum, colNum, type })
              }
            />
          </div>
        )}
      </MenuButton>
    </div>
  );
};

export default withRouter(connect(null, { setDialog, change })(ScreenCardMenu));
