import { FC, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { AppDispatch } from "store/store";

import jwtDecode from "jwt-decode";
import getTime from "date-fns/get_time";
import * as storage from "../utils/storage";

import { refreshToken } from "actions/user-actions";

// - -

/**
 * If unsigned user attempts to redirect to one of these routes,
 * redirect him back to home page ("/")
 */
const UNSIGNED_USER_ALLOWED_ROUTES = [
  { regex: new RegExp(/\/view\/.*/) }, // expoViewer
  { regex: new RegExp(/\/verify\/.*/) }, // verify mail
  { regex: new RegExp(/\/oauth\/./) }, // oauth routes
  { regex: new RegExp(/\/about$/) }, // about page
  { regex: new RegExp(/\/terms-of-use$/) }, // terms of use page
  { regex: new RegExp(/\/privacy-policy$/) }, // privacy policy page
  { regex: new RegExp(/\/grafana$/) },
];

const KNOWN_ROUTES = [
  ...UNSIGNED_USER_ALLOWED_ROUTES,
  { regex: new RegExp(/\/expo\/.*/) },
  { regex: new RegExp(/\/exhibitions$/) },
  { regex: new RegExp(/\/profile$/) },
  { regex: new RegExp(/\/users$/) },
  { regex: new RegExp(/\/administration$/) },
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

    // skip handling routes which are always permitted
    // always allowed if it even unsigned user can visit
    if (
      UNSIGNED_USER_ALLOWED_ROUTES.find((route) =>
        location.pathname.match(route.regex)
      )
    ) {
      return;
    }

    // Now, deal with auth routes (for only authenticated users)
    // First, check whether user is logged in
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

    //
    if (signed && location.pathname === "/") {
      history.replace("/exhibitions");
      return;
    }

    // Second, deal with the signed status
    // If user is not signed, it cannot access these routes
    if (!signed) {
      storage.remove("token");
      history.replace("/");
      return;
    }

    //
    const isCurrentRouteKnownRoute = !!KNOWN_ROUTES.find((route) =>
      location.pathname.match(route.regex)
    );

    // 404
    if (signed && !isCurrentRouteKnownRoute) {
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
