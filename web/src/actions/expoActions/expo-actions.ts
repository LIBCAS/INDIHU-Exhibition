import {
  EXPO_SET,
  EXPOSITIONS,
  EXPO_UPDATE,
  EXPO_DESIGN_DATA_UPDATE,
  EXPOSITION_ITEM_PIN,
  EXPOSITION_ITEM_UNPIN,
} from "../constants";

import { ExpositionsObj } from "models";
import { AppDispatch, AppState } from "store/store";

import { fetcher } from "utils/fetcher";
import { showLoader } from "../app-actions";
import { get } from "lodash";
import { ThemeFormDataProcessed } from "containers/expo-administration/expo-theme/models";

import { ExpositionsFilterStateObj } from "containers/expositions/Expositions";

export const getExpositionsParametrized =
  (expositionsState: ExpositionsFilterStateObj) =>
  async (dispatch: AppDispatch, getState: () => AppState) => {
    try {
      const user = getState().user.info;
      const email = get(user, "email");

      const { filter, search, sort, order, page, pageSize, showOnlyPinned } =
        expositionsState;

      const filterArr = [];
      if (email && (filter === "READ_ONLY" || filter === "READ_WRITE")) {
        filterArr.push({
          field: filter === "READ_ONLY" ? "readRights" : "writeRights",
          operation: "CONTAINS",
          value: email,
        });
      }
      if (email && filter === "AUTHORSHIP") {
        filterArr.push({
          field: "author",
          operation: "EQ",
          value: user.email,
        });
      }
      if (search) {
        filterArr.push({
          field: "title",
          operation: "CONTAINS",
          value: search,
        });
      }

      // Filtration of pinned expos is not currently supported in BE !!
      const postBody = {
        page: page,
        pageSize: pageSize,
        sort: showOnlyPinned ? "edited" : sort,
        order: showOnlyPinned ? "ASC" : order,
        operation: showOnlyPinned ? "AND" : "AND",
        filter: showOnlyPinned ? [] : filterArr,
      };

      const response = await fetcher(
        `/api/exposition/parametrized?showPinned=${showOnlyPinned}`,
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(postBody),
        }
      );

      const expositions = (await response.json()) as ExpositionsObj;

      if (expositions) {
        dispatch({
          type: EXPOSITIONS,
          payload: {
            expositions: {
              items: expositions.items ?? [],
              count: expositions.count ?? 0,
            },
          },
        });

        return expositions;
      } else {
        dispatch({
          type: EXPOSITIONS,
          payload: { expositions: {} },
        });
      }

      return response.status === 200;
    } catch (error) {
      console.error("Fetching expositions has failed!");
      console.error(error);
      return false;
    }
  };

// Save the expo from the argument to the BE DB
export const saveExpo = async (expo: any) => {
  try {
    const response = await fetcher("/api/exposition/", {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        ...expo,
        structure: JSON.stringify(expo.structure),
      }),
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const loadExpo = (id: string) => async (dispatch: AppDispatch) => {
  await dispatch(showLoader(true));
  try {
    const response = await fetcher(`/api/exposition/${id}`);

    if (response.status !== 200) {
      await dispatch(showLoader(false));
      return response.status;
    }

    const expo = await response.json();

    await dispatch({
      type: EXPO_SET,
      payload: {
        activeExpo: { ...expo, structure: JSON.parse(expo.structure) },
      },
    });

    await dispatch(showLoader(false));
    return response.status;
  } catch (error) {
    await dispatch(showLoader(false));
    return false;
  }
};

// This will just update the redux store
export const updateExpo = (expo: any) => async (dispatch: AppDispatch) => {
  dispatch(showLoader(true));
  const saved = await saveExpo(expo);
  if (saved) {
    dispatch({
      type: EXPO_SET,
      payload: {
        activeExpo: { ...expo },
      },
    });
  }
  dispatch(showLoader(false));

  return saved;
};

export const checkExpoURL =
  (url: string) => async (dispatch: AppDispatch, getState: () => AppState) => {
    try {
      const response = await fetcher(`/api/exposition/${url}`, {
        method: "POST",
      });

      if (
        response.status === 200 &&
        (await saveExpo({ ...getState().expo.activeExpo, url }))
      ) {
        await dispatch({
          type: EXPO_UPDATE,
          payload: {
            url,
          },
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

// - - - -

export const pinExpositionItem =
  (expoId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(showLoader(true));

      const resp = await fetcher(`/api/exposition/${expoId}/pin`, {
        method: "POST",
      });

      if (resp.status !== 200) {
        dispatch(showLoader(false));
        return false;
      }

      dispatch({
        type: EXPOSITION_ITEM_PIN,
        payload: expoId,
      });

      dispatch(showLoader(false));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

export const unpinExpositionItem =
  (expoId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(showLoader(true));

      const resp = await fetcher(`/api/exposition/${expoId}/unpin`, {
        method: "POST",
      });

      if (resp.status !== 200) {
        dispatch(showLoader(false));
        return false;
      }

      dispatch({
        type: EXPOSITION_ITEM_UNPIN,
        payload: expoId,
      });

      dispatch(showLoader(false));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

// - - - -

export const clearActiveExpo = () => ({
  type: EXPO_SET,
  payload: { activeExpo: {} },
});

export const setExpoDesignData = (expoDesignData: ThemeFormDataProcessed) => ({
  type: EXPO_DESIGN_DATA_UPDATE,
  payload: expoDesignData,
});
