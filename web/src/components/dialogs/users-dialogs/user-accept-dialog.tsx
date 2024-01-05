import { useState } from "react";
import { useDispatch } from "react-redux";

// Components
import DialogWrap from "../dialog-wrap-noredux-typed";

// Models
import { AppDispatch } from "store/store";
import { UserInfoObj } from "reducers/user-reducer";
import { UserTableStateObj } from "containers/users/Users";

// Actions
import { acceptUser, getUsers } from "actions/admin-actions";

// - -

type UserAcceptDialogProps = {
  closeThisDialog: () => void;
  currUser: UserInfoObj;
  userTableState: UserTableStateObj;
};

export const UserAcceptDialog = ({
  closeThisDialog,
  currUser,
  userTableState,
}: UserAcceptDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isSubmitSucc, setIsSubmitSucc] = useState<boolean>(false);

  const handleUserAcceptSubmit = async () => {
    const isSucc = await dispatch(acceptUser(currUser.id));
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
      title="Schválení uživatele"
      handleSubmit={handleUserAcceptSubmit}
      closeOnEsc
      closeAfterSuccessfulSubmit
      isSubmitSuccessful={isSubmitSucc}
      submitLabel="Akceptovat"
    >
      <div>
        <p>
          {`Užívatel ${
            currUser.userName ?? ""
          } bude schválen. POZOR! Akce je nevratná`}
        </p>
      </div>
    </DialogWrap>
  );
};
