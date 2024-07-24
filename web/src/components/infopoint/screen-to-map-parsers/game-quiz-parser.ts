import { GameQuizScreen } from "models";
import { InfopointStatusMap } from "../useTooltipInfopoint";

export const parseGameQuizScreenMap = (viewScreen: GameQuizScreen) => {
  const infopointsMap = viewScreen.answers?.reduce(
    (acc, currAnswer, currAnswerIndex) => {
      const reducedAnswer = currAnswer.infopoints?.reduce(
        (innerAcc, currInfopoint, currInfopointIndex) => {
          return {
            ...innerAcc,
            [`${currAnswerIndex}-${currInfopointIndex}`]: {
              isOpen: currInfopoint.alwaysVisible,
              isAlwaysVisible: currInfopoint.alwaysVisible,
            },
          };
        },
        {}
      );

      return { ...acc, ...reducedAnswer };
    },
    {}
  );

  return infopointsMap as InfopointStatusMap;
};
