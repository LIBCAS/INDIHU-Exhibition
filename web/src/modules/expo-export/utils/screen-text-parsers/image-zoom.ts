import { ZoomScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parseImageZoomScreen = (
  screen: ZoomScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);

  screen.sequences?.forEach((sequence, index) => {
    const sequenceLabel = `Sekvence ${index + 1}`;
    sections.push(sequenceLabel);

    addText(sections, "Popis sekvence", sequence.text);
  });
};
