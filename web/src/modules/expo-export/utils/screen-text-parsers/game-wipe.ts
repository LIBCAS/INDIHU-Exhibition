import { GameWipeScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addInfopoints, addText } from "../common-text-parsers";

export const parseGameWipeScreen = (
  screen: GameWipeScreen,
  sections: TextSections
): void => {
  addText(sections, "Zadání", screen.task);
  addInfopoints(sections, screen.infopoints1);
  addInfopoints(sections, screen.infopoints2);
};
