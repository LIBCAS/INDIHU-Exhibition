import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose, lifecycle, withHandlers, withState } from "recompose";

import LeftScreen from "../../components/views/interactiveScreen/LeftScreen";
import RightScreen from "../../components/views/interactiveScreen/RightScreen";

import { interactiveRouter } from "../../utils";
import { screenUrl } from "../../enums/screenType";

const InteractiveScreen = ({
  viewScreen,
  interactiveScrollRouting,
  screenFiles,
  screenViewer,
  changing
}) => {
  if (!viewScreen || changing) return <div className="interactive" />;

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
  withState("changing", "setChanging", false),
  connect(({ expo: { viewChapterMusic, viewExpo, viewScreen } }) => ({
    viewChapterMusic,
    viewExpo,
    viewScreen
  })),
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
      screenViewer,
      setChanging
    }) => async next => {
      if (!screenViewer) {
        const newSectionScreen = interactiveRouter(
          viewExpo,
          section,
          screen,
          next
        );

        if (newSectionScreen) {
          setChanging(true);
          await handleScreen(newSectionScreen);
          if (
            newSectionScreen.section === screenUrl.START ||
            newSectionScreen.section === screenUrl.FINISH
          ) {
            history.push(`/view/${name}/${newSectionScreen.section}`);
          } else {
            history.push(
              `/view/${name}/${newSectionScreen.section}/${
                newSectionScreen.screen
              }`
            );
          }
        }
      }
    }
  })
)(InteractiveScreen);
