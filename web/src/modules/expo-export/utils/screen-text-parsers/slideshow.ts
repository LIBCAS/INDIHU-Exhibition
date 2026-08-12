import { SlideshowScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText, addInfopoints } from "../common-text-parsers";

export const parseSlideshowScreen = (
  screen: SlideshowScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);

  screen.images?.forEach((image, imageIndex) => {
    const imageLabel = `Obrázek ${imageIndex + 1}`;
    sections.push(imageLabel);

    addInfopoints(sections, image.infopoints);
  });
};
