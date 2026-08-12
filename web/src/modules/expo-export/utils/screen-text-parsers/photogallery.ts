import { PhotogalleryScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parsePhotogalleryScreen = (
  screen: PhotogalleryScreen,
  sections: TextSections
): void => {
  addText(sections, "Text obrazovky", screen.text);

  screen.images?.forEach((image, imageIndex) => {
    const photoSections: TextSections = [];

    addText(photoSections, "Název", image.photoTitle);
    addText(photoSections, "Popis", image.photoDescription);
    sections.push(
      `Fotografie ${imageIndex + 1}\n${photoSections.join("\n\n")}`
    );
  });
};
