import React from "react";
import { connect } from "react-redux";
import { get, map } from "lodash";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import HelpIcon from "../HelpIcon";

import { setDialog } from "../../actions/dialogActions";
import {
  removeScreenDocument,
  swapScreenDocuments
} from "../../actions/expoActions";
import { tabFolder } from "../../actions/fileActions";
import { changeSwitchState } from "../../actions/appActions";

import { helpIconText } from "../../enums/text";
import { fileTypeText } from "../../enums/fileType";

const Documents = ({
  activeScreen,
  setDialog,
  removeScreenDocument,
  tabFolder,
  changeSwitchState,
  swapScreenDocuments
}) => (
  <div className="container container-tabMenu">
    <div className="screen">
      <div className="flex-row-nowrap">
        <div className="table-with-help">
          <div className="table margin-bottom">
            <div className="table-row header">
              {get(activeScreen, "documents.length", 0) > 1 && (
                <div className="table-col" />
              )}
              <div className="table-col">Název</div>
              <div className="table-col">Soubor/URL</div>
              <div className="table-col">Typ</div>
              <div className="table-col" />
            </div>
            {map(get(activeScreen, "documents"), (item, i) => {
              const type = get(item, "type", get(item, "urlType", ""));

              return (
                <div className="table-row" key={i}>
                  {get(get(activeScreen, "documents"), "length", 0) > 1 && (
                    <div className="table-col">
                      <FontIcon
                        onClick={() => swapScreenDocuments(i - 1, i)}
                        style={{
                          visibility: i > 0 ? "visible" : "hidden"
                        }}
                        className="color-black"
                      >
                        keyboard_arrow_up
                      </FontIcon>
                      <FontIcon
                        onClick={() => swapScreenDocuments(i, i + 1)}
                        style={{
                          visibility:
                            i < get(activeScreen, "documents").length - 1
                              ? "visible"
                              : "hidden"
                        }}
                        className="color-black"
                      >
                        keyboard_arrow_down
                      </FontIcon>
                    </div>
                  )}
                  <div className="table-col">{item.fileName}</div>
                  <div className="table-col">{item.name || item.url}</div>
                  <div className="table-col">
                    {type.match(/^image/)
                      ? fileTypeText.IMAGE
                      : type.match(/^audio/)
                      ? fileTypeText.AUDIO
                      : type.match(/^video/)
                      ? fileTypeText.VIDEO
                      : type.match(/^application\/pdf/)
                      ? fileTypeText.PDF
                      : type.match(/^WEB/)
                      ? fileTypeText.WEB
                      : type}
                  </div>
                  <div className="table-col flex-right">
                    <FontIcon
                      onClick={() => {
                        tabFolder(null);
                        changeSwitchState(!!(item.name && item.name !== ""));
                        setDialog("ScreenDocumentChange", item);
                      }}
                      className="color-black"
                    >
                      mode_edit
                    </FontIcon>
                    <FontIcon
                      onClick={() =>
                        setDialog("ConfirmDialog", {
                          title: (
                            <FontIcon className="color-black">delete</FontIcon>
                          ),
                          text: "Opravdu chcete odstranit zvolený dokument?",
                          onSubmit: () => removeScreenDocument(item)
                        })
                      }
                      className="color-black"
                    >
                      delete
                    </FontIcon>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <HelpIcon {...{ label: helpIconText.EDITOR_DOCUMENTS }} />
      </div>
      <Button
        icon
        onClick={() => {
          tabFolder(null);
          changeSwitchState(true);
          setDialog("ScreenDocumentNew");
        }}
        className="color-black"
      >
        add
      </Button>
    </div>
  </div>
);

export default connect(
  null,
  {
    setDialog,
    removeScreenDocument,
    tabFolder,
    changeSwitchState,
    swapScreenDocuments
  }
)(Documents);
