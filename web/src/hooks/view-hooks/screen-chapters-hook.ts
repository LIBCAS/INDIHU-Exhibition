import { useMemo } from "react";
import { Screen, ScreenChapters } from "models";

// Input is expo.viewExpo.structure.screens as 2D array of screens
// Result is ScreenChapters[], which represents the array where ich item is INTRO chapter screen
// Each INTRO chapter screen has its own properties + additional sectionIndex, screenIndex, its subScreens
export const useScreenChapters = (structureScreens?: Screen[][]) => {
  const screenChapters = useMemo(
    () =>
      structureScreens?.reduce<ScreenChapters[]>(
        (acc, currentChapter, sectionIndex) => {
          if (!currentChapter.length) {
            return acc;
          }

          const screen = { ...currentChapter[0], sectionIndex, screenIndex: 0 };
          if (currentChapter.length === 1) {
            return [...acc, screen];
          }

          const subScreens = currentChapter
            .slice(1)
            .map((screen, screenIndex) => ({
              ...screen,
              sectionIndex,
              screenIndex: screenIndex + 1,
            }));

          return [...acc, { ...screen, subScreens }];
        },
        []
      ),
    [structureScreens]
  );

  return screenChapters;
};
