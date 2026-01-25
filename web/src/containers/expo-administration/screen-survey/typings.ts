type SurveyBaseAnswer = {
  expoId: string;
  screenId: string;
};

export type SurveyChoiceAnswer = SurveyBaseAnswer & {
  answerType: "CHOICE";
  answer: "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
};

export type SurveyFreeAnswer = SurveyBaseAnswer & {
  answerType: "FREE";
  answer: string;
};

export type SurveyAnswer = SurveyChoiceAnswer | SurveyFreeAnswer;

// - - - - - -

export type SurveyAnswerItem = SurveyAnswer & {
  id: string;
  created: string;
  updated: string;
};
