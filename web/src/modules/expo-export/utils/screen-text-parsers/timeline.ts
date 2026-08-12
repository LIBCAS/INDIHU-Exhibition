import { TimelineScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText, addInfopoints } from "../common-text-parsers";

export const parseTimelineScreen = (
  screen: TimelineScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);
  addText(sections, "Název časové osy", screen.timelineName);
  addInfopoints(sections, screen.infopoints);
};
