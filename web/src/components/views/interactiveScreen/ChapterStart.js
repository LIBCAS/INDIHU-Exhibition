import React from "react";
import { compose, lifecycle } from "recompose";

const ChapterStart = ({ viewScreen }) => {
  return (
    <div
      id="interactive-screen-chapter-start-container"
      className="interactive-screen-chapter-start-container"
    >
      <div
        id="interactive-screen-chapter-start-container-inner"
        className="interactive-screen-chapter-start-container-inner"
      />
      <p className="title-fullscreen">
        {viewScreen.title}
      </p>
    </div>
  );
};

export default compose(
  lifecycle({
    componentDidMount() {
      const { viewScreen, screenType, screenFiles } = this.props;

      if (
        viewScreen.type === screenType.INTRO &&
        viewScreen.image &&
        screenFiles["image"]
      ) {
        const newNode = screenFiles["image"];

        newNode.id = "interactive-screen-chapter-start-image";
        newNode.className = "";
        newNode.setAttribute(
          "style",
          `width: ${viewScreen.imageOrigData.height >
          viewScreen.imageOrigData.width
            ? "auto"
            : "100%"}; height: ${viewScreen.imageOrigData.height >
          viewScreen.imageOrigData.width
            ? "100%"
            : "auto"}`
        );

        document
          .getElementById("interactive-screen-chapter-start-container-inner")
          .prepend(newNode);
      }
    }
  })
)(ChapterStart);
