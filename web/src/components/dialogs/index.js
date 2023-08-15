import { compose, withHandlers, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { Prompt } from "react-router";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Tooltip as ReactTooltip } from "react-tooltip";

import * as dialogActions from "../../actions/dialog-actions";
import { setImageEditor } from "../../actions/app-actions";
import Loader from "../loader";
import ConfirmDialog from "./confirm-dialog";
import DeleteAccount from "./delete-account";
import ExpoDelete from "./expo-delete";
import ExpoDuplicate from "./expo-duplicate";
import ExpoExport from "./expo-export";
import ExpoNew from "./expo-new";
import ExpoRename from "./expo-rename";
import ExpoShare from "./expo-share";
import ExpoShareChangeOwner from "./expo-share-change-owner";
import ExpoShareRemoveCollaborator from "./expo-share-remove-collaborator";
import ExpositionMenu from "./exposition-menu";
import ExpoState from "./expo-state";
import FileDelete from "./file-delete";
import FileDeleteFolder from "./file-delete-folder";
import FileMove from "./file-move";
import FileNewFolder from "./file-new-folder";
import FileRename from "./file-rename";
import FileRenameFolder from "./file-rename-folder";
import FilesManagerMenu from "./files-manager-menu";
import ImageEditorSave from "./image-editor-save";
import Info from "./info";
import PasswordReset from "./password-reset";
import ScreenAuthorsAdd from "./screen-authors-add";
import ScreenAuthorsChange from "./screen-authors-change";
import ScreenDelete from "./screen-delete";
import ScreenDocumentChange from "./screen-document-change";
import ScreenDocumentChoose from "./screen-document-choose";
import ScreenDuplicate from "./screen-duplicate";
import ScreenFileChoose from "./screen-file-choose";
import ScreenDocumentNew from "./screen-document-new";
import ScreenLink from "./screen-link";
import ScreenMove from "./screen-move";
import UserAccept from "./user-accept";
import UserDelete from "./user-delete";
import UserReactivate from "./user-reactivate";
import ViewWrapChapters from "./view-wrap-chapters";
import ImageEditor from "../image-editor";
import { ChaptersDialog } from "./chapters-dialog/chapters-dialog";
import { FilesDialog } from "./files-dialog/files-dialog";
import { WorksheetsDialog } from "./worksheets-dialog/worksheets-dialog";
import { ExpoInfoDialog } from "./expo-info-dialog/expo-info-dialog";
import { ShareExpoDialog } from "./share-expo-dialog/share-expo-dialog";
import { FinishInfoDialog } from "./finish-info-dialog/finish-info-dialog";
import { FinishAllFilesDialog } from "./finish-all-files-dialog/finish-all-files-dialog";
import { AudioDialog } from "./audio-dialog/audio-dialog";
import { RatingDialog } from "./rating-dialog/rating-dialog";
import { SettingsDialog } from "./settings-dialog/settings-dialog";

export { default as WarningDialog } from "./warning-dialog";

const Dialogs = ({
  setDialog,
  closeDialog,
  addDialogData,
  dialogs,
  name,
  data,
  history,
  loader,
  activeScreenEdited,
  imageEditor,
}) => {
  const dialogProps = {
    setDialog,
    closeDialog,
    addDialogData,
    dialogs,
    dialogName: name,
    dialogData: data,
    history,
  };

  return (
    <div>
      <Prompt
        when={activeScreenEdited}
        message="Provedené úpravy obrazovky nebyly uloženy. Opravdu chcete opustit stránku?"
      />
      <ReactTooltip
        variant="dark"
        float={false}
        id="react-tooltip-for-help-icon-in-dialog"
        place="right"
        className="help-icon-react-tooltip"
      />
      {loader && <Loader />}
      <FinishInfoDialog {...dialogProps} />
      <FinishAllFilesDialog {...dialogProps} />
      <ShareExpoDialog {...dialogProps} />
      <ExpoInfoDialog {...dialogProps} />
      <FilesDialog {...dialogProps} />
      <WorksheetsDialog {...dialogProps} />
      <ChaptersDialog {...dialogProps} />
      <AudioDialog {...dialogProps} />
      <RatingDialog {...dialogProps} />
      <SettingsDialog {...dialogProps} />

      <ConfirmDialog {...dialogProps} />
      <DeleteAccount {...dialogProps} />
      <ExpoDelete {...dialogProps} />
      <ExpoDuplicate {...dialogProps} />
      <ExpoExport {...dialogProps} />
      <ExpoNew {...dialogProps} />
      <ExpoRename {...dialogProps} />
      <ExpoShare {...dialogProps} />
      <ExpoShareChangeOwner {...dialogProps} />
      <ExpoShareRemoveCollaborator {...dialogProps} />
      <ExpositionMenu {...dialogProps} />
      <ExpoState {...dialogProps} />
      <FileDelete {...dialogProps} />
      <FileDeleteFolder {...dialogProps} />
      <FileMove {...dialogProps} />
      <FileNewFolder {...dialogProps} />
      <FileRename {...dialogProps} />
      <FileRenameFolder {...dialogProps} />
      <FilesManagerMenu {...dialogProps} />
      <ImageEditorSave {...dialogProps} />
      <Info {...dialogProps} />
      <PasswordReset {...dialogProps} />
      <ScreenAuthorsAdd {...dialogProps} />
      {data && data.role && data.text && (
        <ScreenAuthorsChange {...dialogProps} />
      )}
      <ScreenDelete {...dialogProps} />
      {data && <ScreenDocumentChange {...dialogProps} />}
      <ScreenDocumentChoose {...dialogProps} />
      <ScreenDocumentNew {...dialogProps} />
      <ScreenDuplicate {...dialogProps} />
      <ScreenFileChoose {...dialogProps} />
      <ScreenLink {...dialogProps} />
      <ScreenMove {...dialogProps} />
      <UserAccept {...dialogProps} />
      <UserDelete {...dialogProps} />
      <UserReactivate {...dialogProps} />
      <ViewWrapChapters {...dialogProps} />
      {imageEditor && <ImageEditor {...imageEditor} />}
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    ({
      dialog: { dialogs, name, data },
      app: { loader, imageEditor },
      expo: { activeScreenEdited },
    }) => ({
      dialogs,
      name,
      data,
      loader,
      imageEditor,
      activeScreenEdited,
    }),
    {
      ...dialogActions,
      setImageEditor,
    }
  ),
  withHandlers({
    manageKeyAction:
      ({ dialogs, closeDialog }) =>
      (e) => {
        if (e.keyCode === 27 && !isEmpty(dialogs)) {
          closeDialog();
        }
      },
  }),
  lifecycle({
    UNSAFE_componentWillMount() {
      const { manageKeyAction } = this.props;

      document.addEventListener("keydown", manageKeyAction);
    },
    componentWillUnmount() {
      const { manageKeyAction } = this.props;

      document.removeEventListener("keydown", manageKeyAction);
    },
  })
)(Dialogs);
