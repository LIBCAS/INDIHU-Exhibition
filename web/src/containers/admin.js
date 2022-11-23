import { connect } from "react-redux";
import { compose, lifecycle, withState } from "recompose";

import { getAdminSettings } from "../actions/admin-actions";

import AppHeader from "../components/app-header";
import Header from "../components/admin/header";
import Settings from "../components/admin/settings";
import SettingsForm from "../components/admin/settings-form";

const Admin = ({ settings, activeForm, setActiveForm }) => (
  <div>
    <AppHeader adminStyle />
    {settings && (
      <div className="container">
        <Header />
        {activeForm === "adminSettingsForm" ? (
          <SettingsForm
            {...{ initialValues: settings, settings, setActiveForm }}
          />
        ) : (
          <Settings {...{ settings, setActiveForm }} />
        )}
      </div>
    )}
  </div>
);

export default compose(
  connect(({ admin: { settings } }) => ({ settings }), {
    getAdminSettings,
  }),
  withState("activeForm", "setActiveForm", null),
  lifecycle({
    UNSAFE_componentWillMount() {
      const { getAdminSettings } = this.props;

      getAdminSettings();
    },
  })
)(Admin);
