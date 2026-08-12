import { Infopoint, Screen } from "models";
import { TextSections } from "../typings";

/**
 * Converts WYSIWYG HTML to readable plain text while preserving line breaks.
 */
export const getPlainText = (value: string | undefined): string => {
  if (!value) {
    return "";
  }

  const markupWithLineBreaks = value
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n");
  const text = new DOMParser().parseFromString(
    markupWithLineBreaks,
    "text/html"
  ).body.textContent;

  return (text ?? "").replace(/\n{3,}/g, "\n\n").trim();
};

/**
 * Adds a labeled section only when its value contains visible text.
 */
export const addText = (
  sections: TextSections,
  label: string,
  value: string | undefined
): void => {
  const text = getPlainText(value);

  if (text) {
    sections.push(`${label}\n${text}`);
  }
};

/**
 * Adds fields shared by all screen types before type-specific parsing.
 */
export const addBaseScreenText = (
  sections: TextSections,
  screen: Screen
): void => {
  addText(sections, "Název obrazovky", screen.title);

  if ("text" in screen) {
    addText(sections, "Text obrazovky", screen.text);
  }
};

/**
 * Adds textual infopoint content in the same order as the source array.
 */
export const addInfopoints = (
  sections: TextSections,
  infopoints: Infopoint[] | undefined
): void => {
  infopoints?.forEach((infopoint, index) => {
    const infopointSections: TextSections = [];

    addText(infopointSections, "Název", infopoint.header);
    addText(infopointSections, "Text", infopoint.text);
    addText(infopointSections, "Název odkazu", infopoint.urlName);
    addText(
      infopointSections,
      "Název odkazované obrazovky",
      infopoint.screenNameReference
    );

    if (infopointSections.length > 0) {
      sections.push(
        `Infopoint ${index + 1}\n${infopointSections.join("\n\n")}`
      );
    }
  });
};
