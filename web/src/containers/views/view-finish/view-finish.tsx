import { useCallback, useEffect, useMemo } from "react";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "hooks/use-local-storage";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Custom hooks
import { breakpoints } from "hooks/media-query-hook/breakpoints";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";

// Components
import { Icon } from "components/icon/icon";
import { ViewFinishInfo } from "./view-finish-info"; // authors panel
import { ViewFinishButton } from "./view-finish-button"; // squared button with the icon in the middle

// Actions
import { setDialog } from "actions/dialog-actions";

// Models
import { AppDispatch, AppState } from "store/store";
import { Screen, ScreenWithOnlyTypeTitleDocuments, ExpoRates } from "models";
import { ScreenProps } from "models";
import { DialogType } from "components/dialogs/dialog-types";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  (viewExpo) => ({ viewExpo })
);

// - -

export const ViewFinish = ({
  screenPreloadedFiles,
  chapterMusicRef,
}: Omit<ScreenProps, "toolbarRef">) => {
  const { viewExpo } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const [expoRates, setExpoRates] = useLocalStorage<ExpoRates>(
    `isExpoRated`,
    {}
  );

  const { push } = useHistory();
  const isSmall = useMediaQuery(breakpoints.down("md"));
  const { t } = useTranslation("exhibition");

  const { url } = viewExpo ?? {};
  const { image } = screenPreloadedFiles;

  // - - - - - - - -

  // Preparing structure of files for FilesDialog
  // Array of .documents only for 'START' type of screen
  const structureStartFiles = useMemo(
    () => viewExpo?.structure.start.documents,
    [viewExpo?.structure.start.documents]
  );

  // 2D array like [ [chapter0 documents], [chapter1 documents], ... ]
  const structureScreenFiles = useMemo(() => {
    const structureScreenFiles:
      | ScreenWithOnlyTypeTitleDocuments[][]
      | undefined = viewExpo?.structure.screens.map(
      (actChapterScreens: Screen[]) => {
        const returnedArr = actChapterScreens.map((actScreen: Screen) => {
          const obj = {
            title: actScreen.title,
            type: actScreen.type,
          };

          if ("documents" in actScreen) {
            return {
              ...obj,
              documents: actScreen.documents,
            };
          }
          return obj;
        });

        return returnedArr;
      }
    );

    return structureScreenFiles;
  }, [viewExpo?.structure.screens]);

  // - - - - - - - -

  useEffect(() => {
    if (!chapterMusicRef.current) {
      return;
    }
    chapterMusicRef.current.pause();
    chapterMusicRef.current.currentTime = 0;
  }, [dispatch, chapterMusicRef]);

  const viewStart = useMemo(
    () => viewExpo?.structure.start,
    [viewExpo?.structure.start]
  );

  // - -

  // On mount, when viewFinish screen is loaded, open Rating dialog if not previously rated (saved into Local storage)
  useEffect(() => {
    if (!!viewExpo?.id && !expoRates[viewExpo.id]) {
      dispatch(
        setDialog(DialogType.RatingDialog, {
          setExpoRates: setExpoRates,
          expoId: viewExpo.id,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, viewExpo, expoRates]);

  // - - - - - - - - -

  // 1) Clicking on first share icon will open the share dialog
  const openShareDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.ShareExpoDialog, {
          url: `${window.location.origin}/view/${url}`,
        })
      ),
    [dispatch, url]
  );

  // 2) Clicking on second files of exposition will open the files dialog
  const openFilesDialog = useCallback(() => {
    if (!structureStartFiles || !structureScreenFiles) {
      return;
    }

    dispatch(
      setDialog(DialogType.FinishAllFilesDialog, {
        startFiles: structureStartFiles,
        screensFiles: structureScreenFiles,
      })
    );
  }, [dispatch, structureScreenFiles, structureStartFiles]);

  // 3) Clicking on third replay icon will redirect the user back to the start screen
  const replay = useCallback(() => push(`/view/${url}/start`), [push, url]);

  // 4) Clicking on fourth info icon will open the FinishInfoDialog
  // This icon button is visible only on small screens
  const openFinishInfoDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.FinishInfoDialog, {
          viewExpo,
          viewStart,
        })
      ),
    [dispatch, viewExpo, viewStart]
  );

  // - - - - - - - -

  return (
    <>
      {/* Image on small screen */}
      {isSmall && image && (
        <img
          src={image}
          className="w-full h-full absolute object-contain"
          alt="background"
        />
      )}

      <div className="w-full h-full flex absolute">
        {/* 1) Image and four icons inside (last icon is only on small screens) */}
        <div className="h-full grow relative">
          {!isSmall && image && (
            <img
              src={image}
              className="w-full h-full absolute object-contain"
              alt="background"
            />
          )}
          <div className="w-full h-full grid place-items-center absolute">
            <div className="flex gap-4">
              <ViewFinishButton
                label={t("share")}
                icon={<Icon color="white" name="share" />}
                onClick={openShareDialog}
              />
              {viewStart?.documents?.length && (
                <ViewFinishButton
                  label={t("files")}
                  icon={<Icon color="white" name="folder" />}
                  onClick={openFilesDialog}
                />
              )}
              <ViewFinishButton
                label={t("replay")}
                icon={<Icon color="white" name="replay" />}
                onClick={replay}
              />
              {isSmall && (
                <ViewFinishButton
                  label={t("info")}
                  icon={<Icon color="white" name="info" />}
                  onClick={openFinishInfoDialog}
                />
              )}
            </div>
          </div>
        </div>

        {/* 2) Side authors panel */}
        <div className="h-full bg-white p-8 shadow-md hidden md:block md:w-[400px]">
          <ViewFinishInfo viewExpo={viewExpo} viewStart={viewStart} />
        </div>
      </div>
    </>
  );
};
