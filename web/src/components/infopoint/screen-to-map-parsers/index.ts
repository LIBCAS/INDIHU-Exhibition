import { parseGameQuizScreenMap } from "./game-quiz-parser";
import { parseImageChangeScreenMap } from "./image-change-parser";
import { parseImageScreenMap } from "./image-parser";
import { parseSlideshowScreenMap } from "./slideshow-parser";

import {
  InfopointStatusMap,
  InfopointSupportedScreens,
} from "../useTooltipInfopoint";

import { screenType } from "enums/screen-type";
import { parseTimelineScreenMap } from "./timeline-parser";

export const parseScreenToInfopointStatusMap = (
  viewScreen: InfopointSupportedScreens
): InfopointStatusMap => {
  switch (viewScreen.type) {
    case screenType.GAME_OPTIONS:
      return parseGameQuizScreenMap(viewScreen);
    case screenType.IMAGE_CHANGE:
      return parseImageChangeScreenMap(viewScreen);
    case screenType.IMAGE:
      return parseImageScreenMap(viewScreen);
    case screenType.SLIDESHOW:
      return parseSlideshowScreenMap(viewScreen);
    case screenType.TIMELINE:
      return parseTimelineScreenMap(viewScreen);
    default:
      throw new Error("Unsupported view screen type for infopoint map parser.");
  }
};
