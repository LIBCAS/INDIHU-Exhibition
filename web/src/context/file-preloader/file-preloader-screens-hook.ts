import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// Custom hooks
import { useSectionScreen } from "hooks/view-hooks/section-screen-hook";
import { useFiles } from "hooks/view-hooks/files-hook";
import { useQuery } from "hooks/use-query";
import { useUpdateEffect } from "hooks/update-effect-hook";

// Models
import { AppState } from "store/store";
import { Screen } from "models";
import { ScreenCoordinates } from "models";
import {
  ScreenPreloads,
  FilesCache,
  ScreenPreloadedFiles,
} from "./file-preloader-provider";

// Utils
import { clearObjectUrls, extractFiles } from "./file-preloader-utils";

// - - - - - - - - - - -

type CachePromiseMap = Map<string, Promise<ScreenPreloadedFiles>>;

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  (viewExpo) => ({ viewExpo })
);

const createCacheKey = (coordinates: ScreenCoordinates) =>
  typeof coordinates === "string" ? coordinates : coordinates.join(",");

export const useFilePreloaderScreens = (): ScreenPreloads => {
  const { viewExpo } = useSelector(stateSelector);
  const { section: currentSectionString, name: expoName } = useParams<{
    section: string;
    name: string;
  }>();
  const { section, screen } = useSectionScreen();
  const query = useQuery();
  const fileLookupMap = useFiles();

  // To know which screens were already resolved -> their files were already preloaded
  // keys of this map looks like (`${section},${screen}`)
  const promises = useRef<CachePromiseMap>(new Map());

  // Cache for previosly preloaded files, available as 'blob:'
  const [fileCache, setFileCache] = useState<FilesCache>({});

  //
  const structure = viewExpo?.structure;
  const screens = viewExpo?.structure.screens;

  // 1.) current section + screen as tuple -- [number, number]
  const current = useMemo<ScreenCoordinates>(() => {
    if (section === undefined || screen === undefined) {
      return currentSectionString === "finish" ? "finish" : "start";
    }

    return [section, screen];
  }, [screen, section, currentSectionString]);

  // 2.) previous and next section + screen as tuple -- [number, number]
  const [previous, next] = useMemo<
    [ScreenCoordinates, ScreenCoordinates]
  >(() => {
    if (current === "start") {
      const afterStart: ScreenCoordinates = screens?.[0]?.[0]
        ? [0, 0]
        : "finish";
      return ["start", afterStart];
    }

    if (current === "finish") {
      const beforeFinish: ScreenCoordinates = screens?.[screens.length - 1]?.[
        screens[screens.length - 1].length - 1
      ]
        ? [screens.length - 1, screens[screens.length - 1].length - 1]
        : "finish";
      return [beforeFinish, "finish"];
    }

    const [section, screen] = current;
    if (!screens) {
      return ["start", "finish"];
    }

    const previous: ScreenCoordinates =
      screen >= 1
        ? [section, screen - 1]
        : section >= 1
        ? [section - 1, screens[section - 1].length - 1]
        : "start";

    const next: ScreenCoordinates =
      screen < screens[section]?.length - 1
        ? [section, screen + 1]
        : section < screens.length - 1
        ? [section + 1, 0]
        : "finish";

    return [previous, next];
  }, [current, screens]);

  // 3.) For Screen given by coordinates as tuple [number, number], preload screen's files
  // If were already preloaded, ignore this screen
  const startLoading = useCallback(
    (coordinates: ScreenCoordinates) => {
      const key = createCacheKey(coordinates);
      const currentPromise = promises.current.get(key);
      if (currentPromise !== undefined) {
        return;
      }

      const screen: Screen | undefined =
        typeof coordinates === "string"
          ? structure?.[coordinates]
          : screens?.[coordinates[0]][coordinates[1]];

      // async promise - extracting all screen files (keys like image, images, music, audio, ...)
      // when promise is resolved.. for each extracted screen[key], we have string 'blob:'
      const promise = extractFiles(screen, fileLookupMap);

      // resolving here
      promise.then((screenPreloadedFiles) =>
        setFileCache((prev) => ({ ...prev, [key]: screenPreloadedFiles }))
      );
      promises.current.set(key, promise);
    },
    [fileLookupMap, screens, structure]
  );

  // 4.) Start preloading of current, previous, next screen
  // If some of these screens were previously preloaded, ignore these screens
  useEffect(() => {
    startLoading(current);

    // dont load neighbor screens when in screen preview
    // if (query.get("preview")) return;

    startLoading(previous);
    startLoading(next);
  }, [current, next, previous, query, startLoading]);

  // 5.) When expo is changed, revoke blob urls, clear cache and map of which screens were preloaded
  // Will run only on second render.. not the first one
  useUpdateEffect(() => {
    clearObjectUrls(fileCache);
    setFileCache({});
    promises.current.clear();
  }, [expoName]);

  // 6.) Go to fileCache, retrieve the preloaded files of current screen
  const screenPreloadedFiles = useMemo(() => {
    const key = createCacheKey(current);
    return fileCache[key];
  }, [current, fileCache]);

  // 7.)
  const isLoading = useMemo(
    () => !screenPreloadedFiles,
    [screenPreloadedFiles]
  );

  return useMemo(
    () => ({
      fileCache: fileCache,
      screenPreloadedFiles: screenPreloadedFiles,
      isLoading: isLoading,
    }),
    [fileCache, screenPreloadedFiles, isLoading]
  );
};
