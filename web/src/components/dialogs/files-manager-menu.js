import { connect } from "react-redux";
import { compose } from "recompose";
import { reduxForm } from "redux-form";
import { get } from "lodash";
import { Button, FontIcon } from "react-md";

import Dialog from "./dialog-wrap";
import { changeRadioState, setImageEditor } from "../../actions/app-actions";
import { setDialog } from "../../actions/dialog-actions";
import { downloadFileFromUrl } from "../../utils";

const FilesManagerMenu = ({
  dialogData,
  setDialog,
  closeDialog,
  changeRadioState,
  setImageEditor,
}) => (
  <Dialog
    title={get(dialogData, "file.name", "Soubor")}
    name="FilesManagerMenu"
    noDialogMenu={true}
    style={{ width: 300 }}
  >
    {dialogData && (
      <div className="flex-col flex-centered exposition-menu">
        {[
          {
            label: "Přejmenovat",
            children: <FontIcon>mode_edit</FontIcon>,
            onClick: () => {
              closeDialog();
              setDialog("FileRename", {
                id: dialogData.file.id,
                name: dialogData.file.name,
              });
            },
            show: true,
          },
          {
            label: "Přesunout",
            children: <FontIcon>content_copy</FontIcon>,
            onClick: () => {
              closeDialog();
              if (dialogData.folder.name)
                changeRadioState(`FOLDER_${dialogData.folder.name}`);
              else changeRadioState("ROOT");
              setDialog("FileMove", {
                file: dialogData.file,
                folder: dialogData.folder.name,
              });
            },
            show: get(dialogData, "files.length", 0) > 1,
          },
          {
            label: "Editovat",
            children: <FontIcon>palette</FontIcon>,
            onClick: () => {
              closeDialog();
              closeDialog();
              setImageEditor(dialogData.imageEditor);
            },
            show: /^image\/.*$/.test(get(dialogData, "file.type", "")),
          },
          {
            label: "Stáhnout",
            children: <FontIcon>get_app</FontIcon>,
            onClick: () => {
              closeDialog();
              downloadFileFromUrl(
                `${window.location.origin}/api/files/${dialogData.file.fileId}`
              );
            },
            show: true,
          },
          {
            label: "Smazat",
            children: <FontIcon>delete</FontIcon>,
            onClick: () => {
              closeDialog();
              setDialog("FileDelete", {
                id: dialogData.file.id,
                name: dialogData.file.name,
              });
            },
            show: true,
          },
        ]
          .filter(({ show }) => show)
          .map(({ show, ...button }) => (
            <Button
              key={button.label}
              flat
              className="exposition-menu-button"
              {...button}
            />
          ))}
      </div>
    )}
  </Dialog>
);

export default compose(
  connect(null, { setDialog, changeRadioState, setImageEditor }),
  reduxForm({
    form: "FilesManagerMenuForm",
  })
)(FilesManagerMenu);
