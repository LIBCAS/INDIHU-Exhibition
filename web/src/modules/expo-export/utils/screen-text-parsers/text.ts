import { TextScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parseTextScreen = (
  screen: TextScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);
  addText(sections, "Text obrazovky", screen.mainText);
};
