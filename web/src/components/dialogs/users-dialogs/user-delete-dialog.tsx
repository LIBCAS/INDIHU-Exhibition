import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation, Trans } from "react-i18next";

// Components
import DialogWrap from "../dialog-wrap-noredux-typed";

// Models
import { AppDispatch } from "store/store";
import { UserInfoObj } from "reducers/user-reducer";
import { UserTableStateObj } from "containers/users/Users";

// Actions
import { deleteUser, getUsers } from "actions/admin-actions";

// - -

type UserDeleteDialogProps = {
  closeThisDialog: () => void;
  currUser: UserInfoObj;
  userTableState: UserTableStateObj;
};

export const UserDeleteDialog = ({
  closeThisDialog,
  currUser,
  userTableState,
}: UserDeleteDialogProps) => {
  const { t } = useTranslation("users", { keyPrefix: "deleteUserDialog" });
  const dispatch = useDispatch<AppDispatch>();

  const [isSubmitSucc, setIsSubmitSucc] = useState<boolean>(false);

  const handleUserDeleteSubmit = async () => {
    const isSucc = await dispatch(deleteUser(currUser.id));
    if (isSucc) {
      await dispatch(
        getUsers(
          userTableState.page,
          userTableState.pageSize,
          userTableState.filter,
          userTableState.sort,
          userTableState.search
        )
      );
      setIsSubmitSucc(true);
    }
  };

  return (
    <DialogWrap
      closeThisDialog={closeThisDialog}
      title={t("title")}
      handleSubmit={handleUserDeleteSubmit}
      closeOnEsc
      closeAfterSuccessfulSubmit
      isSubmitSuccessful={isSubmitSucc}
      submitLabel={t("submitLabel")}
    >
      <div>
        <p>
          <Trans
            t={t}
            i18nKey={"content"}
            values={{ userName: currUser.userName }}
          />
        </p>
      </div>
    </DialogWrap>
  );
};
