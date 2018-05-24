import React from "react";
import { connect } from "react-redux";
import { compose, withState, lifecycle } from "recompose";
import { isEmpty } from "lodash";
import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";

import AppHeader from "../components/AppHeader";
import Header from "../components/profile/Header";
import UserInfoChange from "../components/profile/UserInfoChange";
import PasswordChange from "../components/profile/PasswordChange";
import { getCurrentUser } from "../actions/userActions";
import { setDialog } from "../actions/dialogActions";

const Profile = props =>
  <div>
    <AppHeader profileStyle />
    {!isEmpty(props.initialValues) &&
      <div className="container">
        <Header />
        <UserInfoChange {...props} />
        <PasswordChange {...props} />
        <div className="flex-row flex-centered">
          <Button
            flat
            label="Zrušit účet"
            onClick={() => props.setDialog("DeleteAccount")}
          >
            <FontIcon>delete</FontIcon>
          </Button>
        </div>
      </div>}
  </div>;

export default compose(
  connect(({ user: { info } }) => ({ initialValues: info, info }), {
    getCurrentUser,
    setDialog
  }),
  withState("activeForm", "setActiveForm", null),
  lifecycle({
    async componentWillMount() {
      const { getCurrentUser } = this.props;
      await getCurrentUser();
    }
  })
)(Profile);
