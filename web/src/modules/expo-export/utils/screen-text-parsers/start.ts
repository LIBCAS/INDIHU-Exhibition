import { StartScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parseStartScreen = (
  screen: StartScreen,
  sections: TextSections
): void => {
  addText(sections, "Podnadpis", screen.subTitle);
  addText(sections, "Text obrazovky", screen.perex);
};
