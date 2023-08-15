import { connect } from "react-redux";
import { get, map } from "lodash";
import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";

import HelpIcon from "../help-icon";

import { setDialog } from "../../actions/dialog-actions";
import {
  removeScreenDocument,
  swapScreenDocuments,
} from "../../actions/expoActions";
import { tabFolder } from "../../actions/file-actions";
import { changeSwitchState } from "../../actions/app-actions";

import { helpIconText } from "../../enums/text";
import { fileTypeText } from "../../enums/file-type";

const Documents = ({
  activeScreen,
  isStartScreen,
  setDialog,
  removeScreenDocument,
  tabFolder,
  changeSwitchState,
  swapScreenDocuments,
}) => {
  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="flex-row-nowrap">
          <div className="table margin-bottom">
            {/* Table header */}
            <div className="table-row-new header">
              {get(activeScreen, "documents.length", 0) > 1 && (
                <div className="table-cell-first_5" />
              )}
              <div className="table-cell-second_5">Název</div>
              <div className="table-cell-third_5">Soubor/URL</div>
              <div className="table-cell-fourth_5">Typ</div>
              <div className="table-cell-fifth_5" />
            </div>

            {/* Table rows */}
            {map(get(activeScreen, "documents"), (item, i) => {
              const type = get(item, "type", get(item, "urlType", ""));

              const documentTypeString = type.match(/^image/)
                ? fileTypeText.IMAGE
                : type.match(/^audio/)
                ? fileTypeText.AUDIO
                : type.match(/^video/)
                ? fileTypeText.VIDEO
                : type.match(/^application\/pdf/)
                ? fileTypeText.PDF
                : type.match(/^WEB/)
                ? fileTypeText.WEB
                : type;

              const documentFileTypeString =
                item.documentFileType === "worksheet"
                  ? "Pracovní list"
                  : item.documentFileType === "exhibitionFile"
                  ? "Soubor k výstavě"
                  : "";

              return (
                <div className="table-row-new" key={i}>
                  {get(get(activeScreen, "documents"), "length", 0) > 1 && (
                    <div className="table-cell-first_5">
                      <FontIcon
                        onClick={() => swapScreenDocuments(i - 1, i)}
                        style={{
                          visibility: i > 0 ? "visible" : "hidden",
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
                              : "hidden",
                        }}
                        className="color-black"
                      >
                        keyboard_arrow_down
                      </FontIcon>
                    </div>
                  )}

                  <div className="table-cell-second_5">{item.fileName}</div>
                  <div className="table-cell-third_5">
                    {item.name || item.url}
                  </div>
                  <div className="table-cell-fourth_5">
                    {documentTypeString}
                    {isStartScreen && (
                      <>
                        <br />
                        {documentFileTypeString}
                      </>
                    )}
                  </div>

                  <div
                    className="table-cell-fifth_5 flex-right"
                    style={{ width: "10%", minWidth: "60px" }}
                  >
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
                          onSubmit: () => removeScreenDocument(item),
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

          <HelpIcon label={helpIconText.EDITOR_DOCUMENTS} />
        </div>

        {/* Add (+) button below the table */}
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
};

export default connect(null, {
  setDialog,
  removeScreenDocument,
  tabFolder,
  changeSwitchState,
  swapScreenDocuments,
})(Documents);
