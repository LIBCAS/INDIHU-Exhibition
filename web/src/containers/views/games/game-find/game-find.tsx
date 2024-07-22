import ReactDOM from "react-dom";
import { useState, useCallback, MouseEvent } from "react";
import { useTransition, animated } from "react-spring";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

import { useTutorial } from "context/tutorial-provider/use-tutorial";
import { useGameAutoNavigationOnResultTimeElapsed } from "../useGameAutoNavigationOnResultTimeElapsed";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

// Models
import { ScreenProps, Position } from "models";
import { GameFindScreen } from "models";
import { AppState } from "store/store";

// Utils
import cx from "classnames";
import classes from "./game-find.module.scss";
import { GAME_SCREEN_DEFAULT_RESULT_TIME } from "constants/screen";

// Assets
import pinIcon from "assets/img/pin.png";

// - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameFindScreen,
  (viewScreen) => ({ viewScreen })
);

// - - - -

export const GameFind = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { t } = useTranslation("view-screen");
  const { viewScreen } = useSelector(stateSelector);

  const { resultTime = GAME_SCREEN_DEFAULT_RESULT_TIME } = viewScreen;

  const { image1: assignmentImgSrc, image2: resultingImgSrc } =
    screenPreloadedFiles;

  const [isGameFinished, setIsGameFinished] = useState(false);
  const [pin, setPin] = useState<Position | undefined>(undefined);

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
    setPin(undefined);
  }, []);

  const pinImage = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      if (pin) {
        return;
      }

      setPin({ left: e.clientX, top: e.clientY });
    },
    [pin]
  );

  // - - Tutorial - -

  const { bind, TutorialTooltip } = useTutorial("gameFind", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
  });

  // - - - -

  useGameAutoNavigationOnResultTimeElapsed({
    gameResultTime: resultTime * 1000,
    isGameFinished: isGameFinished,
  });

  // - - Transitions - -

  const imageTransition = useTransition(isGameFinished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const pinTransition = useTransition(pin, {
    from: { x: 0 },
    enter: { x: 1 },
    leave: { x: 1 },
  });

  return (
    <div className="w-full h-full relative">
      {imageTransition(({ opacity }, isGameFinished) =>
        !isGameFinished ? (
          <animated.img
            style={{ opacity }}
            className={cx("w-full h-full absolute object-contain", {
              [classes.pinningCursor]: !pin,
            })}
            onClick={pinImage}
            src={assignmentImgSrc}
            alt="assignment image"
          />
        ) : (
          <animated.img
            style={{ opacity }}
            className="w-full h-full absolute object-contain"
            src={resultingImgSrc}
            alt="result image"
          />
        )
      )}

      {pinTransition(
        ({ x }, pin) =>
          pin && (
            <animated.img
              src={pinIcon}
              alt="pin icon"
              style={{
                position: "fixed",
                x: pin.left - 25,
                y: x.to(
                  [0, 0.9, 0.95, 1],
                  [pin.top - 50, pin.top - 80, pin.top - 45, pin.top - 50]
                ),
                rotateZ: x.to([0, 0.9, 0.95, 1], [0, 10, 0, 0]),
              }}
            />
          )
      )}

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={isGameFinished}
            bindTutorial={bind("finding")}
            solutionText={t("game-find.solution")}
          />,
          infoPanelRef.current
        )}

      {actionsPanelRef.current &&
        ReactDOM.createPortal(
          <GameActionsPanel
            isMobileOverlay={isMobileOverlay}
            isGameFinished={isGameFinished}
            onGameFinish={onGameFinish}
            onGameReset={onGameReset}
          />,
          actionsPanelRef.current
        )}

      {TutorialTooltip}
    </div>
  );
};
