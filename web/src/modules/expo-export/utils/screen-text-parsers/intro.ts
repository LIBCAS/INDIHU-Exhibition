import { IntroScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parseIntroScreen = (
  screen: IntroScreen,
  sections: TextSections
): void => {
  addText(sections, "Podnadpis", screen.subTitle);
};
