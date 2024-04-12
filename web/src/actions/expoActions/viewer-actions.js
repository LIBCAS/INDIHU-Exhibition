import fetch from "../../utils/fetch";
import {
  EXPO_VIEWER,
  EXPO_VIEW_PROGRESS_UPDATE,
  EXPO_TOOLTIP_INFO_UPDATE,
  EXPO_VOLUMES_UPDATE,
  EXPO_SCREENS_INFO_UPDATE,
} from "../constants";
import { screenUrl } from "../../enums/screen-type";
import { tickTime } from "constants/view-screen-progress";

// Load into viewExpo!! Used in expo-viewer.tsx!
export const loadExposition = (url) => async (dispatch) => {
  try {
    const response = await fetch(`/api/exposition/u/${url}`);
    const body = await response.text();

    // If fetching non existing exposition (url is invalid), then response is status 200 and empty body
    // Empty body will cause store.expo.viewExpo to be not set and thus stay null!!
    if (body) {
      const viewExpo = await JSON.parse(body);

      if (viewExpo.state === "ENDED" || viewExpo.state === "PREPARE") {
        if ("structure" in viewExpo) {
          dispatch({
            type: EXPO_VIEWER,
            payload: {
              viewExpo: {
                ...viewExpo,
                structure: JSON.parse(viewExpo.structure),
              },
            },
          });
        } else {
          dispatch({ type: EXPO_VIEWER, payload: { viewExpo: viewExpo } });
        }

        return viewExpo;
      }

      if (viewExpo.state === "OPENED") {
        dispatch({
          type: EXPO_VIEWER,
          payload: {
            viewExpo: {
              ...viewExpo,
              structure: JSON.parse(viewExpo.structure),
            },
          },
        });

        return viewExpo;
      }
    }

    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Load into viewScreen!
export const loadScreen = (section, screen) => async (dispatch, getState) => {
  const expo = getState().expo.viewExpo;
  if (!expo || !expo.structure || (screen && !expo.structure.screens)) {
    return false;
  }

  const viewScreen =
    screen !== undefined
      ? expo.structure.screens[section]
        ? expo.structure.screens[section][screen]
        : null
      : section === screenUrl.FINISH
      ? { ...expo.structure[screenUrl.START], ...expo.structure[section] }
      : expo.structure[section];

  if (viewScreen) {
    await dispatch({
      type: EXPO_VIEWER,
      payload: { viewScreen },
    });

    return viewScreen;
  }

  await dispatch({
    type: EXPO_VIEWER,
    payload: { viewScreen: null },
  });

  return false;
};

/**
 * Sets new values for the viewProgress
 */
export const setViewProgress = (values) => (dispatch) => {
  dispatch({
    type: EXPO_VIEW_PROGRESS_UPDATE,
    payload: values,
  });
};

/**
 * Sets new values for the viewProgress
 */
export const tickProgress = () => (dispatch, getState) => {
  const viewProgress = getState().expo.viewProgress;

  if (!viewProgress.shouldIncrement || viewProgress.screenFilesLoading) {
    return;
  }

  const newValues = {
    ...viewProgress,
    timeElapsed: viewProgress.timeElapsed + tickTime,
  };

  dispatch({
    type: EXPO_VIEW_PROGRESS_UPDATE,
    payload: newValues,
  });
};

export const setTooltipInfo = (values) => (dispatch) => {
  dispatch({
    type: EXPO_TOOLTIP_INFO_UPDATE,
    payload: values,
  });
};

export const setScreensInfo = (screensInfo) => (dispatch) => {
  dispatch({
    type: EXPO_SCREENS_INFO_UPDATE,
    payload: screensInfo,
  });
};

export const setExpoVolumes = (volumeObj) => (dispatch) => {
  dispatch({
    type: EXPO_VOLUMES_UPDATE,
    payload: volumeObj,
  });
};

export const muteVolumes = (expoVolumes) => (dispatch) => {
  const speechVolume = expoVolumes.speechVolume;
  const musicVolume = expoVolumes.musicVolume;

  // if not already muted
  if (speechVolume.actualVolume !== 0) {
    dispatch(
      setExpoVolumes({
        speechVolume: {
          previousVolume: speechVolume.actualVolume,
          actualVolume: 0,
        },
      })
    );
  }

  // if not already muted
  if (musicVolume.actualVolume !== 0) {
    dispatch(
      setExpoVolumes({
        musicVolume: {
          previousVolume: musicVolume.actualVolume,
          actualVolume: 0,
        },
      })
    );
  }
};

export const unmuteVolumes = (expoVolumes) => (dispatch) => {
  const speechVolume = expoVolumes.speechVolume;
  const musicVolume = expoVolumes.musicVolume;

  if (
    speechVolume.previousVolume !== 0 &&
    speechVolume.previousVolume > speechVolume.actualVolume
  ) {
    dispatch(
      setExpoVolumes({
        speechVolume: {
          previousVolume: speechVolume.previousVolume,
          actualVolume: speechVolume.previousVolume,
        },
      })
    );
  }

  if (
    musicVolume.previousVolume !== 0 &&
    musicVolume.previousVolume > musicVolume.actualVolume
  ) {
    dispatch(
      setExpoVolumes({
        musicVolume: {
          previousVolume: musicVolume.previousVolume,
          actualVolume: musicVolume.previousVolume,
        },
      })
    );
  }
};
