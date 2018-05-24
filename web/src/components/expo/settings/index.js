import React from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

import StateOptions from "../../form/StateOptions";
import URLChange from "./URLChange";
import ClosedExpo from "./ClosedExpo";

const Settings = ({ activeExpo }) =>
  <div className="container container-tabMenu">
    <div className="settings margin-bottom">
      <div className="settings-state">
        <p className="title">Stav výstavy</p>
        <StateOptions />
      </div>
      <div className="settings-url">
        <p className="title">URL výstavy</p>
        {activeExpo &&
          activeExpo.url &&
          <URLChange initialValues={{ url: activeExpo.url }} />}
      </div>
    </div>
    {!isEmpty(activeExpo) &&
      <ClosedExpo {...{ activeExpo, initialValues: { ...activeExpo } }} />}
  </div>;

export default connect(({ expo: { activeExpo } }) => ({ activeExpo }), null)(
  Settings
);
