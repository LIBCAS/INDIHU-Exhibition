import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import Table from "./table";
import Button from "react-md/lib/Buttons/Button";

import { AppState, AppDispatch } from "store/store";
import { ActiveExpo } from "models";

import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

const stateSelector = createSelector(
  ({ user }: AppState) => user.info,
  (userInfo) => ({ userInfo: userInfo })
);

// - -

type ExpoSharingProps = {
  activeExpo: ActiveExpo;
};

const ExpoSharing = ({ activeExpo }: ExpoSharingProps) => {
  const { userInfo } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const isCurrentUserAuthor = activeExpo.author.id === userInfo.id;

  return (
    <div className="container container-tabMenu flex flex-col">
      <p className="ml-4 font-bold">Sdíleno s uživateli</p>
      <Table
        collaborators={activeExpo.collaborators}
        author={activeExpo.author}
        isCurrentUserAuthor={isCurrentUserAuthor}
      />
      <br />
      <Button
        icon
        className="color-black"
        onClick={() =>
          dispatch(
            setDialog(DialogType.ExpoShare, {
              expoId: activeExpo.id,
              author: activeExpo.author,
            })
          )
        }
      >
        add
      </Button>
    </div>
  );
};

export default ExpoSharing;
