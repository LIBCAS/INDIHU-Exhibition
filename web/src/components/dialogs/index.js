import React from "react";
import { compose, withHandlers, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { Prompt } from "react-router";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import ReactTooltip from "react-tooltip";
import * as dialogActions from "../../actions/dialogActions";

import Loader from "../Loader";
import ConfirmDialog from "./ConfirmDialog";
import DeleteAccount from "./DeleteAccount";
import ExpoDelete from "./ExpoDelete";
import ExpoDuplicate from "./ExpoDuplicate";
import ExpoExport from "./ExpoExport";
import ExpoNew from "./ExpoNew";
import ExpoRename from "./ExpoRename";
import ExpoShare from "./ExpoShare";
import ExpoShareChangeOwner from "./ExpoShareChangeOwner";
import ExpoShareRemoveCollaborator from "./ExpoShareRemoveCollaborator";
import ExpositionMenu from "./ExpositionMenu";
import ExpoState from "./ExpoState";
import FileDelete from "./FileDelete";
import FileDeleteFolder from "./FileDeleteFolder";
import FileMove from "./FileMove";
import FileNewFolder from "./FileNewFolder";
import FileRename from "./FileRename";
import FileRenameFolder from "./FileRenameFolder";
import FilesManagerMenu from "./FilesManagerMenu";
import Info from "./Info";
import PasswordReset from "./PasswordReset";
import ScreenAuthorsAdd from "./ScreenAuthorsAdd";
import ScreenAuthorsChange from "./ScreenAuthorsChange";
import ScreenDelete from "./ScreenDelete";
import ScreenDocumentChange from "./ScreenDocumentChange";
import ScreenDocumentChoose from "./ScreenDocumentChoose";
import ScreenDuplicate from "./ScreenDuplicate";
import ScreenFileChoose from "./ScreenFileChoose";
import ScreenDocumentNew from "./ScreenDocumentNew";
import ScreenLink from "./ScreenLink";
import ScreenMove from "./ScreenMove";
import UserAccept from "./UserAccept";
import UserDelete from "./UserDelete";
import UserReactivate from "./UserReactivate";
import ViewWrapChapters from "./ViewWrapChapters";

const Dialogs = ({
  setDialog,
  closeDialog,
  addDialogData,
  data,
  history,
  loader,
  activeScreenEdited
}) => {
  const dialogProps = {
    setDialog,
    closeDialog,
    addDialogData,
    dialogData: data,
    history
  };
  return (
    <div>
      <Prompt
        when={activeScreenEdited}
        message="Provedené úpravy obrazovky nebyly uloženy. Opravdu chcete opustit stránku?"
      />
      <ReactTooltip
        type="dark"
        effect="solid"
        id="react-tooltip-for-help-icon-in-dialog"
        place="right"
        className="help-icon-react-tooltip"
      />
      {loader && <Loader />}
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
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    ({
      dialog: { dialogs, data },
      app: { loader },
      expo: { activeScreenEdited }
    }) => ({
      dialogs,
      data,
      loader,
      activeScreenEdited
    }),
    {
      ...dialogActions
    }
  ),
  withHandlers({
    manageKeyAction: ({ dialogs, closeDialog }) => e => {
      if (e.keyCode === 27 && !isEmpty(dialogs)) {
        closeDialog();
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      const { manageKeyAction } = this.props;

      document.addEventListener("keydown", manageKeyAction);
    },
    componentWillUnmount() {
      const { manageKeyAction } = this.props;

      document.removeEventListener("keydown", manageKeyAction);
    }
  })
)(Dialogs);
