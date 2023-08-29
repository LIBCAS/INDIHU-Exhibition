import { EXPOSITIONS, EXPO_SCREEN_UPDATE } from "actions/constants";

import { AppDispatch, AppState } from "store/store";
import { Screen } from "models";

import { isEmpty } from "lodash";
import { objectsEqual } from "utils";

export const setActiveScreenEdited = (activeScreenEdited = true) => ({
  type: EXPOSITIONS,
  payload: { activeScreenEdited },
});

export const updateScreenData =
  (data: any) => async (dispatch: AppDispatch, getState: () => AppState) => {
    if (isEmpty(data)) {
      dispatch({
        type: EXPO_SCREEN_UPDATE,
        payload: null,
      });
      dispatch(setActiveScreenEdited(false));
    }

    const activeScreen = getState().expo.activeScreen as Screen; // can be also empty object

    if (
      activeScreen &&
      !isEmpty(activeScreen) &&
      !objectsEqual({ ...activeScreen, ...data }, activeScreen)
    ) {
      dispatch({
        type: EXPO_SCREEN_UPDATE,
        payload: { ...data },
      });
      dispatch(setActiveScreenEdited());
    }
  };
