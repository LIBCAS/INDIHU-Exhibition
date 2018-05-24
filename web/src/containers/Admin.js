import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withState } from "recompose";

import { getAdminSettings } from "../actions/adminActions";

import AppHeader from "../components/AppHeader";
import Header from "../components/admin/Header";
import Settings from "../components/admin/Settings";
import SettingsForm from "../components/admin/SettingsForm";

const Admin = ({ settings, activeForm, setActiveForm }) =>
  <div>
    <AppHeader adminStyle />
    {settings &&
      <div className="container">
        <Header />
        {activeForm === "adminSettingsForm"
          ? <SettingsForm
              {...{ initialValues: settings, settings, setActiveForm }}
            />
          : <Settings {...{ settings, setActiveForm }} />}
      </div>}
  </div>;

export default compose(
  connect(({ admin: { settings } }) => ({ settings }), {
    getAdminSettings
  }),
  withState("activeForm", "setActiveForm", null),
  lifecycle({
    componentWillMount() {
      const { getAdminSettings } = this.props;

      getAdminSettings();
    }
  })
)(Admin);
