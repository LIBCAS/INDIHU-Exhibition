import { screenType } from "enums/screen-type";
import { Screen } from "models";
import { Document } from "models";

const gameScreens = [
  screenType.GAME_DRAW,
  screenType.GAME_FIND,
  screenType.GAME_MOVE,
  screenType.GAME_OPTIONS,
  screenType.GAME_SIZING,
  screenType.GAME_WIPE,
];

export const isGameScreen = (type?: Screen["type"]) =>
  !!gameScreens.find((screenType) => screenType === type);

export const isStartOrFinishScreen = (type: Screen["type"]) => {
  return type === "START" || type === "FINISH";
};

// - - -

export const parseUrlSection = (
  section: string
): number | "start" | "finish" | undefined => {
  if (section === "start" || section === "finish") {
    return section;
  }

  const parsedSection = parseInt(section);
  if (isNaN(parsedSection)) {
    return undefined;
  }

  return parsedSection;
};

export const parseUrlScreen = (screen: string): number | undefined => {
  const parsedScreen = parseInt(screen);
  return isNaN(parsedScreen) ? undefined : parsedScreen;
};

// - - - - -

export const isWorksheetFile = (file: Document) => {
  if ("documentFileType" in file && file.documentFileType === "worksheet") {
    return true;
  }
  return false;
};
