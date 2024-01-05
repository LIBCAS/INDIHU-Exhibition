import { useState } from "react";
import { useDispatch } from "react-redux";

// Components
import DialogWrap from "../dialog-wrap-noredux-typed";

// Models
import { AppDispatch } from "store/store";
import { UserInfoObj } from "reducers/user-reducer";
import { UserTableStateObj } from "containers/users/Users";

// Actions
import { rejectUser, getUsers } from "actions/admin-actions";

// - -

type UserRejectDialogProps = {
  closeThisDialog: () => void;
  currUser: UserInfoObj;
  userTableState: UserTableStateObj;
};

export const UserRejectDialog = ({
  closeThisDialog,
  currUser,
  userTableState,
}: UserRejectDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isSubmitSucc, setIsSubmitSucc] = useState<boolean>(false);

  const handleUserRejectSubmit = async () => {
    const isSucc = await dispatch(rejectUser(currUser.id));
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
      title="Zamítnutí užívatele"
      handleSubmit={handleUserRejectSubmit}
      closeOnEsc
      closeAfterSuccessfulSubmit
      isSubmitSuccessful={isSubmitSucc}
      submitLabel="Zamietnuť"
    >
      <div>
        <p>
          {`Užívatel ${
            currUser.userName ?? ""
          } bude zamítnut. POZOR! Akce je nevratná`}
        </p>
      </div>
    </DialogWrap>
  );
};
