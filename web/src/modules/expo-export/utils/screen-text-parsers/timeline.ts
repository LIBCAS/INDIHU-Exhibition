import { TimelineScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addInfopoints } from "../common-text-parsers";

export const parseTimelineScreen = (
  screen: TimelineScreen,
  sections: TextSections
): void => {
  addInfopoints(sections, screen.infopoints);
};
