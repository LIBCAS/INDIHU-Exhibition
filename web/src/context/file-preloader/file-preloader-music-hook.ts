import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useFiles } from "hooks/view-hooks/files-hook";
import { useSectionScreenParams } from "hooks/view-hooks/section-screen-params-hook";

import { clearObjectUrls, retrieveFileUrl } from "./file-preloader-utils";

import { AppState } from "store/store";
import { IntroScreen } from "models";
import { ChapterMusicCache } from "./file-preloader-provider";

// - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  (viewExpo) => ({ viewExpo })
);

// On Screen mount, always fetch current section music, e.g 2/5 will fetch chapterMusic of third chapter
// Also, when the next or previous screen is INTRO screen, preload next or previous chapterMusic
export const useFilePreloaderMusic = () => {
  const { viewExpo } = useSelector(stateSelector);
  const fileLookupMap = useFiles();
  const { section, screen } = useSectionScreenParams();
  const { name: expoName } = useParams<{ name: string }>();

  const expoScreens = viewExpo?.structure?.screens;

  const [chapterMusicCache, setChapterMusicCache] = useState<ChapterMusicCache>(
    {}
  );
  const [isMusicLoading, setIsMusicLoading] = useState<boolean>(false);

  // - - -

  const prevSection = useMemo(() => {
    if (section === "start") {
      return undefined;
    }
    if (section === "finish") {
      return undefined;
    }

    if (
      section !== undefined &&
      section >= 1 &&
      screen !== undefined &&
      screen === 0
    ) {
      return section - 1;
    }

    return undefined;
  }, [section, screen]);

  const nextSection = useMemo(() => {
    if (!expoScreens || section === "finish") {
      return undefined;
    }

    if (section === "start") {
      return expoScreens.length >= 1 ? 0 : undefined;
    }

    if (
      section !== undefined &&
      section < expoScreens.length - 1 &&
      screen !== undefined &&
      screen === expoScreens[section].length - 1
    ) {
      return section + 1;
    }
    return undefined;
  }, [section, screen, expoScreens]);

  // - - -

  const loadSectionMusic = useCallback(
    (section: number) => {
      if (section in chapterMusicCache) {
        return;
      }

      setIsMusicLoading(true);

      const introScreen = expoScreens?.[section]?.[0] as
        | IntroScreen
        | undefined;
      const musicId = introScreen?.music;

      if (musicId === undefined) {
        setChapterMusicCache((prev) => ({ ...prev, [section]: undefined }));
        setIsMusicLoading(false);
        return;
      }

      const promise = retrieveFileUrl(musicId, fileLookupMap);
      promise.then((blobMusicUrl) => {
        if (blobMusicUrl !== undefined) {
          setChapterMusicCache((prev) => ({
            ...prev,
            [section]: blobMusicUrl,
          }));
        }
        setIsMusicLoading(false);
      });
    },
    [chapterMusicCache, expoScreens, fileLookupMap]
  );

  useEffect(() => {
    if (section !== undefined && section !== "start" && section !== "finish") {
      loadSectionMusic(section);
    }

    if (prevSection !== undefined) {
      loadSectionMusic(prevSection);
    }
    if (nextSection !== undefined) {
      loadSectionMusic(nextSection);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, prevSection, nextSection]);

  useEffect(() => {
    return () => {
      clearObjectUrls(chapterMusicCache);
      setChapterMusicCache({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expoName]);

  return {
    chapterMusicCache: chapterMusicCache,
    isMusicLoading: isMusicLoading,
  };
};
