import { FinishScreen } from "models";
import { TextSections } from "modules/expo-export/typings";

// The finish screen only has the title already handled by the shared parser.
export const parseFinishScreen = (
  _screen: FinishScreen,
  _sections: TextSections
): undefined => undefined;
