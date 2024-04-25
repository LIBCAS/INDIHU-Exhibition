import "whatwg-fetch";
import JWTDecode from "jwt-decode";

import { isEmpty } from "lodash";
import * as storage from "./storage";

const context = "";

const serialize = (obj = {}) =>
  Object.keys(obj)
    .map((key) => {
      if (Array.isArray(obj[key])) {
        return obj[key]
          .map(
            (param) => `${encodeURIComponent(key)}=${encodeURIComponent(param)}`
          )
          .join("&");
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
    })
    .join("&");

const customFetch = async (url, { params, ...options } = {}) => {
  const queryString = serialize(params);
  const questionMark = isEmpty(queryString) ? "" : "?";
  const token = storage.get("token");
  let opts = options;
  if (!isEmpty(token) && token !== "null" && token !== "undefined") {
    const decoded = JWTDecode(token);
    if (decoded && decoded.exp && decoded.exp * 1000 > new Date().getTime()) {
      const headers = options.headers || new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      opts = {
        ...options,
        headers,
      };
    } else {
      storage.remove("token");
    }
  }

  return fetch(`${context}${url}${questionMark}${queryString}`, opts);
};

export default customFetch;
