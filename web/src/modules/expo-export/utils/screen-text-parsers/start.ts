import { StartScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText, getPlainText } from "../common-text-parsers";

export const parseStartScreen = (
  screen: StartScreen,
  sections: TextSections
): void => {
  addText(sections, "Podnadpis", screen.subTitle);
  addText(sections, "Text obrazovky", screen.perex);
  addText(sections, "Organizace", screen.organization);
  addText(sections, "Webové stránky organizace", screen.organizationLink);

  const imprint = screen.collaborators
    ?.reduce<string[]>((entries, { role, text }) => {
      const entry = [getPlainText(role), getPlainText(text)]
        .filter(Boolean)
        .join("\n");

      if (entry) {
        entries.push(entry);
      }

      return entries;
    }, [])
    .join("\n\n");

  addText(sections, "Tiráž", imprint);
};
