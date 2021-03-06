import React from "react";
import Button from "react-md/lib/Buttons/Button";
import { forEach } from "lodash";
import SelectField from "react-md/lib/SelectFields";
import ReactTooltip from "react-tooltip";

import { compose, withHandlers, withState } from "recompose";
import { connect } from "react-redux";
import { setDialog } from "../../../actions/dialogActions";
import { addFile } from "../../../actions/fileActions";

import FileUploader from "../../form/FileUploader";
import HelpIcon from "../../HelpIcon";
import { helpIconText } from "../../../enums/text";

const Header = ({
  setDialog,
  handleFile,
  expoId,
  keyState,
  accept,
  sort,
  setSort,
  order,
  setOrder
}) => (
  <div className="flex-header">
    <div className="flex-header-inner">
      <div className="margin-right flex-row-normal flex-centered">
        <Button
          flat
          label="Nový adresář"
          onClick={() => setDialog("FileNewFolder")}
        >
          create_new_folder
        </Button>
        <FileUploader
          key={`file-uploader-${keyState ? "1" : "2"}`}
          url={`/api/file/?id=${expoId}`}
          onComplete={handleFile}
          accept={accept}
        >
          <Button flat label="Nahrát soubor">
            insert_drive_file
          </Button>
        </FileUploader>
        <HelpIcon
          {...{
            label: helpIconText.FILES_HEADER_UPLOAD_FILE,
            id: "files-header-upload-file"
          }}
        />
      </div>
      <div className="flex flex-centered">
        <SelectField
          id="users-selectfield-filter2"
          menuItems={[
            { label: "Vytvořeno", value: "CREATED" },
            { label: "Název", value: "NAME" }
          ]}
          itemLabel="label"
          itemValue="value"
          defaultValue={sort}
          position="below"
          onChange={value => setSort(value)}
          data-tip="Řazení"
          data-for="react-tooltip-expo-files-header"
        />
        <Button
          icon
          onClick={() => {
            ReactTooltip.hide();
            setOrder(order === "ASC" ? "DESC" : "ASC");
          }}
          data-tip={order === "ASC" ? "Sestupně" : "Vzestupně"}
          data-for="react-tooltip-expo-files-header"
          className="margin-left-small"
        >
          {order === "ASC" ? "arrow_downward" : "arrow_upward"}
        </Button>
        <ReactTooltip
          type="dark"
          effect="solid"
          id="react-tooltip-expo-files-header"
          className="help-icon-react-tooltip"
        />
      </div>
    </div>
  </div>
);

export default compose(
  connect(
    ({ expo: { activeExpo }, file: { folder } }) => ({
      expoId: activeExpo.id,
      activeFolder: folder
    }),
    { setDialog, addFile }
  ),
  withState("keyState", "setKeyState", false),
  withHandlers({
    handleFile: ({
      addFile,
      activeFolder,
      onFileAdd,
      keyState,
      setKeyState
    }) => files => {
      if (files) {
        forEach(files, file => addFile(file, activeFolder));
      }
      if (onFileAdd) onFileAdd();
      setKeyState(!keyState);
    }
  })
)(Header);
