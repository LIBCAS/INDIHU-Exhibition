import React from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { Prompt } from "react-router";
import { connect } from "react-redux";
import * as dialogActions from "../../actions/dialogActions";

import Loader from "../Loader";
import DeleteAccount from "./DeleteAccount";
import ExpoDelete from "./ExpoDelete";
import ExpoDuplicate from "./ExpoDuplicate";
import ExpoExport from "./ExpoExport";
import ExpoNew from "./ExpoNew";
import ExpoRename from "./ExpoRename";
import ExpoShare from "./ExpoShare";
import ExpoShareChangeOwner from "./ExpoShareChangeOwner";
import ExpoShareRemoveCollaborator from "./ExpoShareRemoveCollaborator";
import ExpoState from "./ExpoState";
import FileDelete from "./FileDelete";
import FileDeleteFolder from "./FileDeleteFolder";
import FileMove from "./FileMove";
import FileNewFolder from "./FileNewFolder";
import FileRename from "./FileRename";
import FileRenameFolder from "./FileRenameFolder";
import Info from "./Info";
import PasswordReset from "./PasswordReset";
import Registration from "./Registration";
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
      {loader && <Loader />}
      <DeleteAccount {...dialogProps} />
      <ExpoDelete {...dialogProps} />
      <ExpoDuplicate {...dialogProps} />
      <ExpoExport {...dialogProps} />
      <ExpoNew {...dialogProps} />
      <ExpoRename {...dialogProps} />
      <ExpoShare {...dialogProps} />
      <ExpoShareChangeOwner {...dialogProps} />
      <ExpoShareRemoveCollaborator {...dialogProps} />
      <ExpoState {...dialogProps} />
      <FileDelete {...dialogProps} />
      <FileDeleteFolder {...dialogProps} />
      <FileMove {...dialogProps} />
      <FileNewFolder {...dialogProps} />
      <FileRename {...dialogProps} />
      <FileRenameFolder {...dialogProps} />
      <Info {...dialogProps} />
      <PasswordReset {...dialogProps} />
      <Registration {...dialogProps} />
      <ScreenAuthorsAdd {...dialogProps} />
      {data &&
        data.role &&
        data.text &&
        <ScreenAuthorsChange {...dialogProps} />}
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
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    ({ dialog: { data }, app: { loader }, expo: { activeScreenEdited } }) => ({
      data,
      loader,
      activeScreenEdited
    }),
    {
      ...dialogActions
    }
  )
)(Dialogs);
