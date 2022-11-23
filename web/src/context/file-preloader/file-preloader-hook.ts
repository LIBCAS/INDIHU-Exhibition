import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";

import { AppState } from "store/store";
import { useSectionScreen } from "containers/views/hooks/section-screen-hook";
import { ScreenCoordinates } from "containers/views/types";
import { useFiles } from "containers/views/hooks/files-hook";
import { useUpdateEffect } from "hooks/update-effect-hook";
import { useQuery } from "hooks/use-query";

import { clearObjectUrls, extractFiles } from "./file-preloader-utils";
import {
  FilePreloaderContextType,
  FilesCache,
  ScreenFiles,
} from "./file-preloader-types";

type CachePromiseMap = Map<string, Promise<ScreenFiles>>;

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  (viewExpo) => ({ viewExpo })
);

const createCacheKey = (coordinates: ScreenCoordinates) =>
  typeof coordinates === "string" ? coordinates : coordinates.join(",");

export const useFilePreloaderContext = (): FilePreloaderContextType => {
  const { section: sectionStringParam, name: expoName } = useParams<{
    section: string;
    name: string;
  }>();
  const query = useQuery();
  const { viewExpo } = useSelector(stateSelector);
  const fileLookupMap = useFiles();
  const promises = useRef<CachePromiseMap>(new Map());
  const [fileCache, setFileCache] = useState<FilesCache>({});
  const { section, screen } = useSectionScreen();
  const structure = viewExpo?.structure;
  const screens = viewExpo?.structure.screens;

  const current = useMemo<ScreenCoordinates>(() => {
    if (section === undefined || screen === undefined) {
      return sectionStringParam === "finish" ? "finish" : "start";
    }

    return [section, screen];
  }, [screen, section, sectionStringParam]);

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

  const startLoading = useCallback(
    (coordinates: ScreenCoordinates) => {
      const key = createCacheKey(coordinates);
      const currentPromise = promises.current.get(key);
      if (currentPromise !== undefined) {
        return;
      }

      const screen =
        typeof coordinates === "string"
          ? structure?.[coordinates]
          : screens?.[coordinates[0]][coordinates[1]];
      const promise = extractFiles(screen, fileLookupMap);
      promise.then((screenFiles) =>
        setFileCache((prev) => ({ ...prev, [key]: screenFiles }))
      );
      promises.current.set(key, promise);
    },
    [fileLookupMap, screens, structure]
  );

  useEffect(() => {
    startLoading(current);

    // dont load neighbor screens when in screen preview
    if (query.get("preview")) return;

    startLoading(previous);
    startLoading(next);
  }, [current, next, previous, query, startLoading]);

  useUpdateEffect(() => {
    clearObjectUrls(fileCache);
    setFileCache({});
    promises.current.clear();
  }, [expoName]);

  const screenFiles = useMemo(() => {
    const key = createCacheKey(current);
    return fileCache[key];
  }, [current, fileCache]);

  const isLoading = useMemo(() => !screenFiles, [screenFiles]);

  return useMemo(
    () => ({ fileCache, screenFiles, isLoading }),
    [fileCache, screenFiles, isLoading]
  );
};
