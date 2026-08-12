import { GameDrawScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addInfopoints, addText } from "../common-text-parsers";

export const parseGameDrawScreen = (
  screen: GameDrawScreen,
  sections: TextSections
): void => {
  addText(sections, "Zadání", screen.task);

  sections.push("Podkladový obrázek");
  addInfopoints(sections, screen.infopoints1);
};
