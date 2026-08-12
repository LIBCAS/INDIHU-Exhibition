import { VideoScreen } from "models";
import { TextSections } from "modules/expo-export/typings";

// Video screens have no text fields beyond the shared title and description.
export const parseVideoScreen = (
  _screen: VideoScreen,
  _sections: TextSections
): undefined => undefined;
