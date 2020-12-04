import React from "react";
import { compose, lifecycle, withHandlers, defaultProps } from "recompose";
import Scrollbars from "react-custom-scrollbars";
import FontIcon from "react-md/lib/FontIcons";

const NOOP = () => {};

const ARROW_LEFT = "scrollbar-arrow-left";
const ARROW_RIGHT = "scrollbar-arrow-right";

let timeoutId = null;

const Scrollbar = ({ id, clear, getScrollbar, ...rest }) => {
  const renderView = (props) => <div {...{ ...props, id }} />;

  const renderTrackHorizontal = (props) => (
    <div {...props} className="scrollbar-track-horizontal" />
  );

  const renderThumbHorizontal = (props) => (
    <div {...props} className="scrollbar-thumb-horizontal" />
  );

  const onUpdate = (values) => {
    console.log(values);
    if (values) {
      const { scrollWidth, clientWidth } = values;

      const arrowLeft = document.getElementById(ARROW_LEFT);
      const arrowRight = document.getElementById(ARROW_RIGHT);

      if (arrowLeft && arrowRight) {
        if (scrollWidth <= clientWidth) {
          arrowLeft.style.visibility = "hidden";
          arrowRight.style.visibility = "hidden";
        } else {
          arrowLeft.style.visibility = "visible";
          arrowRight.style.visibility = "visible";
        }
      }
    }
  };

  const onMove = (back) => {
    const scrollbar = getScrollbar();

    if (!timeoutId && scrollbar) {
      const newTimeout = () => {
        timeoutId = setTimeout(move, 20);
      };

      const move = () => {
        const scrollbar = getScrollbar();

        if (scrollbar) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollbar;
          const max = scrollWidth - clientWidth;

          if ((back && scrollLeft > 0) || (!back && scrollLeft < max)) {
            scrollbar.scrollLeft += (back ? -1 : 1) * 5;
            newTimeout();
            return;
          }
        }

        clear();
      };

      newTimeout();
    }
  };

  return (
    <div className="scrollbar-container">
      <Scrollbars
        {...{
          ...rest,
          className: "scrollbar",
          hideTracksWhenNotNeeded: true,
          renderView,
          renderTrackHorizontal,
          renderThumbHorizontal,
          onUpdate,
        }}
      />
      <div id={ARROW_LEFT} className="scrollbar-arrow scrollbar-arrow-left">
        <div
          className="scrollbar-arrow-inner"
          onMouseDown={() => onMove(true)}
          onMouseLeave={clear}
        >
          <FontIcon
            className="scrollbar-icon"
            iconClassName="fa fa-caret-left"
          />
        </div>
      </div>
      <div id={ARROW_RIGHT} className="scrollbar-arrow scrollbar-arrow-right">
        <div
          className="scrollbar-arrow-inner"
          onMouseDown={() => onMove()}
          onMouseLeave={clear}
        >
          <FontIcon
            className="scrollbar-icon"
            iconClassName="fa fa-caret-right"
          />
        </div>
      </div>
    </div>
  );
};

export default compose(
  defaultProps({ id: "scrollbar", enableHorizontalMouseWheel: false }),
  withHandlers({
    getScrollbar: ({ id }) => () => document.getElementById(id),
    clear: () => () => {
      clearTimeout(timeoutId);
      timeoutId = null;
    },
  }),
  withHandlers({
    handleMouseWheel: ({
      enableHorizontalMouseWheel,
      getScrollbar,
      onMouseWheel = NOOP,
    }) => (e) => {
      if (enableHorizontalMouseWheel) {
        const scrollbar = getScrollbar();

        if (scrollbar) {
          const delta =
            e.deltaY || e.deltaX || -1 * (e.wheelDeltaY || e.wheelDeltaX);
          scrollbar.scrollLeft += delta;
          onMouseWheel();
        }
      }
    },
  }),
  lifecycle({
    componentWillMount() {
      const { clear, handleMouseWheel } = this.props;

      window.addEventListener("mouseup", clear);
      window.addEventListener("mousewheel", handleMouseWheel);
    },
    componentWillUnmount() {
      const { clear, handleMouseWheel } = this.props;

      window.removeEventListener("mouseup", clear);
      window.removeEventListener("mouseup", handleMouseWheel);

      clear();
    },
  })
)(Scrollbar);
