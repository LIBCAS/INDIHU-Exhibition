import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose, lifecycle, withHandlers } from "recompose";

import LeftScreen from "../../components/views/interactiveScreen/LeftScreen";
import RightScreen from "../../components/views/interactiveScreen/RightScreen";

import { interactiveRouter } from "../../utils";
import { getFileById } from "../../actions/fileActions";

const InteractiveScreen = ({
  viewScreen,
  getFileById,
  interactiveScrollRouting,
  screenFiles,
  screenViewer
}) => {
  if (!viewScreen) return <div className="interactive" />;

  return (
    <div className="interactive">
      <LeftScreen {...{ viewScreen }} />
      <RightScreen
        {...{
          viewScreen,
          interactiveScrollRouting,
          screenFiles,
          screenViewer
        }}
      />
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    ({ expo: { viewChapterMusic, viewExpo, viewScreen } }) => ({
      viewChapterMusic,
      viewExpo,
      viewScreen
    }),
    {
      getFileById
    }
  ),
  lifecycle({
    componentDidMount() {
      const { viewChapterMusic } = this.props;

      /** STOP CHAPTER MUSIC */
      if (viewChapterMusic) viewChapterMusic.pause();
    },
    componentWillUnmount() {
      const { viewChapterMusic, timeoutId, scrollStateTimeout } = this.props;
      if (viewChapterMusic) viewChapterMusic.play();
      clearTimeout(timeoutId);
      clearTimeout(scrollStateTimeout);
    }
  }),
  withHandlers({
    /** ON SCROLL ROUTING */
    interactiveScrollRouting: ({
      history,
      viewExpo,
      name,
      section,
      screen,
      handleScreen,
      screenViewer
    }) => async next => {
      if (!screenViewer) {
        const newSectionScreen = interactiveRouter(
          viewExpo,
          section,
          screen,
          next
        );

        if (newSectionScreen) {
          await handleScreen(newSectionScreen);
          history.push(
            `/view/${name}/${newSectionScreen.section}/${newSectionScreen.screen}`
          );
        }
      }
    }
  })
)(InteractiveScreen);
