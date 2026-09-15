import { GameFindScreen } from "models";
import { addInfopoints, addText } from "../common-text-parsers";
import { TextSections } from "modules/expo-export/typings";

export const parseGameFindScreen = (
  screen: GameFindScreen,
  sections: TextSections
): void => {
  addText(sections, "Zadání", screen.task);

  sections.push("Obrázek zadání");
  screen.pinsTexts?.forEach((pinText, index) => {
    addText(sections, `Text označení ${index + 1}`, pinText);
  });

  sections.push("Výsledný obrázek");
  addInfopoints(sections, screen.image2Infopoints);
};
