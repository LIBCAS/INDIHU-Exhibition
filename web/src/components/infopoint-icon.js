import {
  compose,
  withState,
  defaultProps,
  withHandlers,
  withProps,
  lifecycle,
} from "recompose";
import classNames from "classnames";
import FontIcon from "react-md/lib/FontIcons";

const InfopointIcon = ({ children, ...props }) => {
  const { handleClick, visible, setVisible, ...iconProps } = props;
  return <FontIcon {...iconProps}>{children}help</FontIcon>;
};

export default compose(
  defaultProps({
    className: "",
  }),
  withState("visible", "setVisible", false),
  withHandlers({
    onMouseEnter:
      ({ setVisible }) =>
      () =>
        setVisible(true),
    handleClick:
      ({ setVisible }) =>
      () =>
        setVisible(false),
  }),
  lifecycle({
    UNSAFE_componentWillMount() {
      const { handleClick } = this.props;
      document.body.addEventListener("click", handleClick);
    },
    componentWillUnmount() {
      const { handleClick } = this.props;
      document.body.removeEventListener("click", handleClick);
    },
  }),
  withProps(({ className, visible }) => ({
    className: classNames(className, { show: visible }),
  }))
)(InfopointIcon);
