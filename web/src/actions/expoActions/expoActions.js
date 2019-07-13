import { compact, get } from "lodash";

import fetch from "../../utils/fetch";
import {
  EXPO_SET,
  EXPOSITIONS,
  EXPOSITIONS_FILTER,
  EXPOSITIONS_PAGER,
  EXPO_UPDATE
} from "./../constants";
import { showLoader } from "./../appActions";
import { getCurrentUser } from "./../userActions";
import { createQuery, createFilter } from "../../utils";

export const getExpositions = (inSilence, expoCount) => async (
  dispatch,
  getState
) => {
  dispatch(showLoader(!inSilence));
  try {
    const cardsList = getState().expo.cardsList;

    await dispatch(getCurrentUser(true));
    const user = getState().user.info;
    const email = get(user, "email");

    const filter = getState().expo.filter;

    const pager = getState().expo.pager;

    const count = getState().expo.expositions.count;

    const response = await fetch(
      `/api/exposition/${createQuery(
        compact([
          ...createFilter(
            compact([
              filter.filter !== "ALL" && email
                ? {
                    field:
                      filter.filter === "READ_ONLY"
                        ? "readRights"
                        : "writeRights",
                    operation: "CONTAINS",
                    value: email
                  }
                : null,
              { field: "title", operation: "CONTAINS", value: filter.search }
            ])
          ),
          { field: "sort", value: filter.sort },
          { field: "order", value: filter.order },
          cardsList
            ? count || expoCount
              ? {
                  field: "pageSize",
                  value:
                    expoCount && count
                      ? expoCount > count
                        ? expoCount
                        : count
                      : expoCount
                      ? expoCount
                      : count
                }
              : null
            : { field: "pageSize", value: pager.pageSize },
          cardsList ? null : { field: "page", value: pager.page }
        ])
      )}`
    );

    const expositions = await response.json();

    if (expositions) {
      dispatch({
        type: EXPOSITIONS,
        payload: { expositions }
      });

      return expositions;
    } else {
      dispatch({
        type: EXPOSITIONS,
        payload: { expositions: {} }
      });
    }

    dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    dispatch(showLoader(false));
    return false;
  }
};

export const saveExpo = async expo => {
  try {
    const response = await fetch("/api/exposition/", {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        ...expo,
        structure: JSON.stringify(expo.structure)
      })
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const loadExpo = id => async dispatch => {
  await dispatch(showLoader(true));
  try {
    const response = await fetch(`/api/exposition/${id}`);
    const expo = await response.json();

    await dispatch({
      type: EXPO_SET,
      payload: {
        activeExpo: { ...expo, structure: JSON.parse(expo.structure) }
      }
    });

    await dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    await dispatch(showLoader(false));
    return false;
  }
};

export const setExpoFilter = (filter, sort, search, order) => ({
  type: EXPOSITIONS_FILTER,
  payload: { filter, sort, search, order }
});

export const setExpoPager = (page, pageSize) => ({
  type: EXPOSITIONS_PAGER,
  payload: { page, pageSize }
});

export const updateExpo = expo => async dispatch => {
  dispatch(showLoader(true));
  const saved = await saveExpo(expo);
  if (saved) {
    dispatch({
      type: EXPO_SET,
      payload: {
        activeExpo: { ...expo }
      }
    });
  }
  dispatch(showLoader(false));

  return saved;
};

export const checkExpoURL = url => async (dispatch, getState) => {
  try {
    const response = await fetch(`/api/exposition/${url}`, { method: "POST" });

    if (
      response.status === 200 &&
      (await saveExpo({ ...getState().expo.activeExpo, url }))
    ) {
      await dispatch({
        type: EXPO_UPDATE,
        payload: {
          url
        }
      });
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const changeExpositionsViewType = cardsList => ({
  type: EXPO_SET,
  payload: {
    cardsList
  }
});
