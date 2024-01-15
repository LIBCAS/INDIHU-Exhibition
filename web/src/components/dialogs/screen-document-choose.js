import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose, withHandlers, withState, withProps } from "recompose";
import { get } from "lodash";

import Dialog from "./dialog-wrap";
import Header from "../../containers/expo-administration/expo-files/header";
import FileManager from "../../containers/expo-administration/expo-files/file-manager";
import FileMeta from "../../containers/expo-administration/expo-files/file-meta";
import FileView from "../../containers/expo-administration/expo-files/file-view";
import * as fileActions from "../../actions/file-actions";
import {
  keyShortcutsEnhancer,
  sortFilterFiles,
} from "../../containers/expo-administration/expo-files/utils";
import { useTranslation, withTranslation } from "react-i18next";

const ScreenDocumentChoose = ({
  handleSubmit,
  dialogData,
  activeFile,
  activeFolder,
  files,
  tabFolder,
  tabFile,
  keyState,
  setKeyState,
  sort,
  setSort,
  order,
  setOrder,
  containerID,
}) => {
  const { t } = useTranslation("expo", {
    keyPrefix: "screenDocumentChooseDialog",
  });

  const onClose = () => {
    tabFolder(null);
  };

  return (
    <Dialog
      title={t("title")}
      name="ScreenDocumentChoose"
      submitLabel={t("submitLabel")}
      handleSubmit={handleSubmit}
      onClose={onClose}
      className="large"
    >
      <Header
        onFileAdd={() => setKeyState(!keyState)}
        sort={sort}
        setSort={setSort}
        order={order}
        setOrder={setOrder}
        accept={get(dialogData, "accept")}
      />
      <div className="files-row">
        <div className="files-wrap--manager">
          <FileManager
            id={containerID}
            sort={sort}
            setSort={setSort}
            dialog={{ name: "ScreenDocumentChoose", data: dialogData }}
            files={files}
            activeFile={activeFile}
            activeFolder={activeFolder}
            tabFolder={tabFolder}
            tabFile={tabFile}
            typeMatch={dialogData && dialogData.typeMatch}
            key={`files-file-manager-state-${keyState}`}
          />
          {dialogData && dialogData.error && <p>{dialogData.error}</p>}
        </div>
        <div className="files-col">
          <div className="files-wrap--view">
            <FileView activeFile={activeFile} activeFolder={activeFolder} />
          </div>
          <div className="files-wrap--meta">
            <FileMeta activeFile={activeFile} />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default compose(
  connect(
    ({ expo: { activeExpo }, file: { folder, file }, dialog: { name } }) => ({
      activeExpo,
      activeFolder: folder,
      activeFile: file,
      dialogName: name,
    }),
    { ...fileActions }
  ),
  withState("keyState", "setKeyState", true),
  withState("sort", "setSort", "CREATED"),
  withState("order", "setOrder", "ASC"),
  withProps(({ dialogName, activeExpo, sort, order, dialogData }) => ({
    containerID: "screen-document-choose-files-manager",
    shortcutsEnabled: dialogName === "ScreenDocumentChoose",
    files: sortFilterFiles(
      activeExpo,
      sort,
      order,
      get(dialogData, "typeMatch")
    ),
  })),
  keyShortcutsEnhancer,
  withTranslation("expo", { keyPrefix: "screenDocumentChoose" }),
  withHandlers({
    onSubmit:
      (dialog) =>
      async (
        formData,
        dispatch,
        { activeFile, dialogData: { onChoose }, t }
      ) => {
        if (activeFile) {
          if (onChoose) {
            onChoose(activeFile);
          }
          dialog.closeDialog();
        } else
          dialog.addDialogData("ScreenDocumentChoose", {
            error: t("errorText"),
          });
      },
  }),
  reduxForm({
    form: "screenDocumentChoose",
  })
)(ScreenDocumentChoose);
