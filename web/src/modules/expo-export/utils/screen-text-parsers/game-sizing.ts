import { GameSizingScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addInfopoints, addText } from "../common-text-parsers";

export const parseGameSizingScreen = (
  screen: GameSizingScreen,
  sections: TextSections
): void => {
  addText(sections, "Zadání", screen.task);
  addInfopoints(sections, screen.infopoints3);
};
