import fetch from "../../utils/fetch";
import {
  EXPO_COLLABORATOR_DELETE,
  EXPO_COLLABORATOR_TYPE
} from "./../constants";
import { loadExpo } from "./expoActions";

export const addCollaborators = (collaborator, type, invite, expoId) => async (
  dispatch,
  getState
) => {
  try {
    const response = await fetch(
      `/api/colaborators/?collaborators=${collaborator}&expositionId=${expoId}&type=${type}&invite=${invite}`,
      {
        method: "POST"
      }
    );

    if (response.status === 200 || response.status === 201)
      dispatch(loadExpo(expoId));

    return response.status;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const removeCollaborator = id => async (dispatch, getState) => {
  const expoId = getState().expo.activeExpo.id;
  try {
    const response = await fetch(
      `/api/colaborators/?collaborators=${id}&expositionId=${expoId}`,
      {
        method: "DELETE"
      }
    );

    if (response.status === 200) {
      await dispatch({
        type: EXPO_COLLABORATOR_DELETE,
        payload: {
          id
        }
      });
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const changeCollaboratorType = (id, type) => async (
  dispatch,
  getState
) => {
  try {
    const response = await fetch(`/api/colaborators/${id}?type=${type}`, {
      method: "PUT"
    });

    if (response.status === 200) {
      await dispatch({
        type: EXPO_COLLABORATOR_TYPE,
        payload: {
          id,
          type
        }
      });
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const changeOwner = (collaboratorId, expositionId) => async () => {
  try {
    const response = await fetch(
      `/api/exposition/reassign?collaboratorId=${collaboratorId}&expositionId=${expositionId}`,
      {
        method: "POST"
      }
    );

    return response.status === 200;
  } catch (error) {
    return false;
  }
};
