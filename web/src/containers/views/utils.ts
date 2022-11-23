import { screenType } from "enums/screen-type";
import { Screen } from "models";

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
