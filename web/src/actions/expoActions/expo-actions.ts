import {
  EXPO_SET,
  EXPOSITIONS,
  EXPOSITIONS_FILTER,
  EXPOSITIONS_PAGER,
  EXPO_UPDATE,
} from "../constants";

import {
  ExpositionFilter,
  ExpositionSort,
  ExpositionOrder,
  ExpositionsObj,
} from "models";
import { AppDispatch, AppState } from "store/store";

import { fetcher } from "utils/fetcher";
import { createQuery, createFilter } from "../../utils";
import { showLoader } from "../app-actions";
import { compact, get } from "lodash";

export const getExpositionsParametrized =
  () => async (dispatch: AppDispatch, getState: () => AppState) => {
    try {
      const user = getState().user.info;
      const email = get(user, "email");

      const filter = getState().expo.filter;
      const pager = getState().expo.pager;
      // const cardsLists = getState().expo.cardsList;

      const filterArr = [];
      if (
        email &&
        (filter.filter === "READ_ONLY" || filter.filter === "READ_WRITE")
      ) {
        filterArr.push({
          field: filter.filter === "READ_ONLY" ? "readRights" : "writeRights",
          operation: "CONTAINS",
          value: email,
        });
      }
      if (email && filter.filter === "AUTHORSHIP") {
        filterArr.push({
          field: "author",
          operation: "EQ",
          value: user.email,
        });
      }
      if (filter.search) {
        filterArr.push({
          field: "title",
          operation: "CONTAINS",
          value: filter.search,
        });
      }

      const postBody = {
        page: pager.page,
        pageSize: pager.pageSize,
        sort: filter.sort,
        order: filter.order,
        operation: "AND",
        filter: filterArr,
      };

      const response = await fetcher("/api/exposition/parametrized", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(postBody),
      });

      const expositions = (await response.json()) as ExpositionsObj;

      if (expositions) {
        dispatch({
          type: EXPOSITIONS,
          payload: { expositions },
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

// @Deprecated
export const getExpositions =
  (expoCount?: number) =>
  async (dispatch: AppDispatch, getState: () => AppState) => {
    try {
      const user = getState().user.info;
      const email = get(user, "email");

      const filter = getState().expo.filter;
      const pager = getState().expo.pager;
      const cardsList = getState().expo.cardsList;
      const count = getState().expo.expositions.count;

      // 1. Create filtering query params consisting of two parts: filter.filter and search string
      const filterFilter =
        email && filter.filter !== "ALL"
          ? {
              field:
                filter.filter === "READ_ONLY" ? "readRights" : "writeRights",
              operation: "CONTAINS",
              value: email,
            }
          : null;

      const filterSearch = filter.search
        ? { field: "title", operation: "CONTAINS", value: filter.search }
        : null;

      const filterQueryParams = createFilter(
        compact([filterFilter, filterSearch])
      ); // can be empty list

      // 2. Create query params for sort, order, page and pageSize
      const cardsPageSize =
        count || expoCount
          ? {
              field: "pageSize",
              value:
                count && expoCount
                  ? Math.max(count, expoCount)
                  : expoCount
                  ? expoCount
                  : count,
            }
          : null;

      const tablePageSize = { field: "pageSize", value: pager.pageSize }; // default is 10 pageSize

      const otherQueryParams = compact([
        { field: "sort", value: filter.sort }, // default refreshed by "updated"
        { field: "order", value: filter.order }, // default refreshed by "ASC"
        cardsList ? null : { field: "page", value: pager.page },
        cardsList ? cardsPageSize : tablePageSize,
      ]);

      // 3. Create final query string
      const queryString = createQuery([
        ...filterQueryParams,
        ...otherQueryParams,
      ]);

      // 4. Finally fetch and process response
      const response = await fetcher(`/api/exposition/${queryString}`);
      const expositions = await response.json();

      if (expositions) {
        dispatch({
          type: EXPOSITIONS,
          payload: { expositions },
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
    const expo = await response.json();

    await dispatch({
      type: EXPO_SET,
      payload: {
        activeExpo: { ...expo, structure: JSON.parse(expo.structure) },
      },
    });

    await dispatch(showLoader(false));
    return response.status === 200;
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

export const setExpoFilter = (
  filter: ExpositionFilter,
  sort: ExpositionSort,
  search: string,
  order: ExpositionOrder
) => ({
  type: EXPOSITIONS_FILTER,
  payload: { filter, sort, search, order },
});

export const setExpoPager = (page: number, pageSize: number) => ({
  type: EXPOSITIONS_PAGER,
  payload: { page, pageSize },
});

export const changeExpositionsViewType = (cardsList: boolean) => ({
  type: EXPO_SET,
  payload: {
    cardsList,
  },
});

export const clearActiveExpo = () => ({
  type: EXPO_SET,
  payload: { activeExpo: {} },
});
