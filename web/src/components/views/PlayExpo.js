import React from "react";
import { compose, defaultProps } from "recompose";
import { noop } from "lodash";
import FontIcon from "react-md/lib/FontIcons";

const PlayExpo = ({ onClick, text }) => (
  <div className="play-expo" onClick={onClick}>
    <div className="icon-container">
      <FontIcon>play_circle_outline</FontIcon>
    </div>
    {text && <p className="text">{text}</p>}
  </div>
);

export default compose(defaultProps({ onClick: noop }))(PlayExpo);
