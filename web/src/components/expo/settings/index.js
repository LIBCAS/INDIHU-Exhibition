import { connect } from "react-redux";
import { isEmpty } from "lodash";

import StateOptions from "../../form/state-options";
import URLChange from "./url-change";
import ClosedExpo from "./closed-expo";

const Settings = ({ activeExpo }) => (
  <div className="container container-tabMenu">
    <div className="settings margin-bottom">
      <div className="settings-state">
        <p className="title">Stav výstavy</p>
        <StateOptions />
      </div>
      <div className="settings-url">
        <p className="title">Url výstavy</p>
        {activeExpo && activeExpo.url && (
          <URLChange initialValues={{ url: activeExpo.url }} />
        )}
      </div>
    </div>
    {!isEmpty(activeExpo) && (
      <ClosedExpo {...{ activeExpo, initialValues: { ...activeExpo } }} />
    )}
  </div>
);

export default connect(
  ({ expo: { activeExpo } }) => ({ activeExpo }),
  null
)(Settings);
