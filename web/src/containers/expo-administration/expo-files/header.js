import { useTranslation } from "react-i18next";
import Button from "react-md/lib/Buttons/Button";
import { forEach } from "lodash";
import SelectField from "react-md/lib/SelectFields";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { compose, withHandlers, withState } from "recompose";
import { connect } from "react-redux";
import { setDialog } from "../../../actions/dialog-actions";
import { addFile } from "../../../actions/file-actions";

import FileUploader from "../../../components/form/redux-form/file-uploader";
import HelpIcon from "../../../components/help-icon";

const Header = ({
  setDialog,
  handleFile,
  expoId,
  keyState,
  accept,
  sort,
  setSort,
  order,
  setOrder,
}) => {
  const { t } = useTranslation("expo");

  return (
    <div className="flex-header">
      <div className="flex-header-inner">
        <div className="margin-right flex-row-normal flex-centered">
          <Button
            flat
            label={t("files.newFolder")}
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
            <Button flat label={t("files.uploadFile")}>
              insert_drive_file
            </Button>
          </FileUploader>
          <HelpIcon
            label={t("files.uploadFileTooltip")}
            id="files-header-upload-file"
          />
        </div>
        <div className="flex flex-centered">
          <SelectField
            id="users-selectfield-filter2"
            menuItems={[
              { label: t("files.sorting.created"), value: "CREATED" },
              { label: t("files.sorting.name"), value: "NAME" },
            ]}
            itemLabel="label"
            itemValue="value"
            defaultValue={sort}
            position="below"
            onChange={(value) => setSort(value)}
            data-tooltip-content={t("files.sortingTooltip")}
            data-tooltip-id="react-tooltip-expo-files-header"
          />
          <Button
            icon
            onClick={() => {
              //ReactTooltip.hide();
              setOrder(order === "ASC" ? "DESC" : "ASC");
            }}
            data-tooltip-content={
              order === "ASC" ? t("files.orderASC") : t("files.orderDESC")
            }
            data-tooltip-id="react-tooltip-expo-files-header"
            className="margin-left-small"
          >
            {order === "ASC" ? "arrow_downward" : "arrow_upward"}
          </Button>
          <ReactTooltip
            variant="dark"
            float={false}
            id="react-tooltip-expo-files-header"
            className="help-icon-react-tooltip"
          />
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(
    ({ expo: { activeExpo }, file: { folder } }) => ({
      expoId: activeExpo.id,
      activeFolder: folder,
    }),
    { setDialog, addFile }
  ),
  withState("keyState", "setKeyState", false),
  withHandlers({
    handleFile:
      ({ addFile, activeFolder, onFileAdd, keyState, setKeyState }) =>
      (files) => {
        if (files) {
          forEach(files, (file) => addFile(file, activeFolder));
        }
        if (onFileAdd) onFileAdd();
        setKeyState(!keyState);
      },
  })
)(Header);
