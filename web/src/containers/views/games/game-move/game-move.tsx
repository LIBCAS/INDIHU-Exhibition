import ReactDOM from "react-dom";
import { useState, useMemo, useCallback } from "react";
import { animated, useTransition } from "react-spring";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useTranslation } from "react-i18next";
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import { useGameAutoNavigationOnResultTimeElapsed } from "../useGameAutoNavigationOnResultTimeElapsed";
import useResizeObserver from "hooks/use-resize-observer";
import { useElementMove } from "../../../../hooks/spring-hooks/use-element-move";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

// Models
import { AppState } from "store/store";
import { ScreenProps, GameMoveScreen } from "models";

// Utils
import { calculateObjectInitialPosition, calculateObjectSize } from "./utils";
import { GAME_SCREEN_DEFAULT_RESULT_TIME } from "constants/screen";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameMoveScreen,
  (viewScreen) => ({ viewScreen })
);

// - - - - - -

export const GameMove = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { t } = useTranslation("view-screen");
  const { viewScreen } = useSelector(stateSelector);

  const { resultTime = GAME_SCREEN_DEFAULT_RESULT_TIME } = viewScreen;

  const {
    image1: assignmentImgSrc,
    image2: resultingImgSrc,
    object: objectImgSrc,
  } = screenPreloadedFiles;

  // - - Move functionality - -

  const [containerRef, containerSize] = useResizeObserver();

  const [objectDragRef, objectDragSize] = useResizeObserver();

  const { objInitialLeft, objInitialTop } = useMemo(
    () => calculateObjectInitialPosition(viewScreen, containerSize),
    [containerSize, viewScreen]
  );

  const { moveSpring, moveSpringApi, bindMoveDrag } = useElementMove({
    containerSize: containerSize,
    dragMovingObjectSize: objectDragSize,
    initialPosition: { left: objInitialLeft, top: objInitialTop },
  });

  // - - Size calculation of object, based on administration settings - -
  // once at mount assigned through CSS and then used by `objectDragSize`

  const { objectWidth, objectHeight } = useMemo(
    () => calculateObjectSize(viewScreen, containerSize),
    [containerSize, viewScreen]
  );

  // - - Tutorial - -

  const { bind: bindTutorial, TutorialTooltip } = useTutorial("gameMove", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
  });

  // - - - -

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
    moveSpringApi.start({ left: objInitialLeft, top: objInitialTop });
  }, [moveSpringApi, objInitialLeft, objInitialTop]);

  const transition = useTransition(isGameFinished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  // - - - -

  useGameAutoNavigationOnResultTimeElapsed({
    gameResultTime: resultTime * 1000,
    isGameFinished: isGameFinished,
  });

  return (
    <div className="relative w-[100svw] h-[100svh]" ref={containerRef}>
      {transition(({ opacity }, isGameFinished) =>
        isGameFinished ? (
          <animated.img
            src={resultingImgSrc}
            className="absolute w-full h-full object-contain"
            style={{ opacity }}
            alt="result image"
          />
        ) : (
          <>
            <animated.img
              src={assignmentImgSrc}
              className="absolute touch-none w-full h-full object-contain"
              style={{ opacity }}
              alt="assignment-background-image"
            />

            <animated.div
              className="absolute touch-none hover:cursor-move p-2 border-2 border-white border-opacity-50 border-dashed"
              style={{
                left: moveSpring.left,
                top: moveSpring.top,
                opacity,
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
                width: objectWidth,
                height: objectHeight,
              }}
              ref={objectDragRef}
              {...bindMoveDrag()}
            >
              <img
                src={objectImgSrc}
                className="w-full h-full object-contain"
                draggable={false}
                alt="drag content"
              />
            </animated.div>
          </>
        )
      )}

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={isGameFinished}
            bindTutorial={bindTutorial("moving")}
            solutionText={t("game-move.solution")}
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
