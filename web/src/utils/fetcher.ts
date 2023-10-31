import JWTDecode from "jwt-decode";
import { isEmpty } from "lodash";
import * as storage from "./storage";

type ParamsObj = Record<string, string>;
type FetchOptions = Partial<RequestInit> & Partial<{ params: ParamsObj }>;

// - -

const serializeParams = (params: ParamsObj) => {
  const paramKeys = Object.keys(params);

  // list which looks like ["key1=value1", "key2=value2", ...]
  const paramPairs = paramKeys.map((key) => {
    const value = params[key];
    if (Array.isArray(value)) {
      const list = value.map(
        (param) => `${encodeURIComponent(key)}=${encodeURIComponent(param)}`
      );
      return list.join("&");
    }

    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  });

  return paramPairs.join("&");
};

// - -

export const fetcher = async (url: string, options?: FetchOptions) => {
  const { params, ...nativeOptions } = options ?? {};

  // First process our additional params record which will serve as query string
  const queryString = params ? serializeParams(params) : "";
  const questionMark = queryString === "" ? "" : "?";

  // Secondly, process the token, pull it out from local storage
  const token = storage.get("token");
  const isTokenDef = !isEmpty(token) && token !== null && token !== undefined;
  let validatedToken: string | null = null;

  if (isTokenDef) {
    const decoded = JWTDecode(token) as any;
    if (decoded && decoded.exp && decoded.exp * 1000 > new Date().getTime()) {
      validatedToken = token; // if token is defined and okay, store it in new variable
    } else {
      storage.remove("token");
    }
  }

  // Thirdly, create some default headers + add token if was okay
  const nativeHeaders = nativeOptions?.headers as Headers | undefined;
  const headers = nativeHeaders || new Headers();
  if (validatedToken) {
    headers.append("Authorization", `Bearer ${validatedToken}`);
  }

  return fetch(`${url}${questionMark}${queryString}`, {
    ...nativeOptions,
    headers: headers,
  });
};
