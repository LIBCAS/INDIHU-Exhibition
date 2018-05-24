import fetch from "../../utils/fetch";
import {
  EXPO_RENAME,
  EXPO_STATE_CHANGE,
  EXPO_DELETE,
  EXPO_ADD
} from "./../constants";
import { showLoader } from "./../appActions";
import { saveExpo, getExpositions } from "./expoActions";
import { structPrototype } from "../../enums/structPrototype";

export const newExpo = name => async dispatch => {
  dispatch(showLoader(true));
  try {
    const response = await fetch("/api/exposition/", {
      method: "POST",
      body: name
    });

    if (response.status === 200) {
      const expo = await response.json();
      await saveExpo({ ...expo, structure: structPrototype });

      return expo.id;
    }
    dispatch(showLoader(false));
    return false;
  } catch (error) {
    dispatch(showLoader(false));
    return false;
  }
};

export const renameExpo = (id, name) => async dispatch => {
  dispatch(showLoader(true));
  try {
    const response = await fetch(`/api/exposition/${id}`);

    if (response.status === 200) {
      const expo = await response.json();
      expo.title = name;
      if (await saveExpo({ ...expo, structure: JSON.parse(expo.structure) })) {
        dispatch({
          type: EXPO_RENAME,
          payload: {
            id,
            title: name
          }
        });
        dispatch(showLoader(false));
        return expo.id;
      }

      dispatch(showLoader(false));
      return false;
    }
  } catch (error) {
    console.log(error);
  }

  dispatch(showLoader(false));
  return false;
};

export const changeStateExpo = (id, state) => async dispatch => {
  dispatch(showLoader(true));
  try {
    const response = await fetch(`/api/exposition/${id}`);

    if (response.status === 200) {
      const expo = await response.json();
      expo.state = state;
      if (await saveExpo({ ...expo, structure: JSON.parse(expo.structure) })) {
        dispatch({
          type: EXPO_STATE_CHANGE,
          payload: {
            id,
            state
          }
        });
        dispatch(showLoader(false));
        return expo.id;
      }

      dispatch(showLoader(false));
      return false;
    }
  } catch (error) {
    console.log(error);
  }

  dispatch(showLoader(false));
  return false;
};

export const deleteExpo = id => async dispatch => {
  dispatch(showLoader(true));
  try {
    const response = await fetch(`/api/exposition/${id}`, { method: "DELETE" });

    if (response.status === 200) {
      dispatch({
        type: EXPO_DELETE,
        payload: {
          id
        }
      });
      dispatch(showLoader(false));
      return true;
    }

    dispatch(showLoader(false));
    return false;
  } catch (error) {
    dispatch(showLoader(false));
    return false;
  }
};

export const duplicateExpo = (name, id) => async (dispatch, getState) => {
  dispatch(showLoader(true));
  try {
    const response = await fetch("/api/exposition/", {
      method: "POST",
      body: name
    });

    if (response.status === 200) {
      const expoNew = await response.json();

      const response2 = await fetch(`/api/exposition/${id}`);

      if (response2.status === 200) {
        const expoOld = await response2.json();

        if (
          await saveExpo({
            ...expoNew,
            structure: JSON.parse(expoOld.structure),
            state: expoOld.state
          })
        ) {
          await dispatch({
            type: EXPO_ADD,
            payload: { ...expoNew }
          });

          await dispatch(getExpositions(true));

          dispatch(showLoader(false));
          return true;
        }
      }
    }

    dispatch(showLoader(false));
    return false;
  } catch (error) {
    dispatch(showLoader(false));
    return false;
  }
};
