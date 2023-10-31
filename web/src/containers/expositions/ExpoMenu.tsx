import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import { IconButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { ExpositionItem, ActiveExpo } from "models";
import { AppState, AppDispatch } from "store/store";

import { setDialog } from "../../actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.activeExpo as ActiveExpo,
  ({ expo }: AppState) => expo.expositions,
  (activeExpo, expositions) => ({ activeExpo, expositions })
);

// - -

type ExpoMenuProps = {
  expositionItem: ExpositionItem;
};

const ExpoMenu = ({ expositionItem }: ExpoMenuProps) => {
  const { activeExpo, expositions } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <IconButton
      id="expo-menu-card-action-menu"
      onClick={(e) => {
        e.stopPropagation();
        dispatch(
          setDialog(DialogType.ExpositionMenu, {
            id: expositionItem.id,
            title: expositionItem.title,
            url: expositionItem.url,
            canEdit: expositionItem.canEdit,
            canDelete: expositionItem.canDelete,
            state: expositionItem.state,
            inProgress: expositionItem.inProgress,
            activeExpo: activeExpo,
            expositions: expositions,
          })
        );
      }}
    >
      <MoreVert />
    </IconButton>
  );
};

export default ExpoMenu;
