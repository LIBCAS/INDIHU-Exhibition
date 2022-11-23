import { useMemo } from "react";
import { useParams } from "react-router-dom";

const parseIndex = (indexString?: string) => {
  if (!indexString) {
    return undefined;
  }

  const index = parseInt(indexString);
  return isNaN(index) ? undefined : index;
};

export const useSectionScreen = () => {
  const { section, screen } = useParams<{
    section: string;
    screen: string;
  }>();

  return useMemo(
    () => ({
      section: parseIndex(section),
      screen: parseIndex(screen),
    }),
    [screen, section]
  );
};
