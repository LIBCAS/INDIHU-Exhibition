import { useMemo } from "react";

import { Screen } from "models";

import { ScreenChapters } from "./types";

export const useScreenChapters = (screens?: Screen[][]) => {
  const screenChapters = useMemo(
    () =>
      screens?.reduce<ScreenChapters[]>((acc, chapter, sectionIndex) => {
        if (!chapter.length) {
          return acc;
        }

        const screen = { ...chapter[0], sectionIndex, screenIndex: 0 };
        if (chapter.length === 1) {
          return [...acc, screen];
        }

        const subScreens = chapter.slice(1).map((screen, screenIndex) => ({
          ...screen,
          sectionIndex,
          screenIndex: screenIndex + 1,
        }));

        return [...acc, { ...screen, subScreens }];
      }, []),
    [screens]
  );

  return screenChapters;
};
