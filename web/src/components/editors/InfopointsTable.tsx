import { useState } from "react";
import { useDispatch } from "react-redux";

import { FontIcon, Checkbox, Button } from "react-md";
import { setDialog } from "actions/dialog-actions";
import { Infopoint } from "models";
import { DialogType } from "components/dialogs/dialog-types";

import InfopointDialogNew from "components/dialogs/infopoint-dialog/InfopointDialogNew";
import InfopointDialogEdit from "components/dialogs/infopoint-dialog/InfopointDialogEdit";

// - - - - - - - -

interface InfopointsTableProps {
  title?: string;
  infopoints: Infopoint[];
  onInfopointAdd: (dialogFormData: any) => Promise<void>;
  onInfopointEdit: (
    infopointIndexToEdit: number,
    dialogFormData: any
  ) => Promise<void>;
  onInfopointDelete: (infopointIndexToDelete: number) => void;
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
}: InfopointsTableProps) => {
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
    <div className="table-infopoints half-width-min">
      <div>{title ?? "Infopointy"}</div>
      <div className="table margin-bottom-small">
        {/* Table header */}
        <div className="table-row header">
          <div className="table-col small">Popis</div>
          <div className="table-col small">Stále zobrazen</div>
        </div>

        {/* One table row for each infopoint */}
        {infopoints.map((infopoint, infopointIndex) => (
          <div key={infopointIndex} className="table-row">
            <div className="table-col">
              <div className="infopoint-edit-description">
                {infopoint.bodyContentType === "IMAGE"
                  ? infopoint.imageFile?.name ?? "Neuveden název obrázku"
                  : infopoint.bodyContentType === "VIDEO"
                  ? infopoint.videoFile?.name ?? "Neuveden název videa"
                  : infopoint.text ?? "Neuvedeno"}
              </div>
            </div>
            <div className="table-col small">
              <Checkbox
                id={`checkbox-infopoint-${infopointIndex}`}
                name="checkbox-infopoint"
                checked={infopoint.alwaysVisible}
                disabled
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
