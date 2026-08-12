import { GameWipeScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addInfopoints, addText } from "../common-text-parsers";

export const parseGameWipeScreen = (
  screen: GameWipeScreen,
  sections: TextSections
): void => {
  addText(sections, "Zadání", screen.task);

  sections.push("Vrchní obrázek");
  addInfopoints(sections, screen.infopoints1);

  sections.push("Spodní obrázek");
  addInfopoints(sections, screen.infopoints2);
};
