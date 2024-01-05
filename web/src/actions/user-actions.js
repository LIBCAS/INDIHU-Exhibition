import base64 from "base-64";
import utf8 from "utf8";
import JWTDecode from "jwt-decode";
import { map } from "lodash";
import fetch from "../utils/fetch";
import { USER, USER_INFO, USERS } from "./constants";
import { showLoader } from "./app-actions";
import * as storage from "../utils/storage";

export const parseToken = (token) => (dispatch) => {
  const decoded = JWTDecode(token);

  const role = decoded.aut;
  const userName = decoded.userName;

  storage.set("token", token);
  storage.set("role", JSON.stringify(role));
  storage.set("userName", userName);

  dispatch({
    type: USER,
    payload: { role, userName },
  });
};

export const refreshToken = () => async (dispatch) => {
  const token = storage.get("token");
  if (token) {
    try {
      const response = await fetch("/api/keepalive");

      if (response.status === 200) {
        const newToken = response.headers.get("bearer");
        dispatch(parseToken(newToken));
        return true;
      }
      return false;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
};

export const availableRegistration = () => async () => {
  try {
    const response = await fetch("/api/registration/available");
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const registration = (data) => async (dispatch) => {
  await dispatch(showLoader(true));
  try {
    const formBody = new URLSearchParams();
    map({ ...data, userName: data.email }, (value, key) =>
      formBody.append(key, value)
    );

    const response = await fetch("/api/registration/", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: formBody,
    });
    await dispatch(showLoader(false));
    return response.status;
  } catch (error) {
    await dispatch(showLoader(false));
    return error;
  }
};

export const verify = (secret) => async (dispatch) => {
  try {
    const response = await fetch(`/api/registration/secret/${secret}`, {
      method: "PUT",
    });
    if (response.status === 202) {
      const token = response.headers.get("bearer");
      dispatch(parseToken(token));
    }
    return response.status;
  } catch (error) {
    return error;
  }
};

/**
 * API call api/exposition/:
 * - basic auth user with params from form
 * - save token
 * - get user's roles (parseToken)
 * @param {string} name from form
 * @param {string} password from form
 */
export const signIn = (name, password) => async (dispatch) => {
  try {
    storage.remove("token");
    const response = await fetch("/api/dummy/", {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Basic ${utf8.encode(
          base64.encode(`${name}:${password}`)
        )}`,
      }),
    });

    if (response.status === 200) {
      const token = response.headers.get("bearer");
      dispatch(parseToken(token));
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const signOut = () => async (dispatch) => {
  storage.remove("token");
  storage.remove("role");
  storage.remove("userName");
  dispatch({
    type: USER,
    payload: { role: [], userName: null },
  });
};

export const getCurrentUser = (isSilence) => async (dispatch) => {
  !isSilence && dispatch(showLoader(true));
  try {
    const response = await fetch("/api/user/me");

    if (response.status === 200) {
      const user = await response.json();
      await dispatch({
        type: USER_INFO,
        payload: {
          info: { ...user },
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
  !isSilence && dispatch(showLoader(false));
};

export const updateCurrentUser = (user) => async (dispatch) => {
  try {
    const response = await fetch(`/api/user/`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(user),
    });

    if (response.status === 200) {
      await dispatch({
        type: USER_INFO,
        payload: {
          info: { ...user, password: undefined },
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

export const passwordReset = (email) => async () => {
  try {
    const response = await fetch(`/api/user/reset/`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: email,
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

export const getActiveUsers = (search) => async (dispatch) => {
  if (search === null || search === undefined || search === "") return false;

  try {
    const response = await fetch(`/api/user/c/${search}`);

    if (response.status === 200) {
      const users = await response.json();

      await dispatch({
        type: USERS,
        payload: {
          active: users,
        },
      });

      return users;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteAccount = () => async () => {
  try {
    const response = await fetch("/api/user/me", { method: "DELETE" });

    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};
