import { SlideshowScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addInfopoints } from "../common-text-parsers";

export const parseSlideshowScreen = (
  screen: SlideshowScreen,
  sections: TextSections
): void => {
  screen.images?.forEach((image, imageIndex) => {
    if (image.infopoints.length > 0) {
      sections.push(`Obrázek ${imageIndex + 1}`);
      addInfopoints(sections, image.infopoints);
    }
  });
};
