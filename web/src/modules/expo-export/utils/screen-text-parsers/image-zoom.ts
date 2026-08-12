import { ZoomScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parseImageZoomScreen = (
  screen: ZoomScreen,
  sections: TextSections
): void => {
  screen.sequences?.forEach((sequence, index) => {
    addText(sections, `Sekvence ${index + 1}`, sequence.text);
  });
};
