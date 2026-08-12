import { SignpostScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parseSignpostScreen = (
  screen: SignpostScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);
  addText(sections, "Nadpis rozcestníku", screen.header);
  addText(sections, "Podnadpis rozcestníku", screen.subheader);

  screen.links.forEach((link, index) => {
    addText(sections, `Odkaz ${index + 1}`, link.customUserLabel ?? link.text);
  });
};
