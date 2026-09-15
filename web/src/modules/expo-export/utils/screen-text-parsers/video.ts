import { VideoScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parseVideoScreen = (
  screen: VideoScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);
};
