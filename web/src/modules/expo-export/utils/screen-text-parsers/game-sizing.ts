import { GameSizingScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addInfopoints, addText } from "../common-text-parsers";

export const parseGameSizingScreen = (
  screen: GameSizingScreen,
  sections: TextSections
): void => {
  addText(sections, "Zadání", screen.task);

  sections.push("Výsledný obrázek");
  addInfopoints(sections, screen.infopoints3);
};
