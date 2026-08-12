import { PhotogalleryScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parsePhotogalleryScreen = (
  screen: PhotogalleryScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);

  screen.images?.forEach((image, imageIndex) => {
    addText(sections, `Fotografie ${imageIndex + 1}: název`, image.photoTitle);
    addText(
      sections,
      `Fotografie ${imageIndex + 1}: popis`,
      image.photoDescription
    );
  });
};
