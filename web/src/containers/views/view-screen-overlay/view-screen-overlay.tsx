import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  RefObject,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { animated, useSpring } from "react-spring";
import { useExpoNavigation } from "hooks/view-hooks/expo-navigation-hook";
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import { useIsAnyTutorialOpened } from "context/tutorial-provider/tutorial-provider";
import { useDrawerPanel } from "context/drawer-panel-provider/drawer-panel-provider";

// Components
import { ExpoProgressBar } from "./expo-progress-bar/expo-progress-bar";
import { ViewScreenOverlayDrawer } from "./view-screen-overlay-drawer";
import InfoPanel from "./InfoPanel/InfoPanel";
import ActionsPanel from "./ActionsPanel/ActionsPanel";
import BackwardButton from "./NavigationButtons/BackwardButton";
import ForwardButton from "./NavigationButtons/ForwardButton";

// Actions
import {
  setViewProgress,
  muteVolumes,
  unmuteVolumes,
} from "actions/expoActions/viewer-actions";

// Models
import { AppDispatch, AppState } from "store/store";

// Utils
import cx from "classnames";
import classes from "./view-screen-overlay.module.scss";
import { isGameScreen } from "../../../utils/view-utils";
import { useGlassMagnifierConfig } from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";

// - - - - - -

const statesSelector = createSelector(
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.expoVolumes,
  ({ expo }: AppState) => expo.screensInfo.isPhotogalleryLightboxOpened,
  (shouldIncrement, viewScreen, expoVolumes, isPhotogalleryLightboxOpened) => ({
    shouldIncrement,
    viewScreen,
    expoVolumes,
    isPhotogalleryLightboxOpened,
  })
);

// - - - - - -

type ViewScreenOverlayProps = {
  isOverlayHidden: boolean;
  chapterMusicRef: React.RefObject<HTMLAudioElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
  children:
    | ReactNode
    | ((toolbarRef: RefObject<HTMLDivElement>) => JSX.Element);
};

export const ViewScreenOverlay = ({
  children,
  isOverlayHidden,
  chapterMusicRef,
  audioRef,
}: ViewScreenOverlayProps) => {
  const {
    viewScreen,
    shouldIncrement,
    expoVolumes,
    isPhotogalleryLightboxOpened,
  } = useSelector(statesSelector);
  const dispatch = useDispatch<AppDispatch>();

  // States
  const [unactive, setUnactive] = useState<boolean>(true); // automatically inactive after 4s without mouse movement
  const [wasMouseMovement, setWasMouseMovement] = useState<boolean>(false); // for game screens, if was mouse movement, stop redirection to next screen
  const [isProgressbarHovered, setIsProgressbarHovered] = useState(false); // Progressbar height animation on hover
  const [key] = useState<number>(0); // incrementing on replay

  // Refs
  const timeoutRef = useRef<NodeJS.Timeout>();
  const toolbarRef = useRef<HTMLDivElement>(null); // info, left down panel
  const forwardButtonRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const { navigateBack, navigateForward } = useExpoNavigation();

  const { bind, step, TutorialTooltip, escapeTutorial, isTutorialOpen } =
    useTutorial("overlay", unactive === false);
  const isAnyTutorialOpened = useIsAnyTutorialOpened();

  const { isDrawerPanelOpen, openDrawer, closeDrawer } = useDrawerPanel();

  const { setIsGlassMagnifierEnabled } = useGlassMagnifierConfig();

  // Animations
  const { opacity } = useSpring({
    opacity: unactive && !isDrawerPanelOpen ? 0 : 1,
  });

  const { barHeight } = useSpring({
    barHeight: isProgressbarHovered ? 25 : 15,
  });

  // Callbacks
  const play = useCallback(
    () => dispatch(setViewProgress({ shouldIncrement: true })),
    [dispatch]
  );

  const pause = useCallback(
    () => dispatch(setViewProgress({ shouldIncrement: false })),
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

  // on enter and on space keyboard action, start the expo (like clicking the start button)
  const handleExpoStart = useCallback(() => {
    dispatch(setViewProgress({ shouldIncrement: true }));
    navigateForward();
  }, [dispatch, navigateForward]);

  // After 4 seconds of mouse inactivity, set the True initialized unActive state to false
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

  // - - -
  // EFFECTS

  // On every screen change.. set the mouse movement to false
  useEffect(() => {
    setWasMouseMovement(false);
  }, [viewScreen]);

  // Dont redirect the GameScreen (normally redirect after e.g 15s) after the mouse movement
  useEffect(() => {
    if (isGameScreen(viewScreen?.type) && wasMouseMovement) {
      dispatch(setViewProgress({ shouldRedirect: false }));
    }
  }, [wasMouseMovement, dispatch, viewScreen]);

  // - - -

  // Keyboard - arrows navigation, space bar will stop the progress, escape will close the side Drawer panel
  const onKeydownAction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && !isPhotogalleryLightboxOpened) {
        navigateForward();
      }
      if (event.key === "ArrowLeft" && !isPhotogalleryLightboxOpened) {
        navigateBack();
      }
      if (event.key === "Escape") {
        escapeTutorial();
        closeDrawer();
        setIsGlassMagnifierEnabled(false);
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
      isPhotogalleryLightboxOpened,
      navigateForward,
      navigateBack,
      escapeTutorial,
      closeDrawer,
      setIsGlassMagnifierEnabled,
      toggleSound,
      viewScreen?.type,
      shouldIncrement,
      pause,
      play,
      handleExpoStart,
    ]
  );

  /* Add and remove event listeners (basically on mount and unmount) */
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

  // - - - - - - - - - - - -

  // START and FINISH screens does not have Overlay Wrapper!
  // Render just the screen itself without the Overlay div
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
      {/* 1. First div next to the <audio> element, inside there is always the content of ScreenComponent itself */}
      <div
        className="w-full h-full overflow-hidden"
        key={key}
        onMouseDown={() => setWasMouseMovement(true)}
        onMouseMove={() => setWasMouseMovement(true)}
      >
        {children instanceof Function ? children(toolbarRef) : children}
      </div>

      {/* 2. Second div next to the <audio> element(s), first part of overlay, over ScreenComponent, but under drawer (z-index 40) */}
      <animated.div
        className={cx(
          classes.overlay, // grid parent
          "fixed left-0 top-0 bg-none pointer-events-none h-full w-full grid z-40 "
        )}
        // Animations of grid parent overlay
        style={{
          opacity,
          gridTemplateRows: barHeight.to((h) => `3fr 1fr 3fr ${h}px`),
        }}
      >
        {/* 2a) Info panel - left down corner, can open the Drawer */}
        <InfoPanel
          toolbarRef={toolbarRef}
          openDrawer={openDrawer}
          keyKey={key}
          bind={bind}
          isTutorialOpen={isTutorialOpen}
          isAnyTutorialOpened={isAnyTutorialOpened}
          step={step}
        />

        {/* 2b) Actions panel - right down corner, action buttons */}
        <ActionsPanel
          isScreenAudioPresent={audioRef.current !== null}
          isChapterMusicPresent={chapterMusicRef.current !== null}
          play={play}
          pause={pause}
          bind={bind}
          isTutorialOpen={isTutorialOpen}
          isAnyTutorialOpened={isAnyTutorialOpened}
          step={step}
        />

        {/* 2c) ExpoProgressBar - progressbar in the bottom of the screen, for whole expo with thumnbnails */}
        <div
          className={cx(
            classes.progressBar,
            "h-full pointer-events-auto",
            isAnyTutorialOpened && "bg-black opacity-40"
          )}
          onMouseEnter={() => setIsProgressbarHovered(true)}
          onMouseLeave={() => setIsProgressbarHovered(false)}
        >
          <ExpoProgressBar isProgressbarHovered={isProgressbarHovered} />
        </div>

        {/* Keyboard binding.. */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          {...bind("keyboard")}
        />
      </animated.div>

      {/* 3) Drawer Panel, always rendered even when closed but translated to the left */}
      {/* Over ScreenComponent and over first part of overlay, but under the following navigation overlay part (z-index 50) */}
      <ViewScreenOverlayDrawer
        isDrawerOpen={isDrawerPanelOpen}
        onClose={closeDrawer}
        forwardButtonRef={forwardButtonRef}
      />

      {/* 4. Second part of the overlay, z-index 50, over ScreenComponent and also over Drawer panel */}
      {!isPhotogalleryLightboxOpened && (
        <div
          className={cx(
            classes.overlay, // grid parent
            "fixed left-0 top-0 bg-none pointer-events-none h-full w-full grid z-50"
          )}
        >
          <BackwardButton
            navigateBack={navigateBack}
            isTutorialOpen={isTutorialOpen}
            isAnyTutorialOpened={isAnyTutorialOpened}
            step={step}
          />

          <ForwardButton
            navigateForward={navigateForward}
            forwardButtonRef={forwardButtonRef}
            bind={bind}
            isTutorialOpen={isTutorialOpen}
            isAnyTutorialOpened={isAnyTutorialOpened}
            step={step}
          />
        </div>
      )}

      {/* 5) Grayish covering when this overlay tutorial is active */}
      {isTutorialOpen && (
        <div className="w-full h-full absolute top-0 left-0 bg-black opacity-40 z-50" />
      )}

      {/* 6) Popper, Tooltip for the Tutorial when active */}
      {TutorialTooltip}
    </>
  );
};
