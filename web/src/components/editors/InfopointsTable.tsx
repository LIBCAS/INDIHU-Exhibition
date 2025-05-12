import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { FontIcon, Button } from "react-md";
import Checkbox from "@mui/material/Checkbox";
import { setDialog } from "actions/dialog-actions";
import { Infopoint } from "models";
import { DialogType } from "components/dialogs/dialog-types";

import InfopointDialogNew from "components/dialogs/infopoint-dialog/InfopointDialogNew";
import InfopointDialogEdit from "components/dialogs/infopoint-dialog/InfopointDialogEdit";

import cx from "classnames";

// - - - - - - - -

interface InfopointsTableProps {
  title?: string;
  infopoints: Infopoint[];
  onInfopointAdd: (dialogFormData: any) => void;
  onInfopointEdit: (infopointIndexToEdit: number, dialogFormData: any) => void;
  onInfopointDelete: (infopointIndexToDelete: number) => void;
  onInfopointAlwaysVisibleChange: (
    infopointIndexToEdit: number,
    newIsAlwaysVisibleValue: boolean
  ) => void;
}

interface InfopointEditDialogStatus {
  isInfopointDialogEditOpen: boolean;
  infopoint: Infopoint | undefined;
  infopointIndex: number | undefined;
}

// - - - - - - -

const InfopointsTable = ({
  title,
  infopoints,
  onInfopointAdd,
  onInfopointEdit,
  onInfopointDelete,
  onInfopointAlwaysVisibleChange,
}: InfopointsTableProps) => {
  const { t } = useTranslation("expo-editor");

  const dispatch = useDispatch();

  const [isInfopointDialogNewOpen, setIsInfopointDialogNewOpen] =
    useState<boolean>(false);

  const closeInfopointDialogNew = () => {
    setIsInfopointDialogNewOpen(false);
  };

  const [infopointEditDialog, setInfopointEditDialog] =
    useState<InfopointEditDialogStatus>({
      isInfopointDialogEditOpen: false,
      infopoint: undefined,
      infopointIndex: undefined,
    });

  const closeInfopointDialogEdit = () => {
    setInfopointEditDialog({
      isInfopointDialogEditOpen: false,
      infopoint: undefined,
      infopointIndex: undefined,
    });
  };

  return (
    <div className="mt-4 min-w-[50%]">
      <div>{title ?? t("infopointsTable.defaultTitle")}</div>
      <div className="w-full flex flex-col px-4 py-2 mb-4">
        {/* Table header */}
        <div className="table-row header">
          <div className="table-col small">{t("infopointsTable.descCol")}</div>
          <div className="table-col small">
            {t("infopointsTable.alwaysVisibleCol")}
          </div>
        </div>

        {/* One table row for each infopoint */}
        {infopoints.map((infopoint, infopointIndex) => (
          <div key={infopointIndex} className="table-row">
            <div className="table-col">
              <div
                className={cx("infopoint-edit-description", {
                  italic:
                    infopoint.bodyContentType === "TEXT" &&
                    !infopoint.text &&
                    !infopoint.header,
                })}
              >
                {infopoint.bodyContentType === "IMAGE"
                  ? infopoint.imageFile?.name ??
                    t("infopointsTable.unknownImagePreviewText")
                  : infopoint.bodyContentType === "VIDEO"
                  ? infopoint.videoFile?.name ??
                    t("infopointsTable.unknownVideoPreviewText")
                  : infopoint.bodyContentType === "TEXT"
                  ? infopoint.text
                    ? infopoint.text
                    : infopoint.header
                    ? infopoint.header
                    : t("infopointsTable.unknownTextPreview")
                  : ""}
              </div>
            </div>
            <div className="table-col small">
              <Checkbox
                checked={infopoint.alwaysVisible ?? false}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const newAlwaysVisibleValue = event.target.checked;
                  onInfopointAlwaysVisibleChange(
                    infopointIndex,
                    newAlwaysVisibleValue
                  );
                }}
                sx={{ "& .MuiSvgIcon-root": { fontSize: 24 } }}
              />
            </div>
            <div className="table-col very-small flex-right">
              <FontIcon
                className="icon"
                onClick={() => {
                  setInfopointEditDialog({
                    isInfopointDialogEditOpen: true,
                    infopoint: infopoint,
                    infopointIndex: infopointIndex,
                  });
                }}
              >
                edit
              </FontIcon>
              <FontIcon
                className="icon"
                onClick={() => {
                  dispatch(
                    setDialog(DialogType.ConfirmDialog, {
                      title: (
                        <FontIcon className="color-black">delete</FontIcon>
                      ),
                      text: "Opravdu chcete odstranit zvolený infopoint?",
                      onSubmit: () => onInfopointDelete(infopointIndex),
                    })
                  );
                }}
              >
                delete
              </FontIcon>
            </div>
          </div>
        ))}
      </div>

      <Button
        icon
        className="color-black"
        onClick={() => setIsInfopointDialogNewOpen(true)}
      >
        add
      </Button>

      {/* Dialogs */}
      {isInfopointDialogNewOpen && (
        <InfopointDialogNew
          closeThisDialog={closeInfopointDialogNew}
          onDialogSubmit={onInfopointAdd}
        />
      )}

      {infopointEditDialog.isInfopointDialogEditOpen &&
        infopointEditDialog.infopoint &&
        infopointEditDialog.infopointIndex !== undefined && (
          <InfopointDialogEdit
            closeThisDialog={closeInfopointDialogEdit}
            onDialogSubmit={onInfopointEdit}
            infopoint={infopointEditDialog.infopoint}
            infopointIndex={infopointEditDialog.infopointIndex}
          />
        )}
    </div>
  );
};

export default InfopointsTable;
