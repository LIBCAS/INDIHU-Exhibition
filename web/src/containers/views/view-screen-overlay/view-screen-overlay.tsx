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
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { animated, useSpring } from "react-spring";
import Tooltip from "react-tooltip";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { AppDispatch, AppState } from "store/store";
import { ProgressBar } from "components/progress-bar/progress-bar";
import { tickTime } from "constants/view-screen-progress";
import useElementSize from "hooks/element-size-hook";
import {
  setViewProgress,
  turnSoundOff,
} from "actions/expoActions/viewer-actions";
import { useQuery } from "hooks/use-query";
import { asTutorialSteps, useTutorial } from "components/tutorial/use-tutorial";

import { useExpoNavigation } from "../hooks/expo-navigation-hook";
import classes from "./view-screen-overlay.module.scss";
import { ViewScreenOverlayDrawer } from "./view-screen-overlay-drawer";
import { useExpoScreenProgress } from "../hooks/expo-screen-progress-hook";
import { ChaptersButton } from "./chapters-button";
import { ExpoProgressBar } from "./expo-progress-bar/expo-progress-bar";
import { isGameScreen } from "../utils";

type ViewScreenOverlayProps = {
  hidden?: boolean;
  children:
    | ReactNode
    | ((toolbarRef: RefObject<HTMLDivElement>) => JSX.Element);
};

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.soundIsTurnedOff,
  ({ expo }: AppState) => expo.viewChapterMusic,
  (shouldIncrement, viewScreen, soundIsTurnedOff, viewChapterMusic) => ({
    shouldIncrement,
    viewScreen,
    soundIsTurnedOff,
    viewChapterMusic,
  })
);

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
      ]),
    [t]
  );
};

export const ViewScreenOverlay = ({
  children,
  hidden = false,
}: ViewScreenOverlayProps) => {
  const [key, setKey] = useState(0);
  const [unactive, setUnactive] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { shouldIncrement, viewScreen, soundIsTurnedOff, viewChapterMusic } =
    useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { navigateBack, navigateForward } = useExpoNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [ref, actionsBoxSize] = useElementSize();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(["screen", "tutorial"]);
  const query = useQuery();
  const tutorialSteps = useTutorialSteps();
  const { bind, step, TutorialTooltip } = useTutorial("overlay", tutorialSteps);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const { opacity } = useSpring({
    opacity: unactive && !isOpen ? 0 : 1,
  });

  const isGame = useMemo(
    () => isGameScreen(viewScreen?.type),
    [viewScreen?.type]
  );

  const pause = useCallback(
    () => dispatch(setViewProgress({ shouldIncrement: false })),
    [dispatch]
  );

  const play = useCallback(
    () => dispatch(setViewProgress({ shouldIncrement: true })),
    [dispatch]
  );

  const toggleSound = useCallback(() => {
    dispatch(turnSoundOff(!soundIsTurnedOff));
  }, [dispatch, soundIsTurnedOff]);

  const isPreview = useMemo(() => query.get("preview"), [query]);

  const hasAudio =
    (viewScreen && "audio" in viewScreen && viewScreen.audio) ||
    viewChapterMusic;

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

  const onKeydownAction = useCallback(
    ({ key }: KeyboardEvent) => {
      if (key === "ArrowRight") {
        navigateForward();
      }
      if (key === "ArrowLeft") {
        navigateBack();
      }
      if (key === "Escape") {
        Tooltip.hide();
        close();
      }
      if (key === " ") {
        (shouldIncrement ? pause : play)();
      }
    },
    [close, navigateBack, navigateForward, pause, play, shouldIncrement]
  );

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

  const replay = useCallback(() => {
    dispatch(setViewProgress({ timeElapsed: 0 }));
    setKey((prev) => (prev + 1) % 1000);
  }, [dispatch]);

  if (hidden) {
    return (
      <div className="w-full h-full overflow-hidden" key={key}>
        {children instanceof Function ? children(toolbarRef) : children}
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full overflow-hidden" key={key}>
        {children instanceof Function ? children(toolbarRef) : children}
      </div>
      <animated.div
        className={cx(
          classes.overlay,
          "fixed left-0 top-0 bg-none pointer-events-none h-full w-full grid z-40 "
        )}
        style={{ opacity }}
      >
        {!isPreview && (
          <div
            className={cx(
              classes.leftNav,
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

        {!isPreview && (
          <div
            className={cx(
              classes.rightNav,
              "flex h-full items-center justify-end"
            )}
          >
            <div className="pointer-events-auto" {...bind("navigation")}>
              <Button color="white" onClick={navigateForward}>
                <Icon name="chevron_right" />
              </Button>
            </div>
          </div>
        )}

        <div
          className={cx(
            classes.info,
            "flex h-full items-end p-3 gap-2 justify-start"
          )}
          ref={toolbarRef}
        >
          <div {...bind("info")}>
            {!isGame && (
              <div className="flex flex-col bg-white pointer-events-auto">
                <ExpoTimeProgress key={`${viewScreen?.id}-${key}`} />
                <div
                  className="flex justify-between gap-4 p-4 cursor-pointer min-w-[300px]"
                  onClick={open}
                >
                  <span>{viewScreen?.title ?? t("no-title")}</span>
                  <Icon name="info" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={cx(
            classes.actions,
            "flex items-end justify-end p-3 gap-2 h-full"
          )}
          ref={ref}
        >
          <div className="pointer-events-auto" {...bind("play")}>
            <Button color="white" onClick={shouldIncrement ? pause : play}>
              <Icon name={shouldIncrement ? "pause" : "play_arrow"} />
            </Button>
          </div>
          {(hasAudio || step?.key == "audio") && (
            <div className="pointer-events-auto" {...bind("audio")}>
              <Button color="white" onClick={toggleSound}>
                <Icon name={soundIsTurnedOff ? "volume_off" : "volume_up"} />
              </Button>
            </div>
          )}
          {isPreview && (
            <div className="pointer-events-auto">
              <Button color="white" onClick={replay}>
                <Icon name="replay" />
              </Button>
            </div>
          )}
          <div className="pointer-events-auto" {...bind("chapters")}>
            <ChaptersButton maxHeight={actionsBoxSize.height - 35} />
          </div>
        </div>

        <div className={cx(classes.progressBar, "h-full pointer-events-auto")}>
          <ExpoProgressBar />
        </div>
      </animated.div>

      {TutorialTooltip}

      <ViewScreenOverlayDrawer isOpen={isOpen} onClose={close} />
    </>
  );
};

const ExpoTimeProgress = () => {
  const { percentage } = useExpoScreenProgress({ offsetTotalTime: -tickTime });

  return <ProgressBar height={5} percentage={percentage} />;
};
