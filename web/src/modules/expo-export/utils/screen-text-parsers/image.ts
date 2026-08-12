import { ImageScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addInfopoints } from "../common-text-parsers";

export const parseImageScreen = (
  screen: ImageScreen,
  sections: TextSections
): void => {
  addInfopoints(sections, screen.infopoints);
};
