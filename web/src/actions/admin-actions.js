import { compact } from "lodash";

import fetch from "../utils/fetch";
import { USERS, ADMIN } from "./constants";
import { createFilter, createQuery } from "../utils";

export const getUsers =
  (page = 1, pageSize = 20, filter = "ALL", sort = "firstName", search = "") =>
  async (dispatch) => {
    try {
      const createdFilter =
        filter === "ALL"
          ? []
          : filter === "DELETED"
          ? [
              { field: "filter[0].field", value: "deleted" },
              { field: "filter[0].operation", value: "NOT_NULL" },
              { field: "filter[0].value", value: null },
            ]
          : createFilter([{ field: "state", operation: "EQ", value: filter }]);

      const response = await fetch(
        `/api/user/${search === "" ? "" : `q/${search}`}${createQuery(
          compact([
            ...createdFilter,
            { field: "sort", value: sort },
            { field: "order", value: "ASC" },
            { field: "page", value: page },
            { field: "pageSize", value: pageSize },
            { field: "allowDeleted", value: true },
          ])
        )}`
      );

      if (response.status === 200) {
        const users = await response.json();

        dispatch({
          type: USERS,
          payload: {
            all: {
              list: [...users.items],
              count: users.count,
              page,
              pageSize,
              filter,
              sort,
              search,
            },
          },
        });

        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

export const deleteUser = (id) => async (_dispatch, _getState) => {
  try {
    const response = await fetch(`/api/user/${id}`, { method: "DELETE" });

    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const reactivateUser = (id) => async (_dispatch, _getState) => {
  try {
    const response = await fetch(`/api/user/reactivate/${id}`, {
      method: "POST",
    });

    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const acceptUser = (userId) => async (_dispatch, _getState) => {
  try {
    const response = await fetch(`/api/user/${userId}/accept`, {
      method: "POST",
    });

    if (response.status === 200) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const rejectUser = (userId) => async (_dispatch, _getState) => {
  try {
    const response = await fetch(`/api/user/${userId}/reject`, {
      method: "POST",
    });

    if (response.status === 200) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// - - -
// - - -

export const getAdminSettings = () => async (dispatch) => {
  try {
    const response = await fetch("/api/admin/settings");

    if (response.status === 200) {
      const content = await response.json();

      dispatch({
        type: ADMIN,
        payload: { settings: content },
      });

      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const changeAdminSettings = (settings) => async () => {
  try {
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(settings),
    });

    return response.status === 200;
  } catch (error) {
    return false;
  }
};
