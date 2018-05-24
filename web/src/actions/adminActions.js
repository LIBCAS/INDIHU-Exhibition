import { compact } from "lodash";

import fetch from "../utils/fetch";
// import { USERS, USER_DELETE, USER_REACTIVATE, USER_SET } from "./constants";
import { USERS, ADMIN } from "./constants";
// import { showLoader } from "./appActions";
import { createFilter, createQuery } from "../utils";

export const getUsers = (
  page = 1,
  pageSize = 20,
  filter = "ALL",
  sort = "firstName",
  search = "",
  table = "ALL"
) => async dispatch => {
  // await dispatch(showLoader(true));

  try {
    const createdFilter =
      filter === "ALL"
        ? []
        : createFilter([{ field: "state", operation: "EQ", value: filter }]);

    const response =
      table === "ALL"
        ? await fetch(
            `/api/user/${search === "" ? "" : `q/${search}`}${createQuery(
              compact([
                ...createdFilter,
                { field: "sort", value: sort },
                { field: "order", value: "ASC" },
                { field: "page", value: page },
                { field: "pageSize", value: pageSize }
              ])
            )}`
          )
        : await fetch("/api/registration/toFinish");

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
            table
          }
        }
      });

      // await dispatch(showLoader(false));
      return true;
    }

    // await dispatch(showLoader(false));
    return false;
  } catch (error) {
    console.log(error);
    // await dispatch(showLoader(false));
    return false;
  }
};

export const deleteUser = id => async (dispatch, getState) => {
  try {
    const response = await fetch(`/api/user/${id}`, { method: "DELETE" });

    if (response.status === 200) {
      // await dispatch({
      //   type: USER_DELETE,
      //   payload: { id }
      // });
      const all = getState().user.users.all;
      dispatch(
        getUsers(
          all.page,
          all.pageSize,
          all.filter,
          all.sort,
          all.search,
          all.table
        )
      );
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const reactivateUser = id => async (dispatch, getState) => {
  try {
    const response = await fetch(`/api/user/reactivate/${id}`, {
      method: "POST"
    });

    if (response.status === 200) {
      // await dispatch({
      //   type: USER_REACTIVATE,
      //   payload: { id }
      // });
      const all = getState().user.users.all;
      dispatch(
        getUsers(
          all.page,
          all.pageSize,
          all.filter,
          all.sort,
          all.search,
          all.table
        )
      );
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

export const updateUser = user => async (dispatch, getState) => {
  try {
    const response = await fetch(`/api/user/`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(user)
    });

    if (response.status === 200) {
      // await dispatch({
      //   type: USER_SET,
      //   payload: user
      // });
      const all = getState().user.users.all;
      dispatch(
        getUsers(
          all.page,
          all.pageSize,
          all.filter,
          all.sort,
          all.search,
          all.table
        )
      );
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const acceptUser = userId => async (dispatch, getState) => {
  try {
    const response = await fetch(`/api/registration/${userId}`, {
      method: "PUT"
    });

    if (response.status === 200) {
      const all = getState().user.users.all;

      dispatch(
        getUsers(
          all.page,
          all.pageSize,
          all.filter,
          all.sort,
          all.search,
          all.table
        )
      );

      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getAdminSettings = () => async dispatch => {
  try {
    const response = await fetch("/api/admin/settings");

    if (response.status === 200) {
      const content = await response.json();

      dispatch({
        type: ADMIN,
        payload: { settings: content }
      });

      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const changeAdminSettings = settings => async dispatch => {
  try {
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(settings)
    });

    return response.status === 200;
  } catch (error) {
    return false;
  }
};
