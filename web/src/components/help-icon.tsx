import { FontIcon } from "react-md";
import { Tooltip, PlacesType } from "react-tooltip";

type HelpIconProps = {
  label: string;
  id?: string;
  place?: PlacesType;
};

const HelpIcon = ({
  label,
  id = "react-tooltip-help-icon",
  place = "left",
}: HelpIconProps) => (
  <div className="help-icon">
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
