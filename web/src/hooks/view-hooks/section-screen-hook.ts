import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { parseUrlSection, parseUrlScreen } from "utils";

export const useSectionScreenParams = () => {
  const { section, screen } = useParams<{
    section: string;
    screen: string;
  }>();

  return useMemo(
    () => ({
      section: parseUrlSection(section),
      screen: parseUrlScreen(screen),
    }),
    [screen, section]
  );
};
