import { isEmpty, findIndex, get, filter } from "lodash";

import { saveExpo, loadExpo } from "./index";
import { showLoader } from "../app-actions";

import {
  EXPO_SCREEN_SET,
  EXPO_SCREEN_UPDATE,
  EXPO_SCREEN_COLLABORATORS_ADD,
  EXPO_SCREEN_COLLABORATORS_DELETE,
  EXPO_SCREEN_COLLABORATORS_CHANGE,
  EXPO_SCREEN_COLLABORATORS_SWAP,
  EXPO_SCREEN_DOCUMENT_ADD,
  EXPO_SCREEN_DOCUMENT_CHANGE,
  EXPO_SCREEN_DOCUMENT_DELETE,
  EXPO_SCREEN_DOCUMENT_SWAP,
  EXPO_STRUCTURE_SET,
  EXPO_STRUCTURE_SCREEN_SET,
  EXPOSITIONS,
  EXPO_EDITOR_UPDATE,
  EXPO_SCREEN_DB_UPDATE,
} from "../constants";

import { objectsEqual } from "../../utils";
import { screenType } from "../../enums/screen-type";

export const loadScreen = (url) => async (dispatch, getState) => {
  const expo = getState().expo.activeExpo;
  const structure = expo.structure;
  if (!structure) setTimeout(() => dispatch(loadScreen(url)), 2000);
  else {
    const type =
      /.+\/screen\/.+\/.+\/(description|authors|documents|image|images|video|sequence|slideshow|photogallery|parallax|text|answers|externalData|references)/.test(
        url
      )
        ? url.match(
            /.+\/screen\/.+\/(.+)\/(description|authors|documents|image|images|video|sequence|slideshow|photogallery|parallax|text|answers|externalData|references)/
          )[1]
        : url.match(
            /.+\/screen\/(.+)\/(description|authors|documents|image|images|video|sequence|slideshow|photogallery|parallax|text|answers|externalData|references)/
          )[1];

    const sfType =
      type === "start" ? "start" : type === "finish" ? "finish" : null;
    const position = sfType ? null : type.match(/(.*)-(.*)/);

    const activeScreen = sfType
      ? structure[sfType]
      : structure.screens[position[1]][position[2]];

    // Current screen load means that the current screen is being set to redux store.activeScreen
    // and also to store.activeScreenDb.. so i can later compare whether there were some changes made do original screen mount
    dispatch({
      type: EXPO_SCREEN_SET,
      payload: {
        activeScreen: activeScreen,
        activeScreenDb: activeScreen,
      },
    });
  }
};

export const saveScreen =
  (activeScreen, rowNum, colNum) => async (dispatch, getState) => {
    await dispatch(showLoader(true));

    if (activeScreen.type === screenType.SLIDESHOW) {
      activeScreen = {
        ...activeScreen,
        images: filter(
          activeScreen.images,
          (image) => image && image.id && image.imageOrigData
        ),
      };
    } else if (activeScreen.type === screenType.PARALLAX) {
      activeScreen = {
        ...activeScreen,
        images: filter(activeScreen.images, (image) => image),
      };
    }

    if (activeScreen.type === screenType.START) {
      await dispatch({
        type: EXPO_STRUCTURE_SET,
        payload: { start: activeScreen },
      });
    } else if (activeScreen.type === screenType.FINISH) {
      await dispatch({
        type: EXPO_STRUCTURE_SET,
        payload: { finish: activeScreen },
      });
    } else {
      await dispatch({
        type: EXPO_STRUCTURE_SCREEN_SET,
        payload: {
          screen: activeScreen,
          rowNum: parseInt(rowNum, 10),
          colNum: parseInt(colNum, 10),
        },
      });
    }

    const expo = getState().expo.activeExpo;

    const wasExpoSavedSucc =
      activeScreen.type === screenType.START
        ? await saveExpo({
            ...expo,
            organization: activeScreen.organization,
          })
        : await saveExpo(expo);

    if (wasExpoSavedSucc) {
      dispatch(setActiveScreenEdited(false));
      dispatch(setActiveScreenDb(activeScreen));
    }

    loadExpo(expo.id);
    await dispatch(showLoader(false));

    return wasExpoSavedSucc;
  };

export const setActiveScreenEdited = (activeScreenEdited = true) => {
  return {
    type: EXPOSITIONS,
    payload: { activeScreenEdited },
  };
};

const setActiveScreenDb = (newActiveScreenDb) => ({
  type: EXPO_SCREEN_DB_UPDATE,
  payload: { activeScreenDb: newActiveScreenDb },
});

export const updateScreenData = (data) => async (dispatch, getState) => {
  // Data to update are empty or nullish
  if (isEmpty(data) || data === null || data === undefined) {
    dispatch({
      type: EXPO_SCREEN_UPDATE,
      payload: null,
    });
    console.log("data nullish, setting false");
    dispatch(setActiveScreenEdited(false));
    return;
  }

  // state from last screen save or from screen mount, state of screen as it is currently stored in DB
  const activeScreenDb = get(getState(), "expo.activeScreenDb");

  // state with screen with current changes, not stored in database yet
  const activeScreen = get(getState(), "expo.activeScreen");
  const newActiveScreen = { ...activeScreen, ...data };

  // Execute the change with non-nullish data
  dispatch({
    type: EXPO_SCREEN_UPDATE,
    payload: { ...data },
  });

  //
  if (
    activeScreenDb &&
    !isEmpty(activeScreenDb) &&
    !objectsEqual(activeScreenDb, newActiveScreen)
  ) {
    console.log("change from db, setting true");
    dispatch(setActiveScreenEdited(true));
  } else {
    console.log("no change from db, setting false");
    dispatch(setActiveScreenEdited(false));
  }
};

export const addScreenCollaborators = (collaborators) => ({
  type: EXPO_SCREEN_COLLABORATORS_ADD,
  payload: collaborators,
});

export const changeScreenCollaborators = (
  collaboratorsNew,
  collaboratorsOld
) => ({
  type: EXPO_SCREEN_COLLABORATORS_CHANGE,
  payload: { collaboratorsNew, collaboratorsOld },
});

export const swapScreenCollaborators = (collaborators1, collaborators2) => ({
  type: EXPO_SCREEN_COLLABORATORS_SWAP,
  payload: { collaborators1, collaborators2 },
});

export const removeScreenCollaborators = (collaborators) => ({
  type: EXPO_SCREEN_COLLABORATORS_DELETE,
  payload: collaborators,
});

export const addScreenDocument = (document) => async (dispatch, getState) => {
  const documents = getState().expo.activeScreen.documents;

  if (
    !isEmpty(documents) &&
    findIndex(documents, (d) => d.fileName === document.fileName) >= 0
  )
    return false;

  dispatch({
    type: EXPO_SCREEN_DOCUMENT_ADD,
    payload: document,
  });

  return true;
};

export const changeScreenDocument =
  (documentNew, documentOld) => (dispatch, getState) => {
    const documents = getState().expo.activeScreen.documents;

    if (
      documentNew.fileName !== documentOld.fileName &&
      findIndex(documents, (d) => d.fileName === documentNew.fileName) >= 0
    ) {
      return false;
    }

    dispatch({
      type: EXPO_SCREEN_DOCUMENT_CHANGE,
      payload: { documentNew, documentOld },
    });

    return true;
  };

export const swapScreenDocuments = (index1, index2) => ({
  type: EXPO_SCREEN_DOCUMENT_SWAP,
  payload: { index1, index2 },
});

export const removeScreenDocument = (document) => async (dispatch) => {
  dispatch({
    type: EXPO_SCREEN_DOCUMENT_DELETE,
    payload: document,
  });
};

export const updateStartAuthorsFilter =
  (filter) => async (dispatch, getState) => {
    dispatch({
      type: EXPO_EDITOR_UPDATE,
      payload: {
        startAuthorsFilter: {
          ...getState().expo.expoEditor.startAuthorsFilter,
          ...filter,
        },
      },
    });
  };
