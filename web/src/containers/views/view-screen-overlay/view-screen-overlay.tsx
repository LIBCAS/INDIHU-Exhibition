import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";
import { animated, useSpring } from "react-spring";

import useElementSize from "hooks/element-size-hook";
import { useQuery } from "hooks/use-query";
import { useExpoNavigation } from "../hooks/expo-navigation-hook";
import { useExpoScreenProgress } from "../hooks/expo-screen-progress-hook";
import { asTutorialSteps, useTutorial } from "components/tutorial/use-tutorial";
import { useDrawerPanel } from "context/drawer-panel-preloader/drawer-panel-provider";

//import { Tooltip } from "react-tooltip";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { ProgressBar } from "components/progress-bar/progress-bar";

import { ExpoProgressBar } from "./expo-progress-bar/expo-progress-bar";
import { ChaptersButton } from "./chapters-button";

import { ViewScreenOverlayDrawer } from "./view-screen-overlay-drawer";

import {
  setViewProgress,
  muteVolumes,
  unmuteVolumes,
} from "actions/expoActions/viewer-actions";
import { setDialog } from "actions/dialog-actions";

import cx from "classnames";
import classes from "./view-screen-overlay.module.scss";

import { AppDispatch, AppState } from "store/store";
import { tickTime } from "constants/view-screen-progress";
import { isGameScreen } from "../utils";
import { DialogType } from "components/dialogs/dialog-types";

// - - -

const useTutorialSteps = () => {
  const { t } = useTranslation("tutorial");

  return useMemo(
    () =>
      asTutorialSteps([
        {
          key: "info",
          label: t("overlay.info.label"),
          text: t("overlay.info.text"),
        },
        {
          key: "navigation",
          label: t("overlay.navigation.label"),
          text: t("overlay.navigation.text"),
        },
        {
          key: "chapters",
          label: t("overlay.chapters.label"),
          text: t("overlay.chapters.text"),
        },
        {
          key: "audio",
          label: t("overlay.audio.label"),
          text: t("overlay.audio.text"),
        },
        {
          key: "play",
          label: t("overlay.play.label"),
          text: t("overlay.play.text"),
        },
        {
          key: "progressbar",
          label: t("overlay.progressbar.label"),
          text: t("overlay.progressbar.text"),
        },
      ]),
    [t]
  );
};

const statesSelector = createSelector(
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.expoVolumes,
  (shouldIncrement, viewScreen, expoVolumes) => ({
    shouldIncrement,
    viewScreen,
    expoVolumes,
  })
);

type ViewScreenOverlayProps = {
  isOverlayHidden: boolean;
  chapterMusicRef: React.RefObject<HTMLAudioElement>;
  children:
    | ReactNode
    | ((toolbarRef: RefObject<HTMLDivElement>) => JSX.Element);
};

export const ViewScreenOverlay = ({
  children,
  isOverlayHidden,
  chapterMusicRef,
}: ViewScreenOverlayProps) => {
  const { shouldIncrement, viewScreen, expoVolumes } =
    useSelector(statesSelector);
  const dispatch = useDispatch<AppDispatch>();

  const tutorialSteps = useTutorialSteps();
  const { bind, step, TutorialTooltip, escapeTutorial } = useTutorial(
    "overlay",
    tutorialSteps
  );

  const query = useQuery();
  const [actionsBoxRef, actionsBoxSize] = useElementSize(); // actions panel, right down with buttons
  const { t } = useTranslation(["screen", "tutorial"]);
  const { navigateBack, navigateForward } = useExpoNavigation();

  const timeoutRef = useRef<NodeJS.Timeout>();
  const toolbarRef = useRef<HTMLDivElement>(null); // info, left down panel

  const forwardButtonRef = useRef<HTMLDivElement>(null);

  const [key, setKey] = useState<number>(0); // incrementing on replay
  const [unactive, setUnactive] = useState<boolean>(true); // automatically inactive after 4s without mouse movement

  // 1.) Opening and closing of the left panel Drawer!
  const { isDrawerPanelOpen, openDrawer, closeDrawer } = useDrawerPanel();

  const { opacity } = useSpring({
    opacity: unactive && !isDrawerPanelOpen ? 0 : 1,
  });

  const amIGameScreen = useMemo(
    () => isGameScreen(viewScreen?.type),
    [viewScreen?.type]
  );

  const isVideoOrPhotogalleryScreen = useMemo(() => {
    return viewScreen?.type === "VIDEO" || viewScreen?.type === "PHOTOGALERY";
  }, [viewScreen?.type]);

  const isScreenInPreview = useMemo(() => query.get("preview"), [query]);

  const [wasMouseMovement, setWasMouseMovement] = useState<boolean>(false);

  /* If viewScreen.audio is set or viewChapterMusic is set*/
  /* In other words.. if screen has its own audio, or the whole chapter music is set! */
  const hasAudio =
    (viewScreen && "audio" in viewScreen && viewScreen.audio) ||
    chapterMusicRef.current ||
    (viewScreen && "video" in viewScreen && viewScreen.video);

  const isAudioMuted = useMemo(
    () =>
      expoVolumes.speechVolume.actualVolume === 0 &&
      expoVolumes.musicVolume.actualVolume === 0,
    [expoVolumes]
  );

  //
  const openSettingsDialog = useCallback(() => {
    dispatch(setDialog(DialogType.SettingsDialog, {}));
  }, [dispatch]);

  // 2.) Play/Pause button && space bar - toggling between shouldIncrement true/false -> showProgress.timeElapsed
  const play = useCallback(
    () => dispatch(setViewProgress({ shouldIncrement: true })),
    [dispatch]
  );

  const pause = useCallback(
    () => dispatch(setViewProgress({ shouldIncrement: false })),
    [dispatch]
  );

  // 3.) Replay - replay button rendered only if screen is inPreview mode (?preview=true)
  const replay = useCallback(() => {
    dispatch(setViewProgress({ timeElapsed: 0 }));
    setKey((prev) => (prev + 1) % 1000);
  }, [dispatch]);

  //
  const openAudioDialog = useCallback(
    () => dispatch(setDialog(DialogType.AudioDialog, {})),
    [dispatch]
  );

  // Mute callback - fired when pressing M on keyboard
  const toggleSound = useCallback(() => {
    if (
      expoVolumes.speechVolume.actualVolume !== 0 ||
      expoVolumes.musicVolume.actualVolume !== 0
    ) {
      dispatch(muteVolumes(expoVolumes));
      return;
    }

    dispatch(unmuteVolumes(expoVolumes));
  }, [expoVolumes, dispatch]);

  // NEW - on enter and on space keyboard action, start the expo (like clicking the start button)
  const handleExpoStart = useCallback(() => {
    dispatch(setViewProgress({ shouldIncrement: true }));
    navigateForward();
  }, [dispatch, navigateForward]);

  // 5.) After 4 seconds of mouse inactivity, set the True initialized unActive state to false
  const onMouseAction = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setUnactive(false);

    const timeout = setTimeout(() => setUnactive(true), 4000);
    timeoutRef.current = timeout;

    return () => {
      if (timeoutRef.current) {
        return;
      }
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // 6.) Keyboard - arrows navigation, space bar will stop the progress, escape will close the side Drawer panel
  const onKeydownAction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        navigateForward();
      }
      if (event.key === "ArrowLeft") {
        navigateBack();
      }
      if (event.key === "Escape") {
        //Tooltip.hide();
        escapeTutorial();
        closeDrawer();
      }
      if (event.key === "m") {
        toggleSound();
      }
      if (event.key === " ") {
        // Exception for the START first screen, the spacebar there will start the expo
        if (viewScreen?.type === "START") {
          handleExpoStart();
          return;
        }
        (shouldIncrement ? pause : play)();
      }
      if (event.key === "Enter") {
        if (viewScreen?.type === "START") {
          handleExpoStart();
        }
      }
    },
    [
      closeDrawer,
      navigateBack,
      navigateForward,
      pause,
      play,
      shouldIncrement,
      viewScreen,
      handleExpoStart,
      toggleSound,
      escapeTutorial,
    ]
  );

  /* 7.) Add and remove event listeners (basically on mount and unmount) */
  useEffect(() => {
    window.addEventListener("keydown", onKeydownAction);
    window.addEventListener("mousemove", onMouseAction);
    window.addEventListener("mousedown", onMouseAction);

    return () => {
      window.removeEventListener("keydown", onKeydownAction);
      window.removeEventListener("mousemove", onMouseAction);
      window.removeEventListener("mousedown", onMouseAction);
    };
  }, [onKeydownAction, onMouseAction]);

  // On every screen change.. set the mouse movement to false
  useEffect(() => {
    setWasMouseMovement(false);
  }, [viewScreen]);

  // Dont redirect the GameScreen (normally redirect after e.g 15s) after the mouse movement
  useEffect(() => {
    let shouldRedirect = true;
    if (isGameScreen(viewScreen?.type) && wasMouseMovement) {
      shouldRedirect = false;
    }

    dispatch(setViewProgress({ shouldRedirect: shouldRedirect }));
  }, [wasMouseMovement, dispatch, viewScreen]);

  // - -

  /* START, FINISH does not have this Overlay Wrapper! */
  if (isOverlayHidden) {
    // First Div next to the <audio> element!
    // Children is here ScreenComponent without overlay (START or FINISH) which will retrieve the toolbarRef!
    return (
      <div className="w-full h-full overflow-hidden" key={key}>
        {children instanceof Function ? children(toolbarRef) : children}
      </div>
    );
  }

  return (
    <>
      {/* First Div next to the <audio> element! */}
      {/* Children is here ScreenComponent with overlay which will retrieve toolbarRef */}
      <div
        className="w-full h-full overflow-hidden"
        key={key}
        onMouseDown={() => setWasMouseMovement(true)}
        onMouseMove={() => setWasMouseMovement(true)}
      >
        {/* Children as Screen Component! */}
        {children instanceof Function ? children(toolbarRef) : children}
      </div>

      {/* Second Div next to the <audio> element! */}
      {/* This div is the overlay which is on top of the rendered previously ScreenComponent! */}
      <animated.div
        className={cx(
          classes.overlay, // grid
          "fixed left-0 top-0 bg-none pointer-events-none h-full w-full grid z-40 "
        )}
        style={{ opacity }}
      >
        {/* a) Button Navigate Back */}
        {!isScreenInPreview && (
          <div
            className={cx(
              classes.leftNav, // leftNav in the grid
              "flex h-full items-center justify-start"
            )}
          >
            <div className="pointer-events-auto">
              <Button color="white" onClick={navigateBack}>
                <Icon name="chevron_left" />
              </Button>
            </div>
          </div>
        )}

        {/* b) Button Navigate Forward */}
        {!isScreenInPreview && (
          <div
            className={cx(
              classes.rightNav, // rightNav in the grid
              "flex h-full items-center justify-end"
            )}
          >
            <div className="pointer-events-auto" {...bind("navigation")}>
              <div ref={forwardButtonRef}>
                <Button color="white" onClick={navigateForward}>
                  <Icon name="chevron_right" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* c) Info on the left down (opening drawyer) */}
        <div
          className={cx(
            classes.info, // info in the grid
            "flex h-full items-end p-3 gap-2 justify-start"
          )}
          ref={toolbarRef}
        >
          <div {...bind("info")}>
            {!amIGameScreen && (
              <div
                {...bind("progressbar")}
                className="flex flex-col bg-white pointer-events-auto"
              >
                <ExpoTimeProgress
                  key={`${viewScreen?.id}-${key}`}
                  isVideoOrPhotogalleryScreen={isVideoOrPhotogalleryScreen}
                />
                <div
                  className="flex justify-between gap-4 p-4 cursor-pointer min-w-[300px]"
                  onClick={openDrawer}
                >
                  <span>{viewScreen?.title ?? t("no-title")}</span>
                  <Icon name="info" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* d) Actions on the right down (play/pause && mute && chapters button) */}
        <div
          className={cx(
            classes.actions,
            "flex items-end justify-end p-3 gap-2 h-full"
          )}
          ref={actionsBoxRef}
        >
          {/* d0 - settings dialog */}
          <div className="pointer-events-auto">
            <Button color="white" onClick={openSettingsDialog}>
              <Icon name="settings" />
            </Button>
          </div>

          {/* d1 - play/pause button ALWAYS*/}
          <div className="pointer-events-auto" {...bind("play")}>
            <Button color="white" onClick={shouldIncrement ? pause : play}>
              <Icon name={shouldIncrement ? "pause" : "play_arrow"} />
            </Button>
          </div>

          {/* d2 - audio dialog CONDITIONAL */}
          {(hasAudio || step?.key === "audio") && (
            <div className="pointer-events-auto" {...bind("audio")}>
              <Button color="white" onClick={openAudioDialog}>
                <Icon name={isAudioMuted ? "volume_off" : "volume_up"} />
              </Button>
            </div>
          )}

          {/* d3 - replay button CONDITIONAL */}
          {isScreenInPreview && (
            <div className="pointer-events-auto">
              <Button color="white" onClick={replay}>
                <Icon name="replay" />
              </Button>
            </div>
          )}
          {/* d4 - chapters button */}
          <div className="pointer-events-auto" {...bind("chapters")}>
            <ChaptersButton maxHeight={actionsBoxSize.height - 35} />
          </div>
        </div>

        {/* e) ExpoProgressBar - whole expo, all screens overview (thumbnails) */}
        <div className={cx(classes.progressBar, "h-full pointer-events-auto")}>
          <ExpoProgressBar />
        </div>
      </animated.div>

      {TutorialTooltip}

      {/* Third div - rendered always - not always opened */}
      <ViewScreenOverlayDrawer
        isDrawerOpen={isDrawerPanelOpen}
        onClose={closeDrawer}
        forwardButtonRef={forwardButtonRef}
      />
    </>
  );
};

/* Component used only once on the Info (toolbarRef) panel */
/* Pruh above the information */
type ExpoTimeProgressProps = {
  isVideoOrPhotogalleryScreen: boolean;
};

const ExpoTimeProgress = ({
  isVideoOrPhotogalleryScreen,
}: ExpoTimeProgressProps) => {
  const { percentage } = useExpoScreenProgress({ offsetTotalTime: -tickTime });
  return (
    <ProgressBar
      height={isVideoOrPhotogalleryScreen ? 10 : 6}
      percentage={percentage}
      color={isVideoOrPhotogalleryScreen ? "secondary" : "primary"}
    />
  );
};
