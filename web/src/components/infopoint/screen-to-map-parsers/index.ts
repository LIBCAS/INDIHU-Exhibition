import { parseGameQuizScreenMap } from "./game-quiz-parser";
import { parseImageChangeScreenMap } from "./image-change-parser";
import { parseImageScreenMap } from "./image-parser";
import { parseSlideshowScreenMap } from "./slideshow-parser";
import { parseTimelineScreenMap } from "./timeline-parser";
import { parseGameDrawScreenMap } from "./game-draw-parser";
import { parseGameSizingScreenMap } from "./game-sizing-parser";
import { parseGameEraseScreenMap } from "./game-erase-parser";
import { parseGameMoveScreenMap } from "./game-move-parser";

import {
  InfopointStatusMap,
  InfopointSupportedScreens,
} from "../useTooltipInfopoint";

import { screenType } from "enums/screen-type";

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
    case screenType.GAME_DRAW:
      return parseGameDrawScreenMap(viewScreen);
    case screenType.GAME_SIZING:
      return parseGameSizingScreenMap(viewScreen);
    case screenType.GAME_WIPE:
      return parseGameEraseScreenMap(viewScreen);
    case screenType.GAME_MOVE:
      return parseGameMoveScreenMap(viewScreen);
    default:
      throw new Error("Unsupported view screen type for infopoint map parser.");
  }
};
