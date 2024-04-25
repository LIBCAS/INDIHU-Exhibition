import { useMemo } from "react";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { ExpoStructure, FinishScreen, Screen, StartScreen } from "models";
import { AppState } from "store/store";

// - -

export type ChapterIndexedScreen = Screen & {
  chapterIndex: number;
  screenIndex: number;
};
type DelimiterObj = {
  type: "DELIMITOR";
  chapterIndex: number | "start" | "finish";
};
type FlattenedStructure = (ChapterIndexedScreen | DelimiterObj | undefined)[];
type AllFlattenedStructure = (
  | StartScreen
  | FinishScreen
  | ChapterIndexedScreen
  | DelimiterObj
  | undefined
)[];

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) =>
    expo.activeExpo?.structure as ExpoStructure | undefined,
  ({ expo }: AppState) => expo.viewExpo?.structure,
  (activeExpoStructure, viewExpoStructure) => ({
    activeExpoStructure,
    viewExpoStructure,
  })
);

// - -

export const useExpoScreenStructure = () => {
  const { activeExpoStructure, viewExpoStructure } = useSelector(stateSelector);

  // NOTE: object { start, screens, finish, files }
  const expoStructure = useMemo(
    () => viewExpoStructure ?? activeExpoStructure ?? undefined,
    [activeExpoStructure, viewExpoStructure]
  );

  // - -

  // NOTE: flattened 2D screens to 1D, chapters are delimited by delimitor object
  const chapterScreensStructure =
    expoStructure?.screens.reduce<FlattenedStructure>(
      (acc, currChapter, currChapterIndex) => {
        const chapterScreens = currChapter.reduce<ChapterIndexedScreen[]>(
          (innerAcc, currScreen, currScreenIndex) => {
            const newInnerAcc = [
              ...innerAcc,
              {
                ...currScreen,
                chapterIndex: currChapterIndex,
                screenIndex: currScreenIndex,
              },
            ];
            return newInnerAcc;
          },
          []
        );

        const delimitorObj: DelimiterObj = {
          type: "DELIMITOR",
          chapterIndex: currChapterIndex,
        };
        const newOuterAcc = [...acc, delimitorObj, ...chapterScreens];
        return newOuterAcc;
      },
      []
    );

  // - -

  // NOTE: extending screens with start and finish screen
  const startDelimitor: DelimiterObj = {
    type: "DELIMITOR",
    chapterIndex: "start",
  };

  const finishDelimitor: DelimiterObj = {
    type: "DELIMITOR",
    chapterIndex: "finish",
  };

  const allScreensStructure: AllFlattenedStructure = [
    startDelimitor,
    expoStructure?.start,
    ...(chapterScreensStructure ?? []),
    finishDelimitor,
    expoStructure?.finish,
  ];

  return {
    expoStructure,
    chapterScreensStructure,
    allScreensStructure,
  };
};
