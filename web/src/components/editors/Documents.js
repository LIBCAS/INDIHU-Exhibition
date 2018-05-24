import React from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import HelpIcon from "../HelpIcon";

import { setDialog } from "../../actions/dialogActions";
import { removeScreenDocument } from "../../actions/expoActions";
import { tabFolder } from "../../actions/fileActions";
import { changeSwitchState } from "../../actions/appActions";

import { helpIconText } from "../../enums/text";

const Documents = ({
  activeScreen,
  setDialog,
  removeScreenDocument,
  tabFolder,
  changeSwitchState
}) =>
  <div className="container container-tabMenu">
    <div className="screen">
      {activeScreen &&
        !isEmpty(activeScreen.documents) &&
        <div className="flex-row-nowrap">
          <div className="table margin-bottom">
            <div className="table-row header">
              <div className="table-col">Název</div>
              <div className="table-col">Soubor</div>
              <div className="table-col">Typ</div>
              <div className="table-col" />
            </div>
            {activeScreen.documents.map((item, i) =>
              <div className="table-row" key={i}>
                <div className="table-col">
                  {item.fileName}
                </div>
                <div className="table-col">
                  {item.name || item.url}
                </div>
                <div className="table-col">
                  {item.name ? item.type : item.urlType}
                </div>
                <div className="table-col flex-right">
                  <FontIcon
                    onClick={() => {
                      tabFolder(null);
                      changeSwitchState(!!(item.name && item.name !== ""));
                      setDialog("ScreenDocumentChange", item);
                    }}
                  >
                    mode_edit
                  </FontIcon>
                  <FontIcon onClick={() => removeScreenDocument(item)}>
                    delete
                  </FontIcon>
                </div>
              </div>
            )}
          </div>
          <HelpIcon {...{ label: helpIconText.EDITOR_DOCUMENTS }} />
        </div>}
      <Button
        icon
        onClick={() => {
          tabFolder(null);
          changeSwitchState(true);
          setDialog("ScreenDocumentNew");
        }}
      >
        add
      </Button>
    </div>
  </div>;

export default connect(null, {
  setDialog,
  removeScreenDocument,
  tabFolder,
  changeSwitchState
})(Documents);
