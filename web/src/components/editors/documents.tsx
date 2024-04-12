import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

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
import { screenType } from "enums/screen-type";

type DocumentsProps = {
  activeScreen: Screen;
};

const Documents = ({ activeScreen }: DocumentsProps) => {
  const { t } = useTranslation("expo-editor");
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
              <div className="table-cell-second_5">
                {t("documentsTable.nameCol")}
              </div>
              <div className="table-cell-third_5">
                {t("documentsTable.fileUrlCol")}
              </div>
              <div className="table-cell-fourth_5">
                {t("documentsTable.typeCol")}
              </div>
              <div className="table-cell-fifth_5" />
            </div>

            {/* Table rows */}
            {screenDocuments.map((doc, docIndex) => {
              const docType =
                "type" in doc ? doc.type : "urlType" in doc ? doc.urlType : "";

              const docTypeString = docType.match(/^image/)
                ? t("documentsTable.imageLabel")
                : docType.match(/^audio/)
                ? t("documentsTable.audioLabel")
                : docType.match(/^video/)
                ? t("documentsTable.videoLabel")
                : docType.match(/^application\/pdf/)
                ? t("documentsTable.pdfLabel")
                : docType.match(/^WEB/)
                ? t("documentsTable.webLabel")
                : docType;

              const docFileType =
                "documentFileType" in doc ? doc.documentFileType : undefined;

              const docFileTypeString =
                docFileType === "exhibitionFile"
                  ? t("documentsTable.exhibitionFileLabel")
                  : docFileType === "worksheet"
                  ? t("documentsTable.worksheetFileLabel")
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

          <HelpIcon label={t("documentsTable.startScreenTableTooltip")} />
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
