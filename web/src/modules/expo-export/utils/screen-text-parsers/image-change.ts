import { ImageChangeScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText, addInfopoints } from "../common-text-parsers";

export const parseImageChangeScreen = (
  screen: ImageChangeScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);

  sections.push("Obrázek před");
  addInfopoints(sections, screen.image1Infopoints);

  sections.push("Obrázek po");
  addInfopoints(sections, screen.image2Infopoints);
};
