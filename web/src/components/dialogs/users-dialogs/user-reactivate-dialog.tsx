import { useState } from "react";
import { useDispatch } from "react-redux";

// Components
import DialogWrap from "../dialog-wrap-noredux-typed";

// Models
import { AppDispatch } from "store/store";
import { UserInfoObj } from "reducers/user-reducer";
import { UserTableStateObj } from "containers/users/Users";

// Actions
import { reactivateUser, getUsers } from "actions/admin-actions";

// - -

type UserReactivateDialogProps = {
  closeThisDialog: () => void;
  currUser: UserInfoObj;
  userTableState: UserTableStateObj;
};

export const UserReactivateDialog = ({
  closeThisDialog,
  currUser,
  userTableState,
}: UserReactivateDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isSubmitSucc, setIsSubmitSucc] = useState<boolean>(false);

  const handleUserReactivateSubmit = async () => {
    const isSucc = await dispatch(reactivateUser(currUser.id));
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
      title="Reaktivace uživatele"
      handleSubmit={handleUserReactivateSubmit}
      closeOnEsc
      closeAfterSuccessfulSubmit
      isSubmitSuccessful={isSubmitSucc}
      submitLabel="Aktivovat"
    >
      <div>
        <p>{`Užívatel ${currUser.userName} bude reaktivován.`}</p>
      </div>
    </DialogWrap>
  );
};
