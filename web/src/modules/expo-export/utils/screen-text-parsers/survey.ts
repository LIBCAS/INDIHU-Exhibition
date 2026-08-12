import { SurveyScreen } from "models";
import { TextSections } from "modules/expo-export/typings";
import { addText } from "../common-text-parsers";

export const parseSurveyScreen = (
  screen: SurveyScreen,
  sections: TextSections
): void => {
  addText(sections, "Zadání", screen.task);

  screen.surveyAnswers?.forEach((answer, index) => {
    addText(
      sections,
      `Odpověď ${index + 1}`,
      answer.customUserLabel ?? answer.text
    );
  });
};
