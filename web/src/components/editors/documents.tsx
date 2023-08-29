import { useDispatch } from "react-redux";

import FontIcon from "react-md/lib/FontIcons";
import Button from "react-md/lib/Buttons/Button";
import HelpIcon from "components/help-icon";

import { Screen } from "models";
import { AppDispatch } from "store/store";

import { setDialog } from "actions/dialog-actions";
import { removeScreenDocument, swapScreenDocuments } from "actions/expoActions";
import { tabFolder } from "actions/file-actions";
import { changeSwitchState } from "actions/app-actions";

import { DialogType } from "components/dialogs/dialog-types";
import { helpIconText } from "enums/text";
import { fileTypeText } from "enums/file-type";
import { screenType } from "enums/screen-type";

type DocumentsProps = {
  activeScreen: Screen;
};

const Documents = ({ activeScreen }: DocumentsProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const isStartScreen = activeScreen.type === screenType.START;
  // game screens do not have documents
  const screenDocuments =
    "documents" in activeScreen && activeScreen.documents
      ? activeScreen.documents
      : [];

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="flex-row-nowrap">
          <div className="table margin-bottom">
            {/* Table header */}
            <div className="table-row-new header">
              {screenDocuments.length > 1 && (
                <div className="table-cell-first_5" />
              )}
              <div className="table-cell-second_5">Název</div>
              <div className="table-cell-third_5">Soubor/URL</div>
              <div className="table-cell-fourth_5">Typ</div>
              <div className="table-cell-fifth_5" />
            </div>

            {/* Table rows */}
            {screenDocuments.map((doc, docIndex) => {
              const docType =
                "type" in doc ? doc.type : "urlType" in doc ? doc.urlType : "";

              const docTypeString = docType.match(/^image/)
                ? fileTypeText.IMAGE
                : docType.match(/^audio/)
                ? fileTypeText.AUDIO
                : docType.match(/^video/)
                ? fileTypeText.VIDEO
                : docType.match(/^application\/pdf/)
                ? fileTypeText.PDF
                : docType.match(/^WEB/)
                ? fileTypeText.WEB
                : docType;

              const docFileType =
                "documentFileType" in doc ? doc.documentFileType : undefined;

              const docFileTypeString =
                docFileType === "exhibitionFile"
                  ? "Soubor k výstavě"
                  : docFileType === "worksheet"
                  ? "Pracovní list"
                  : "";

              return (
                <div className="table-row-new" key={docIndex}>
                  {screenDocuments.length > 1 && (
                    <div className="table-cell-first_5">
                      <FontIcon
                        onClick={() =>
                          dispatch(swapScreenDocuments(docIndex - 1, docIndex))
                        }
                        style={{
                          visibility: docIndex > 0 ? "visible" : "hidden",
                        }}
                        className="color-black"
                      >
                        keyboard_arrow_up
                      </FontIcon>
                      <FontIcon
                        onClick={() =>
                          dispatch(swapScreenDocuments(docIndex, docIndex + 1))
                        }
                        style={{
                          visibility:
                            docIndex < screenDocuments.length - 1
                              ? "visible"
                              : "hidden",
                        }}
                        className="color-black"
                      >
                        keyboard_arrow_down
                      </FontIcon>
                    </div>
                  )}

                  <div className="table-cell-second_5">{doc.fileName}</div>
                  <div className="table-cell-third_5">
                    {"name" in doc ? doc.name : "url" in doc ? doc.url : ""}
                  </div>
                  <div className="table-cell-fourth_5">
                    {docTypeString}
                    {isStartScreen && (
                      <>
                        <br />
                        {docFileTypeString}
                      </>
                    )}
                  </div>

                  <div
                    className="table-cell-fifth_5 flex-right"
                    style={{ width: "10%", minWidth: "60px" }}
                  >
                    <FontIcon
                      onClick={() => {
                        dispatch(tabFolder(null));
                        const docContainsName = !!(
                          "name" in doc &&
                          doc.name &&
                          doc.name !== ""
                        );
                        dispatch(changeSwitchState(docContainsName));
                        dispatch(
                          setDialog(DialogType.ScreenDocumentChange, doc)
                        );
                      }}
                      className="color-black"
                    >
                      mode_edit
                    </FontIcon>
                    <FontIcon
                      onClick={() => {
                        dispatch(
                          setDialog(DialogType.ConfirmDialog, {
                            title: (
                              <FontIcon className="color-black">
                                delete
                              </FontIcon>
                            ),
                            text: "Opravdu chcete odstranit zvolený dokument?",
                            onSubmit: () => dispatch(removeScreenDocument(doc)),
                          })
                        );
                      }}
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
            dispatch(tabFolder(null));
            dispatch(changeSwitchState(true));
            dispatch(setDialog(DialogType.ScreenDocumentNew, {}));
          }}
          className="color-black"
        >
          add
        </Button>
      </div>
    </div>
  );
};

export default Documents;
