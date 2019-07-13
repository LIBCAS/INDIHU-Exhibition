import React from "react";
import { compose, withState, withHandlers, lifecycle } from "recompose";
import { debounce } from "lodash";
import classNames from "classnames";
import FontIcon from "react-md/lib/FontIcons";

import { screenType } from "../../../enums/screenType";

import Image from "./Image";
import Video from "./Video";
import Text from "./Text";
import Parallax from "./Parallax";
import ImageChange from "./ImageChange";
import ChapterStart from "./ChapterStart";
import Photogallery from "./Photogallery";

const RightScreen = ({
  viewScreen,
  interactiveScroll,
  animationActive,
  parallaxState,
  actScale,
  scrolling,
  setScrolling,
  interactiveScrollRouting,
  setAnimationActive,
  moveForward,
  screenFiles,
  screenViewer
}) => {
  return (
    <div
      className={classNames("interactive-image", {
        "interactive-parallax": viewScreen.type === screenType.PARALLAX,
        "interactive-zoom": viewScreen.type === screenType.IMAGE_ZOOM
      })}
      onWheel={debounce(e => interactiveScroll(e.deltaY < 0), 500, {
        leading: true,
        trailing: false
      })}
    >
      {/* SCREEN INTRO */}
      {viewScreen.type === screenType.INTRO && (
        <ChapterStart {...{ viewScreen, screenFiles, screenType }} />
      )}
      {/* SCREEN PHOTOGALERY */}
      {viewScreen.type === screenType.PHOTOGALERY && (
        <Photogallery
          {...{
            viewScreen,
            screenFiles,
            screenType,
            scrolling,
            setScrolling,
            moveForward
          }}
        />
      )}
      {/* SCREEN WITH IMAGE */}
      {(viewScreen.type === screenType.IMAGE ||
        viewScreen.type === screenType.IMAGE_ZOOM) && (
        <Image
          {...{
            viewScreen,
            animationActive,
            actScale,
            scrolling,
            setScrolling,
            interactiveScrollRouting,
            setAnimationActive,
            moveForward,
            screenFiles,
            screenType
          }}
        />
      )}
      {/* VIDEO */}
      {viewScreen.type === screenType.VIDEO && (
        <Video {...{ viewScreen, screenFiles }} />
      )}
      {/* TEXT */}
      {viewScreen.type === screenType.TEXT && (
        <Text {...{ mainText: viewScreen.mainText }} />
      )}
      {/* PARALLAX */}
      {viewScreen.type === screenType.PARALLAX && (
        <Parallax
          {...{
            viewScreen,
            parallaxState,
            scrolling,
            setScrolling,
            interactiveScrollRouting,
            setAnimationActive,
            moveForward,
            screenFiles
          }}
        />
      )}
      {/* IMAGE_CHANGE */}
      {viewScreen.type === screenType.IMAGE_CHANGE && (
        <ImageChange
          {...{
            viewScreen,
            scrolling,
            setScrolling,
            interactiveScrollRouting,
            setAnimationActive,
            moveForward,
            screenFiles
          }}
        />
      )}
      {/* EXTERNAL */}
      {viewScreen.type === screenType.EXTERNAL && (
        <div
          className="external"
          dangerouslySetInnerHTML={{ __html: viewScreen.externalData }}
        />
      )}
      {/* NAVIGATION */}
      {!screenViewer && (
        <div className="interactive-navigation">
          <FontIcon
            className="interactive-navigation-item"
            iconClassName="fa fa-caret-left"
            onClick={() => interactiveScrollRouting(false)}
          />
          <FontIcon
            className="interactive-navigation-item"
            iconClassName="fa fa-caret-right"
            onClick={() => interactiveScrollRouting(true)}
          />
        </div>
      )}
    </div>
  );
};

export default compose(
  withState("moveForward", "setMoveForward", false),
  withState("scrollState", "setScrollState", false),
  withState("scrolling", "setScrolling", false),
  withState("scrollStateTimeout", "setScrollStateTimeout", null),
  withState("animationActive", "setAnimationActive", false),
  withHandlers({
    interactiveScroll: ({
      scrollState,
      setScrolling,
      animationActive,
      interactiveScrollRouting,
      viewScreen,
      setMoveForward
    }) => moveForward => {
      if (scrollState && !animationActive) {
        setMoveForward(moveForward);

        if (
          viewScreen.type === screenType.TEXT ||
          viewScreen.type === screenType.VIDEO
        ) {
          interactiveScrollRouting(moveForward);
        } else {
          setScrolling(true);
        }
      }
    }
  }),
  withHandlers({
    manageKeyAction: ({ interactiveScroll }) => e => {
      if (e.keyCode === 37 || e.keyCode === 38) {
        interactiveScroll(true);
      } else if (e.keyCode === 39 || e.keyCode === 40) {
        interactiveScroll(false);
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      const {
        setScrollState,
        setScrollStateTimeout,
        manageKeyAction
      } = this.props;

      document.addEventListener("keydown", manageKeyAction);

      setScrollStateTimeout(setTimeout(() => setScrollState(true), 1000));
    },
    componentWillUnmount() {
      const { scrollStateTimeout, manageKeyAction } = this.props;

      document.removeEventListener("keydown", manageKeyAction);

      clearTimeout(scrollStateTimeout);
    }
  })
)(RightScreen);
