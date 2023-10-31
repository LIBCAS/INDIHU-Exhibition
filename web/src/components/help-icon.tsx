import { FontIcon } from "react-md";
import { Tooltip, PlacesType } from "react-tooltip";
import cx from "classnames";

type HelpIconProps = {
  label: string;
  id?: string;
  place?: PlacesType;
  className?: string;
};

const HelpIcon = ({
  label,
  id = "react-tooltip-help-icon",
  place = "left",
  className,
}: HelpIconProps) => (
  <div className={cx("help-icon", className)}>
    <FontIcon data-tooltip-id={id} data-tooltip-content={label}>
      help
    </FontIcon>
    <Tooltip
      id={id}
      variant="dark"
      float={false}
      place={place}
      className="help-icon-react-tooltip"
      style={{ zIndex: 10000 }}
    />
  </div>
);

export default HelpIcon;
