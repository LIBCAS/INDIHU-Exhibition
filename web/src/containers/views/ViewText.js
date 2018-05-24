import React from "react";
import { withRouter } from "react-router-dom";
import { compose, lifecycle, withHandlers } from "recompose";
import { connect } from "react-redux";
import { map, get } from "lodash";

import ScreenMenu from "../../components/views/ScreenMenu";

const ViewText = ({ viewScreen }) => {
  return (
    <div>
      <div className="viewer-screen">
        <div className="text-screen">
          <div className="text">
            {viewScreen.mainText &&
              <p
                {...{
                  id: "view-text-paragraph"
                }}
              >
                {map(
                  viewScreen.mainText,
                  (char, key) => (char === "\n" ? <br {...{ key }} /> : char)
                )}
              </p>}
          </div>
        </div>
      </div>
      <ScreenMenu viewScreen={viewScreen} />
    </div>
  );
};

export default compose(
  withRouter,
  connect(({ expo: { viewScreen } }) => ({ viewScreen }), null),
  withHandlers({
    onResize: ({ viewScreen }) => () => {
      const paragraph = document.getElementById("view-text-paragraph");

      if (
        paragraph &&
        get(viewScreen, "mainText") &&
        get(viewScreen, "mainText").length
      ) {
        paragraph.style.setProperty(
          "font-size",
          `${window.innerWidth > window.innerHeight
            ? window.innerWidth
            : window.innerHeight}px`
        );

        while (
          paragraph.scrollWidth > paragraph.offsetWidth ||
          paragraph.scrollHeight > paragraph.offsetHeight
        ) {
          paragraph.style.setProperty(
            "font-size",
            `${parseFloat(
              paragraph.style.getPropertyValue("font-size").slice(0, -2)
            ) * 0.9}px`
          );
        }
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      const { onResize } = this.props;

      window.addEventListener("resize", onResize);
    },
    componentDidMount() {
      const { onResize } = this.props;

      onResize();
    },
    componentWillUnmount() {
      const { onResize } = this.props;

      window.removeEventListener("resize", onResize);
    }
  })
)(ViewText);
