import ReactDOM from "react-dom";
import { useState, useCallback } from "react";
import { animated, useTransition } from "react-spring";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

// Hooks
import useResizeObserver from "hooks/use-resize-observer";
import { useGameMoveObject } from "./hooks/useGameMoveObject";
import { useGameAutoNavigationOnResultTimeElapsed } from "../useGameAutoNavigationOnResultTimeElapsed";
import { useTutorial } from "context/tutorial-provider/use-tutorial";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

// Models
import { AppState } from "store/store";
import { ScreenProps, GameMoveScreen } from "models";

// Utils
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
    object2: object2ImgSrc,
    object3: object3ImgSrc,
  } = screenPreloadedFiles;

  // - - - States - - -

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  // - - - Hooks - - -

  const [containerRef, containerSize] = useResizeObserver();

  const [objectDragRef, objectDragSize] = useResizeObserver();
  const [object2DragRef, object2DragSize] = useResizeObserver();
  const [object3DragRef, object3DragSize] = useResizeObserver();

  // - - - Object 1 - - -

  const {
    moveSpring,
    bindMoveDrag,
    objectWidth,
    objectHeight,
    resetObjectPosition,
  } = useGameMoveObject({
    assignmentImageOrigData: viewScreen.image1OrigData,
    containerSize: containerSize,
    objectPositionProps: viewScreen.objectPositionProps,
    objectSizeProps: viewScreen.objectSizeProps,
    objectImageOrigData: viewScreen.objectOrigData,
    objectDragSize: objectDragSize,
  });

  // - - - Object 2 - - -

  const {
    moveSpring: move2Spring,
    bindMoveDrag: bindMove2Drag,
    objectWidth: object2Width,
    objectHeight: object2Height,
    resetObjectPosition: resetObject2Position,
  } = useGameMoveObject({
    assignmentImageOrigData: viewScreen.image1OrigData,
    containerSize: containerSize,
    objectPositionProps: viewScreen.object2PositionProps,
    objectSizeProps: viewScreen.object2SizeProps,
    objectImageOrigData: viewScreen.object2OrigData,
    objectDragSize: object2DragSize,
  });

  // - - - Object 3 - - -

  const {
    moveSpring: move3Spring,
    bindMoveDrag: bindMove3Drag,
    objectWidth: object3Width,
    objectHeight: object3Height,
    resetObjectPosition: resetObject3Position,
  } = useGameMoveObject({
    assignmentImageOrigData: viewScreen.image1OrigData,
    containerSize: containerSize,
    objectPositionProps: viewScreen.object3PositionProps,
    objectSizeProps: viewScreen.object3SizeProps,
    objectImageOrigData: viewScreen.object3OrigData,
    objectDragSize: object3DragSize,
  });

  // - - - Tutorial - - -

  const { bind: bindTutorial, TutorialTooltip } = useTutorial("gameMove", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
  });

  // - - - Callbacks - - -

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
    resetObjectPosition();
    resetObject2Position();
    resetObject3Position();
  }, [resetObjectPosition, resetObject2Position, resetObject3Position]);

  // - - - Transition animations - - -

  const transition = useTransition(isGameFinished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  // - - - Game Auto Navigation Hook - - -

  useGameAutoNavigationOnResultTimeElapsed({
    gameResultTime: resultTime * 1000,
    isGameFinished: isGameFinished,
  });

  // - - - GUI - - -

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

            {/* Object 1 */}
            {objectImgSrc && (
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
                  alt="drag-1-content"
                />
              </animated.div>
            )}

            {/* Object 2 */}
            {object2ImgSrc && (
              <animated.div
                className="absolute touch-none hover:cursor-move p-2 border-2 border-white border-opacity-50 border-dashed"
                style={{
                  left: move2Spring.left,
                  top: move2Spring.top,
                  opacity,
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                  width: object2Width,
                  height: object2Height,
                }}
                ref={object2DragRef}
                {...bindMove2Drag()}
              >
                <img
                  src={object2ImgSrc}
                  className="w-full h-full object-contain"
                  draggable={false}
                  alt="drag-2-content"
                />
              </animated.div>
            )}

            {/* Object 3 */}
            {object3ImgSrc && (
              <animated.div
                className="absolute touch-none hover:cursor-move p-2 border-2 border-white border-opacity-50 border-dashed"
                style={{
                  left: move3Spring.left,
                  top: move3Spring.top,
                  opacity,
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                  width: object3Width,
                  height: object3Height,
                }}
                ref={object3DragRef}
                {...bindMove3Drag()}
              >
                <img
                  src={object3ImgSrc}
                  className="w-full h-full object-contain"
                  draggable={false}
                  alt="drag-3-content"
                />
              </animated.div>
            )}
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
