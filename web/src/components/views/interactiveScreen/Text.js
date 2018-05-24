import React from "react";
import { compose, lifecycle, withHandlers } from "recompose";
import { map } from "lodash";

const Text = ({ mainText }) => {
  if (!mainText) return <div />;
  return (
    <div className="text-screen">
      <div className="text">
        {mainText &&
          <p
            {...{
              id: "interactive-screen-view-text-paragraph"
            }}
          >
            {map(
              mainText,
              (char, key) => (char === "\n" ? <br {...{ key }} /> : char)
            )}
          </p>}
      </div>
    </div>
  );
};

export default compose(
  withHandlers({
    onResize: ({ mainText }) => () => {
      const paragraph = document.getElementById(
        "interactive-screen-view-text-paragraph"
      );

      if (paragraph && mainText && mainText.length) {
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
)(Text);
