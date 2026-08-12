import { Screen } from "models";
import { TextSections } from "../../typings";

import { addBaseScreenText } from "../common-text-parsers";

import { parseExternalScreen } from "./external";
import { parseFinishScreen } from "./finish";
import { parseGameDrawScreen } from "./game-draw";
import { parseGameFindScreen } from "./game-find";
import { parseGameMoveScreen } from "./game-move";
import { parseGameQuizScreen } from "./game-quiz";
import { parseGameSizingScreen } from "./game-sizing";
import { parseGameWipeScreen } from "./game-wipe";
import { parseImageChangeScreen } from "./image-change";
import { parseImageScreen } from "./image";
import { parseImageZoomScreen } from "./image-zoom";
import { parseIntroScreen } from "./intro";
import { parseParallaxScreen } from "./parallax";
import { parsePhotogalleryScreen } from "./photogallery";
import { parseSignpostScreen } from "./signpost";
import { parseSlideshowScreen } from "./slideshow";
import { parseStartScreen } from "./start";
import { parseSurveyScreen } from "./survey";
import { parseTextScreen } from "./text";
import { parseTimelineScreen } from "./timeline";
import { parseVideoScreen } from "./video";

/**
 *
 */
export const getScreenTextContent = (screen: Screen): string => {
  const sections: TextSections = [];

  addBaseScreenText(sections, screen);

  switch (screen.type) {
    case "START":
      parseStartScreen(screen, sections);
      break;
    case "FINISH":
      parseFinishScreen(screen, sections);
      break;
    case "INTRO":
      parseIntroScreen(screen, sections);
      break;
    case "IMAGE":
      parseImageScreen(screen, sections);
      break;
    case "VIDEO":
      parseVideoScreen(screen, sections);
      break;
    case "TEXT":
      parseTextScreen(screen, sections);
      break;
    case "PARALLAX":
      parseParallaxScreen(screen, sections);
      break;
    case "IMAGE_ZOOM":
      parseImageZoomScreen(screen, sections);
      break;
    case "TIMELINE":
      parseTimelineScreen(screen, sections);
      break;
    case "PHOTOGALERY":
      parseSlideshowScreen(screen, sections);
      break;
    case "PHOTOGALLERY_NEW":
      parsePhotogalleryScreen(screen, sections);
      break;
    case "IMAGE_CHANGE":
      parseImageChangeScreen(screen, sections);
      break;
    case "EXTERNAL":
      parseExternalScreen(screen, sections);
      break;
    case "SIGNPOST":
      parseSignpostScreen(screen, sections);
      break;
    case "SURVEY":
      parseSurveyScreen(screen, sections);
      break;
    case "GAME_FIND":
      parseGameFindScreen(screen, sections);
      break;
    case "GAME_DRAW":
      parseGameDrawScreen(screen, sections);
      break;
    case "GAME_WIPE":
      parseGameWipeScreen(screen, sections);
      break;
    case "GAME_SIZING":
      parseGameSizingScreen(screen, sections);
      break;
    case "GAME_MOVE":
      parseGameMoveScreen(screen, sections);
      break;
    case "GAME_OPTIONS":
      parseGameQuizScreen(screen, sections);
      break;
  }

  return sections.join("\n\n");
};
