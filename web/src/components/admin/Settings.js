import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import Button from "react-md/lib/Buttons/Button";
import FontIcon from "react-md/lib/FontIcons";

import { changeAdminSettings } from "../../actions/adminActions";

const Settings = ({ settings, setActiveForm }) =>
  <div className="flex-form">
    <div className="flex-form editable">
      <p>
        <span>Registrace povolena: </span>
        {settings.allowedRegistration ? "Ano" : "Ne"}
      </p>
      <p>
        <span>Automatická registrace: </span>
        {settings.automaticRegistration ? "Ano" : "Ne"}
      </p>
      <p>
        <span>Zamknutí výstavy: </span>
        {settings.lockDuration} vteřin
          </p>
      <div className="flex-row flex-centered">
        <Button
          className="flex-form-edit"
          flat
          label="Upravit"
          onClick={() => setActiveForm("adminSettingsForm")}
        >
          <FontIcon>edit</FontIcon>
        </Button>
      </div>
    </div>
  </div>;

export default compose(
  connect(null, {
    changeAdminSettings
  })
)(Settings);
