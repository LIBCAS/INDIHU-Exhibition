import { GameQuizScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addInfopoints, addText } from "../common-text-parsers";

export const parseGameQuizScreen = (
  screen: GameQuizScreen,
  sections: TextSections
): void => {
  addText(sections, "Zadání", screen.task);

  screen.answers.forEach((answer, index) => {
    const answerLabel = `Odpověď ${index + 1}`;
    sections.push(answerLabel);

    addText(sections, "Text odpovědi", answer.text);
    addInfopoints(sections, answer.infopoints);
  });
};
