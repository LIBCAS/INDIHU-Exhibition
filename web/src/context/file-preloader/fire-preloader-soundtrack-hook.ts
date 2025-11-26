import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Hooks
import { useSectionScreenParams } from "hooks/view-hooks/section-screen-hook";
import { useFiles } from "hooks/view-hooks/files-hook";

// Types
import { AppState } from "store/store";

// Utils
import { clearObjectUrls, retrieveFileUrl } from "./file-preloader-utils";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  (viewExpo) => ({ viewExpo })
);

// - - - - - -

export const useFilePreloaderSoundtrack = () => {
  const { viewExpo } = useSelector(stateSelector);
  const { section } = useSectionScreenParams();
  const fileLookupMap = useFiles();

  // - - - Derived variables - - -

  const startScreen = useMemo(
    () => viewExpo?.structure?.start,
    [viewExpo?.structure?.start]
  );

  // - - - States - - -

  const [soundtrackUrl, setSoundtrackUrl] = useState<string | null>(null);

  const [isSoundtrackLoading, setIsSoundtrackLoading] =
    useState<boolean>(false);

  // - - - Callbacks - - -

  const handleLoadSoundtrack = useCallback(async () => {
    try {
      if (!startScreen) {
        const errMsg = "Start screen is being not defined!";
        throw Error(errMsg);
      }

      setIsSoundtrackLoading(true);

      const expoSoundtrackId = startScreen?.expoSoundtrack;
      if (!expoSoundtrackId) {
        return;
      }

      const blobSoundtrackUrl = await retrieveFileUrl(
        expoSoundtrackId,
        fileLookupMap
      );

      if (!blobSoundtrackUrl) {
        const errMsg = "Failed to retrieve blob url of the soundtrack file!";
        throw Error(errMsg);
      }

      setSoundtrackUrl(blobSoundtrackUrl);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const errMsg = `[handleLoadSoundtrack]: ${msg}`;
      console.error(errMsg);
    } finally {
      setIsSoundtrackLoading(false);
    }
  }, [startScreen, fileLookupMap]);

  // - - - Effects - - -

  /**
   * Effect responsible for loading the soundtrack blob file
   */
  useEffect(() => {
    if (section === undefined) {
      return;
    }

    // NOTE: If it was already preloaded once, we do not need to preload it again
    if (soundtrackUrl) {
      return;
    }

    const handleSoundtrackPreload = async () => {
      await handleLoadSoundtrack();
    };

    handleSoundtrackPreload();
  }, [section, soundtrackUrl, handleLoadSoundtrack]);

  /**
   * Effect responsible for revoking / clearing the preloaded blob file
   */
  useEffect(() => {
    return () => {
      if (soundtrackUrl) {
        clearObjectUrls(soundtrackUrl);
        setSoundtrackUrl(null);
      }
    };
  }, [soundtrackUrl]);

  // - - - Return Value - - -

  return { soundtrackUrl, isSoundtrackLoading };
};
