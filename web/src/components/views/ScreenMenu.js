import React from "react";
import { connect } from "react-redux";
import FontIcon from "react-md/lib/FontIcons";

import { toggleInteractive } from "../../actions/expoActions/viewerActions";

const ScreenMenu = ({ toggleInteractive, viewScreen }) => {
  return (
    <div className="viewer-screen-menu">
      <div className="menu-text">
        {viewScreen.title}
      </div>
      <FontIcon className="menu-icon" onClick={() => toggleInteractive(true)}>
        menu
      </FontIcon>
    </div>
  );
};

export default connect(null, { toggleInteractive })(ScreenMenu);
