import { ParallaxScreeen } from "models";
import { TextSections } from "modules/expo-export/typings";

// Parallax screens have no text fields beyond the shared title and description.
export const parseParallaxScreen = (
  _screen: ParallaxScreeen,
  _sections: TextSections
): undefined => undefined;
