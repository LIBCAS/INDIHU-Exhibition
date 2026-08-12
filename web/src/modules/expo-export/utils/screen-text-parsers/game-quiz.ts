import { GameQuizScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addInfopoints, addText } from "../common-text-parsers";

export const parseGameQuizScreen = (
  screen: GameQuizScreen,
  sections: TextSections
): void => {
  addText(sections, "Zadání", screen.task);

  screen.answers.forEach((answer, index) => {
    addText(
      sections,
      `Odpověď ${index + 1}`,
      answer.customUserLabel ?? answer.text
    );
    addInfopoints(sections, answer.infopoints);
  });
};
