import { PhotogalleryScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parsePhotogalleryScreen = (
  screen: PhotogalleryScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);

  screen.images?.forEach((image, imageIndex) => {
    const photoLabel = `Fotografie ${imageIndex + 1}`;
    sections.push(photoLabel);

    addText(sections, "Název fotografie", image.photoTitle);
    addText(sections, "Popis fotografie", image.photoDescription);
  });
};
