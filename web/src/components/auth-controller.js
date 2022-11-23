import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import JWTDecode from "jwt-decode";
import getTime from "date-fns/get_time";
import * as storage from "../utils/storage";
import { refreshToken } from "../actions/user-actions";

const noAuthRoutes = [
  { regex: new RegExp(/\/view\/.*/) }, // expoViewer
  { regex: new RegExp(/\/verify\/.*/) }, // verify mail
];

export default compose(
  withRouter,
  connect(null, { refreshToken }),
  lifecycle({
    UNSAFE_componentWillMount() {
      const {
        history,
        location: { pathname },
        refreshToken,
      } = this.props;

      // keepalive
      window.interval = setInterval(() => refreshToken(), 180000);

      // skip no auth routes
      if (noAuthRoutes.find((p) => pathname.match(p.regex))) return;

      let signed = false;
      const token = storage.get("token");
      const user = storage.get("userName");
      const role = JSON.parse(storage.get("role"));

      if (!user || !role || !token || token === null) {
        signed = false;
      } else {
        try {
          const decoded = JWTDecode(token);
          const now = Math.floor(getTime(new Date()) / 1000);
          if (decoded.exp && decoded.exp >= now) {
            signed = true;
          } else {
            signed = false;
          }
        } catch (error) {
          signed = false;
        }
      }

      if (!signed) {
        storage.remove("token");
        if (pathname !== "/register") {
          history.replace("/");
        }
      } else if (signed && pathname === "/") {
        history.replace("/exhibitions");
      }
    },
    componentWillUnmount() {
      clearInterval(window.interval);
    },
  })
)(({ children }) => children);
