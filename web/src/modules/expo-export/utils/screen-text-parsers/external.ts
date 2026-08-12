import { ExternalScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parseExternalScreen = (
  screen: ExternalScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);
};
