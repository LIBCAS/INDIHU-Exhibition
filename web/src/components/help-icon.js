import { compose, defaultProps, withProps } from "recompose";
import { FontIcon } from "react-md";
import ReactTooltip from "react-tooltip";

const HelpIcon = ({ label, dataFor, place, id }) => (
  <div className="help-icon">
    <FontIcon data-tip={label} data-for={dataFor}>
      help
    </FontIcon>
    <ReactTooltip
      type="dark"
      effect="solid"
      id={id}
      place={place}
      className="help-icon-react-tooltip"
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
