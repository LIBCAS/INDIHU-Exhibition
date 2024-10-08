import { compose, withHandlers, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { Prompt } from "react-router";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Tooltip as ReactTooltip } from "react-tooltip";

import * as dialogActions from "../../actions/dialog-actions";
import { setImageEditor } from "../../actions/app-actions";

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
import ViewWrapChapters from "./view-wrap-chapters";
import ImageEditor from "../image-editor";

const Dialogs = ({
  setDialog,
  closeDialog,
  addDialogData,
  dialogs,
  name,
  data,
  history,
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
      {/* Problematic ScreenFileChoose and ScreenDocumentChoose */}
      <ScreenFileChoose {...dialogProps} />
      <ScreenDocumentChoose {...dialogProps} />
      <ScreenDocumentNew {...dialogProps} />
      <ScreenDuplicate {...dialogProps} />
      <ScreenLink {...dialogProps} />
      <ScreenMove {...dialogProps} />
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
      app: { imageEditor },
      expo: { activeScreenEdited },
    }) => ({
      dialogs,
      name,
      data,
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
