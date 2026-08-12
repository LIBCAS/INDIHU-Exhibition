import { ParallaxScreeen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parseParallaxScreen = (
  screen: ParallaxScreeen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);
};
