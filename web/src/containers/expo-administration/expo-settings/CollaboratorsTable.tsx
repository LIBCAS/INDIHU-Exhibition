import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// Components
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import SelectField from "react-md/lib/SelectFields";

// Models
import { AuthorObj, CollaboratorObj } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { setDialog } from "actions/dialog-actions";
import { changeCollaboratorType } from "actions/expoActions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type CollaboratorsTableProps = {
  collaborators: CollaboratorObj[];
  author: AuthorObj;
  isCurrentUserAuthor: boolean;
  isCurrentUserAdmin: boolean;
  expoId: string;
};

const CollaboratorsTable = ({
  collaborators,
  author,
  isCurrentUserAuthor,
  isCurrentUserAdmin,
  expoId,
}: CollaboratorsTableProps) => {
  const { t } = useTranslation("expo");
  const dispatch = useDispatch<AppDispatch>();

  const canChangeTable = isCurrentUserAuthor || isCurrentUserAdmin;

  return (
    <div className="flex flex-col gap-4">
      <TableContainer>
        <Table
          aria-label="collaborators table"
          sx={{
            "& .MuiTableRow-root": {
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "#ececec",
              },
            },
            "& .MuiTableCell-root": {},
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="left">
                {t("settingsAndSharing.nameCol")}
              </TableCell>
              <TableCell align="left">
                {t("settingsAndSharing.emailCol")}
              </TableCell>
              <TableCell align="left">
                {t("settingsAndSharing.privilegesCol")}
              </TableCell>
              {canChangeTable && (
                <TableCell align="left">
                  {t("settingsAndSharing.actionCol")}
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& .MuiTableCell-root": {
                padding: "4px",
              },
            }}
          >
            {/* First row is author, then other collaborators */}
            {author && (
              <TableRow>
                <TableCell align="left">{`${author?.firstName ?? ""} ${
                  author?.surname ?? ""
                }`}</TableCell>
                <TableCell align="left">{author?.email ?? ""}</TableCell>
                <TableCell align="left">
                  {t("settingsAndSharing.owner")}
                </TableCell>
                {canChangeTable && (
                  <TableCell align="left">
                    <IconButton
                      onClick={() => {
                        dispatch(
                          setDialog(DialogType.ExpoShareChangeOwner, {})
                        );
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            )}

            {/* Other collaborators */}
            {collaborators?.map((currCollab, currCollabIndex) => (
              <TableRow key={currCollabIndex}>
                <TableCell align="left">{`${
                  currCollab?.collaborator?.firstName ?? ""
                } ${currCollab?.collaborator?.surname ?? ""}`}</TableCell>

                <TableCell align="left">
                  {currCollab?.collaborator?.email ||
                    currCollab?.userEmail ||
                    ""}
                </TableCell>

                <TableCell align="left">
                  {canChangeTable && (
                    <SelectField
                      className="table-select"
                      id="expo-sharing-selectfield-type"
                      menuItems={[
                        {
                          label: t("settingsAndSharing.reading"),
                          value: "READ_ONLY",
                        },
                        {
                          label: t("settingsAndSharing.readWrite"),
                          value: "EDIT",
                        },
                      ]}
                      itemLabel="label"
                      itemValue="value"
                      defaultValue={currCollab.collaborationType}
                      position="below"
                      onChange={(newPrivilege: string) =>
                        dispatch(
                          changeCollaboratorType(currCollab.id, newPrivilege)
                        )
                      }
                    />
                  )}
                  {!canChangeTable && (
                    <>
                      {currCollab.collaborationType === "READ_ONLY"
                        ? "Čtení"
                        : "Čtení a zápis"}
                    </>
                  )}
                </TableCell>

                {canChangeTable && (
                  <TableCell align="left">
                    <IconButton
                      onClick={() => {
                        dispatch(
                          setDialog(DialogType.ExpoShareRemoveCollaborator, {
                            id: currCollab.id,
                            name: currCollab?.collaborator?.username ?? null,
                          })
                        );
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add new collaborator button */}
      {canChangeTable && (
        <IconButton
          sx={{ width: "fit-content" }}
          onClick={() => {
            dispatch(
              setDialog(DialogType.ExpoShare, {
                expoId: expoId,
                author: author,
              })
            );
          }}
        >
          <Add sx={{ fontSize: "26px" }} />
        </IconButton>
      )}
    </div>
  );
};

export default CollaboratorsTable;
