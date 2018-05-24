import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Helmet } from 'react-helmet';

import AuthController from "./components/AuthController";
import Dialogs from "./components/dialogs";
import Authentication from "./containers/Authentication";
import Verify from "./containers/Verify";
import Expositions from "./containers/Expositions";
import Expo from "./containers/Expo";
import ScreenViewer from "./containers/ScreenViewer";
import ExpoViewer from "./containers/ExpoViewer";
import Profile from "./containers/Profile";
import Users from "./containers/Users";
import Admin from "./containers/Admin";

import { isAdmin } from "./utils";

const App = props =>
  <Provider store={props.store}>
    <Router>
      <AuthController>
        <Helmet>
          <title>INDIHU</title>
          <meta name="description" content="Vývoj nástrojů a infrastruktury pro digital humanities" />
        </Helmet>
        <Dialogs />
        <Route exact path="/" component={Authentication} />
        <Route path="/verify/:secret" component={Verify} />
        <Route path="/expositions" component={Expositions} />
        <Route path="/expo/:id" component={Expo} />
        <Route path="/screen/:id" component={ScreenViewer} />
        <Route path="/view/:name" component={ExpoViewer} />
        <Route path="/profile" component={Profile} />
        {props.admin && <Route path="/users" component={Users} />}
        {props.admin && <Route path="/administration" component={Admin} />}
      </AuthController>
    </Router>
  </Provider>;

export default connect(
  ({ user: { role } }) => ({ admin: isAdmin(role) }), null
)(App);
