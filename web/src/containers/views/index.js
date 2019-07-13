import React from "react";
import { connect } from "react-redux";

import ViewChapter from "./ViewChapter";
import ViewImage from "./ViewImage";
import ViewVideo from "./ViewVideo";
import ViewText from "./ViewText";
import ViewParallax from "./ViewParallax";
import ViewZoomIn from "./ViewZoomIn";
import ViewPhotogallery from "./ViewPhotogallery";
import ViewImageChange from "./ViewImageChange";
import ViewExternal from "./ViewExternal";
import ViewGameFind from "./ViewGameFind";
import ViewGameDraw from "./ViewGameDraw";
import ViewGameWipe from "./ViewGameWipe";
import ViewGameSizing from "./ViewGameSizing";
import ViewGameMove from "./ViewGameMove";
import ViewGameOptions from "./ViewGameOptions";
import ViewError from "./ViewError";

import { screenType } from "../../enums/screenType";

const Viewers = ({
  viewExpo,
  viewScreen,
  preloadedFiles,
  sFiles,
  name,
  section,
  screen,
  getNextUrlPart,
  getPrevUrlPath
}) => {
  const screenFiles = sFiles || preloadedFiles[section][screen];

  const screenProps = {
    getNextUrlPart,
    getPrevUrlPath,
    screenFiles
  };

  if (viewScreen) {
    switch (viewScreen.type) {
      case screenType.INTRO:
        return <ViewChapter {...screenProps} />;
      case screenType.IMAGE:
        return <ViewImage {...screenProps} />;
      case screenType.VIDEO:
        return <ViewVideo {...screenProps} />;
      case screenType.TEXT:
        return <ViewText {...screenProps} />;
      case screenType.PARALLAX:
        return <ViewParallax {...screenProps} />;
      case screenType.IMAGE_ZOOM:
        return <ViewZoomIn {...screenProps} />;
      case screenType.PHOTOGALERY:
        return <ViewPhotogallery {...screenProps} />;
      case screenType.IMAGE_CHANGE:
        return <ViewImageChange {...screenProps} />;
      case screenType.EXTERNAL:
        return <ViewExternal {...screenProps} />;
      case screenType.GAME_FIND:
        return <ViewGameFind {...screenProps} />;
      case screenType.GAME_DRAW:
        return <ViewGameDraw {...screenProps} />;
      case screenType.GAME_WIPE:
        return <ViewGameWipe {...screenProps} />;
      case screenType.GAME_SIZING:
        return <ViewGameSizing {...screenProps} />;
      case screenType.GAME_MOVE:
        return <ViewGameMove {...screenProps} />;
      case screenType.GAME_OPTIONS:
        return <ViewGameOptions {...screenProps} />;
      default:
        return <ViewError />;
    }
  } else return <ViewError />;
};

export default connect(
  ({ expo: { viewExpo, viewScreen, preloadedFiles } }) => ({
    viewExpo,
    viewScreen,
    preloadedFiles
  }),
  null
)(Viewers);
