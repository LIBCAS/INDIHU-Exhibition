import { compose, defaultProps, withProps } from "recompose";
import { FontIcon } from "react-md";
import { Tooltip as ReactTooltip } from "react-tooltip";

const HelpIcon = ({ label, dataFor, place, id }) => (
  <div className="help-icon">
    <FontIcon data-tooltip-content={label} data-tooltip-id={dataFor}>
      help
    </FontIcon>
    <ReactTooltip
      id={id}
      variant="dark"
      float={false}
      place={place}
      className="help-icon-react-tooltip"
      style={{ zIndex: 10000 }}
    />
  </div>
);

export default compose(
  defaultProps({ id: "help-icon", place: "left" }),
  withProps(({ dataFor, id }) => ({
    dataFor: dataFor || `react-tooltip-for-help-icon-${id}`,
    id: `react-tooltip-for-help-icon-${id}`,
  }))
)(HelpIcon);
