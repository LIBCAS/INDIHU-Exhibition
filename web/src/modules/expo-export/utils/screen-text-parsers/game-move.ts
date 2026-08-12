import { GameMoveScreen } from "models";
import { addInfopoints, addText } from "../common-text-parsers";
import { TextSections } from "modules/expo-export/typings";

export const parseGameMoveScreen = (
  screen: GameMoveScreen,
  sections: TextSections
): void => {
  addText(sections, "Zadání", screen.task);
  addInfopoints(sections, screen.image2Infopoints);
};
