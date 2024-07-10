import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

// Components
import { Button } from "components/button/button";
import { MoreVert } from "@mui/icons-material";

// Models
import { ExpositionItem, ActiveExpo } from "models";
import { AppState, AppDispatch } from "store/store";
import { ExpositionsFilterStateObj } from "./Expositions";

// Actions and utils
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
  expositionsFilterState: ExpositionsFilterStateObj;
};

const ExpoMenu = ({
  expositionItem,
  expositionsFilterState,
}: ExpoMenuProps) => {
  const { activeExpo, expositions } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Button
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
            expositionsFilterState: expositionsFilterState,
          })
        );
      }}
    >
      <MoreVert />
    </Button>
  );
};

export default ExpoMenu;
