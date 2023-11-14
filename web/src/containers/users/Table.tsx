import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import {
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

// Models
import { AppDispatch } from "store/store";
import { AllUsers, UserTableType } from "reducers/user-reducer";

// Utils
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

type TableProps = {
  usersAll: AllUsers;
  tableType: UserTableType;
};

const Table = ({ usersAll, tableType }: TableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("users");

  return (
    <div>
      <TableContainer>
        <MuiTable
          aria-label="users-table"
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
              <TableCell align="left">{t("table.username")}</TableCell>
              <TableCell align="left">{t("table.firstname")}</TableCell>
              <TableCell align="left">{t("table.surname")}</TableCell>
              <TableCell align="left">{t("table.email")}</TableCell>
              <TableCell align="left">{t("table.institution")}</TableCell>
              <TableCell align="left">{t("table.state")}</TableCell>
              <TableCell align="center">{t("table.action")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& .MuiTableCell-root": {
                padding: "4px",
              },
            }}
          >
            {usersAll.list.map((currUser) => (
              <TableRow key={currUser.id} sx={{ height: "46px" }}>
                <TableCell align="left">
                  {tableType === "ALL"
                    ? currUser.userName
                    : currUser.toAccept?.userName}
                </TableCell>

                <TableCell align="left">
                  {tableType === "ALL"
                    ? currUser.firstName
                    : currUser.toAccept?.firstName}
                </TableCell>

                <TableCell align="left">
                  {tableType === "ALL"
                    ? currUser.surname
                    : currUser.toAccept?.surname}
                </TableCell>

                <TableCell align="left">
                  {tableType === "ALL"
                    ? currUser.email
                    : currUser.toAccept?.email}
                </TableCell>

                <TableCell align="left">
                  {tableType === "ALL"
                    ? currUser.institution
                    : currUser.toAccept?.institution}
                </TableCell>

                <TableCell align="left">
                  {t(`usersState.${currUser.state.toLowerCase()}`)}
                </TableCell>

                {/* Action cell */}
                <TableCell align="center">
                  {tableType === "ALL" && currUser.state === "DELETED" && (
                    <IconButton
                      onClick={() => {
                        dispatch(
                          setDialog(DialogType.UserReactivate, {
                            id: currUser.id,
                            name: currUser.userName,
                          })
                        );
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  )}

                  {tableType === "ALL" && currUser.state !== "DELETED" && (
                    <IconButton
                      onClick={() => {
                        dispatch(
                          setDialog(DialogType.UserDelete, {
                            id: currUser.id,
                            name: currUser.userName,
                          })
                        );
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}

                  {tableType === "FOR_ACCEPT" && (
                    <div className="flex gap-0 justify-center items-center">
                      {currUser.state === "TO_ACCEPT" && (
                        <>
                          <IconButton
                            onClick={() => {
                              dispatch(
                                setDialog(DialogType.UserAccept, {
                                  user: currUser,
                                })
                              );
                            }}
                          >
                            <DoneIcon />
                          </IconButton>

                          <IconButton
                            onClick={() => {
                              console.log("clicked");
                            }}
                          >
                            <HighlightOffIcon />
                          </IconButton>
                        </>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </div>
  );
};

export default Table;
