import { ImageChangeScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText, addInfopoints } from "../common-text-parsers";

export const parseImageChangeScreen = (
  screen: ImageChangeScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);
  addInfopoints(sections, screen.image1Infopoints);
  addInfopoints(sections, screen.image2Infopoints);
};
