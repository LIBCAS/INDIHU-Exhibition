import { useCallback, useEffect, useState } from "react";

const getMatches = (query: string): boolean =>
  window?.matchMedia(query).matches ?? false;

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(getMatches(query));

  const handleChange = useCallback(() => {
    const matchResult = getMatches(query);

    setMatches(matchResult);
  }, [query]);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // trigger change
    handleChange();

    matchMedia.addEventListener("change", handleChange);

    return () => matchMedia.removeEventListener("change", handleChange);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
};
