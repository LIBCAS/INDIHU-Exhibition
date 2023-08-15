import { useMemo } from "react";
import { useParams } from "react-router-dom";

const parseSection = (sectionIndex: string) => {
  if (sectionIndex === "start") {
    return "start" as const;
  }
  if (sectionIndex === "finish") {
    return "finish" as const;
  }

  const parsedSection = parseInt(sectionIndex);
  return isNaN(parsedSection) ? undefined : parsedSection;
};

const parseScreen = (screenIndex: string) => {
  const parsedScreen = parseInt(screenIndex);
  return isNaN(parsedScreen) ? undefined : parsedScreen;
};

// - - -

export const useSectionScreenParams = () => {
  const { section, screen } = useParams<{
    section: string;
    screen: string;
  }>();

  return useMemo(
    () => ({
      section: parseSection(section),
      screen: parseScreen(screen),
    }),
    [screen, section]
  );
};
