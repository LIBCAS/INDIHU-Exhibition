import { useMemo } from "react";

import { Screen } from "models";

import { ScreenChapters } from "./types";

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
