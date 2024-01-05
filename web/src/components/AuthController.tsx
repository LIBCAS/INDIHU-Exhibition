import { FC, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { AppDispatch } from "store/store";

import jwtDecode from "jwt-decode";
import getTime from "date-fns/get_time";
import * as storage from "../utils/storage";

import { refreshToken } from "actions/user-actions";

// - -

const noAuthRoutes = [
  { regex: new RegExp(/\/view\/.*/) }, // expoViewer
  { regex: new RegExp(/\/verify\/.*/) }, // verify mail
  { regex: new RegExp(/\/oauth\/./) }, // oauth routes
  { regex: new RegExp(/\/about/) }, // about page
  { regex: new RegExp(/\/terms-of-use/) }, // terms of use page
  { regex: new RegExp(/\/privacy-policy/) }, // privacy policy page
];

const AuthController: FC = ({ children }) => {
  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();
  const intervalRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    // keepalive
    intervalRef.current = setInterval(() => {
      dispatch(refreshToken());
    }, 180000);

    // skip no auth routes
    if (noAuthRoutes.find((route) => location.pathname.match(route.regex))) {
      return;
    }

    // Auth routes, check whether user is logged in
    let signed = false;
    const token = storage.get("token");
    const user = storage.get("userName");
    const roleValue = storage.get("role");
    const role = roleValue ? JSON.parse(roleValue) : null;

    if (!token || !user || !role) {
      signed = false;
    } else {
      try {
        const decodedToken = jwtDecode(token) as any;
        const now = Math.floor(getTime(new Date()) / 1000);
        if (
          "exp" in decodedToken &&
          decodedToken.exp &&
          decodedToken.exp >= now
        ) {
          signed = true;
        } else {
          signed = false;
        }
      } catch (error) {
        signed = false;
      }
    }

    // Deal with the signed status
    if (!signed) {
      storage.remove("token");
      if (
        location.pathname !== "/register" &&
        location.pathname !== "/grafana" &&
        location.pathname !== "/landing-page"
      ) {
        history.replace("/");
      }
    }

    if (signed && location.pathname === "/") {
      history.replace("/exhibitions");
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default AuthController;
