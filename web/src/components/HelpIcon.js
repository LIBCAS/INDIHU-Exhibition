import React from "react";
import { FontIcon } from "react-md";
import ReactTooltip from "react-tooltip";

const HelpIcon = ({ label }) =>
  <div className="help-icon">
    <FontIcon data-tip={label}>help</FontIcon>
    <ReactTooltip type="dark" effect="solid" />
  </div>;

export default HelpIcon;
