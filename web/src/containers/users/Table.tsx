import { useState, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

// Components
import {
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { UserAcceptDialog } from "components/dialogs/users-dialogs/user-accept-dialog";
import { UserRejectDialog } from "components/dialogs/users-dialogs/user-reject-dialog";
import { UserDeleteDialog } from "components/dialogs/users-dialogs/user-delete-dialog";
import { UserReactivateDialog } from "components/dialogs/users-dialogs/user-reactivate-dialog";

// Models
import { AllUsers, UserInfoObj } from "reducers/user-reducer";
import { UserTableStateObj } from "./Users";

// - -

type UserAcceptDialogStatus = {
  currUser: UserInfoObj;
  userTableState: UserTableStateObj;
} | null;

type UserRejectDialogStatus = {
  currUser: UserInfoObj;
  userTableState: UserTableStateObj;
} | null;

type UserDeleteDialogStatus = {
  currUser: UserInfoObj;
  userTableState: UserTableStateObj;
} | null;

type UserReactivateDialogStatus = {
  currUser: UserInfoObj;
  userTableState: UserTableStateObj;
} | null;

// - -

type TableProps = {
  usersAll: AllUsers;
  userTableState: UserTableStateObj;
  userName: string; // current logged in userName
};

const Table = ({ usersAll, userTableState }: TableProps) => {
  const { t } = useTranslation("users");

  const [userAcceptDialog, setUserAcceptDialog] =
    useState<UserAcceptDialogStatus>(null);

  const [userRejectDialog, setUserRejectDialog] =
    useState<UserRejectDialogStatus>(null);

  const [userDeleteDialog, setUserDeleteDialog] =
    useState<UserDeleteDialogStatus>(null);

  const [userReactivateDialog, setUserReactivateDialog] =
    useState<UserReactivateDialogStatus>(null);

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
            {usersAll.list.map((currUser) => {
              // NOTE: User is deleted if contains timestamp of deletion in .deleted attribute (and also deletedUser flag is set ot true)
              // When user is deleted, then the .state attribute is the previous state before deletion
              // If user is not deleted, its current state corresponds to the .state attribute
              return (
                <TableRow
                  key={currUser.id}
                  sx={{
                    height: "46px",
                    backgroundColor: currUser.deleted ? "lightgray" : "white",
                  }}
                >
                  <TableCell align="left">{currUser.userName}</TableCell>

                  <TableCell align="left">{currUser.firstName}</TableCell>

                  <TableCell align="left">{currUser.surname}</TableCell>

                  <TableCell align="left">{currUser.email}</TableCell>

                  <TableCell align="left">{currUser.institution}</TableCell>

                  <TableCell align="left">
                    {/* {t(`usersState.${currUser.state.toLowerCase()}`)} */}
                    {t(`usersState.${currUser.state.toLowerCase()}`)}
                  </TableCell>

                  {/* Action cell */}
                  <TableCell align="center">
                    <div className="w-full flex gap-0 justify-center items-center">
                      {currUser.state === "TO_ACCEPT" && !currUser.deleted && (
                        <>
                          <Button
                            onClick={() => {
                              setUserAcceptDialog({
                                currUser: currUser,
                                userTableState: userTableState,
                              });
                            }}
                          >
                            <Icon
                              useMaterialUiIcon
                              name="done"
                              tooltip={{
                                id: "accept-user-icon",
                                content: t("usersAction.accept"),
                                variant: "dark",
                              }}
                            />
                          </Button>

                          <Button
                            onClick={() => {
                              setUserRejectDialog({
                                currUser: currUser,
                                userTableState: userTableState,
                              });
                            }}
                          >
                            <Icon
                              useMaterialUiIcon
                              name="highlight_off"
                              tooltip={{
                                id: "reject-user-icon",
                                content: t("usersAction.reject"),
                                variant: "dark",
                              }}
                            />
                          </Button>
                        </>
                      )}
                      {currUser.state === "ACCEPTED" && !currUser.deleted && (
                        <>
                          <Button
                            onClick={() => {
                              setUserRejectDialog({
                                currUser: currUser,
                                userTableState: userTableState,
                              });
                            }}
                          >
                            <Icon
                              useMaterialUiIcon
                              name="highlight_off"
                              tooltip={{
                                id: "reject-user-icon",
                                content: t("usersAction.reject"),
                                variant: "dark",
                              }}
                            />
                          </Button>
                        </>
                      )}
                      {currUser.state === "REJECTED" && !currUser.deleted && (
                        <Button
                          onClick={() => {
                            setUserAcceptDialog({
                              currUser: currUser,
                              userTableState: userTableState,
                            });
                          }}
                        >
                          <Icon
                            useMaterialUiIcon
                            name="done"
                            tooltip={{
                              id: "accept-user-icon",
                              content: t("usersAction.accept"),
                              variant: "dark",
                            }}
                          />
                        </Button>
                      )}
                      {!currUser.deleted && (
                        <DeleteUserButton
                          currUser={currUser}
                          setUserDeleteDialog={setUserDeleteDialog}
                          userTableState={userTableState}
                        />
                      )}
                      {currUser.deleted && (
                        <Button
                          onClick={() => {
                            setUserReactivateDialog({
                              currUser: currUser,
                              userTableState: userTableState,
                            });
                          }}
                        >
                          <Icon
                            useMaterialUiIcon
                            name="refresh"
                            tooltip={{
                              id: "reactivate-user-icon",
                              content: t("usersAction.reactivate"),
                              variant: "dark",
                            }}
                          />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {/* DIALOGS */}
      {userAcceptDialog !== null && (
        <UserAcceptDialog
          closeThisDialog={() => setUserAcceptDialog(null)}
          currUser={userAcceptDialog.currUser}
          userTableState={userAcceptDialog.userTableState}
        />
      )}

      {userRejectDialog !== null && (
        <UserRejectDialog
          closeThisDialog={() => setUserRejectDialog(null)}
          currUser={userRejectDialog.currUser}
          userTableState={userRejectDialog.userTableState}
        />
      )}

      {userDeleteDialog !== null && (
        <UserDeleteDialog
          closeThisDialog={() => setUserDeleteDialog(null)}
          currUser={userDeleteDialog.currUser}
          userTableState={userDeleteDialog.userTableState}
        />
      )}

      {userReactivateDialog !== null && (
        <UserReactivateDialog
          closeThisDialog={() => setUserReactivateDialog(null)}
          currUser={userReactivateDialog.currUser}
          userTableState={userReactivateDialog.userTableState}
        />
      )}
    </div>
  );
};

export default Table;

// - - -

type DeleteUserButtonProps = {
  currUser: UserInfoObj;
  setUserDeleteDialog: Dispatch<SetStateAction<UserDeleteDialogStatus>>;
  userTableState: UserTableStateObj;
};

const DeleteUserButton = ({
  currUser,
  setUserDeleteDialog,
  userTableState,
}: DeleteUserButtonProps) => {
  const { t } = useTranslation("users");

  return (
    <Button
      onClick={() => {
        setUserDeleteDialog({
          currUser: currUser,
          userTableState: userTableState,
        });
      }}
    >
      <Icon
        useMaterialUiIcon
        name="delete"
        tooltip={{
          id: "delete-user-icon",
          content: t("usersAction.delete"),
          variant: "dark",
        }}
      />
    </Button>
  );
};
