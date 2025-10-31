import ReactDOM from "react-dom";
import { useState, useMemo, useCallback } from "react";
import { animated, useTransition } from "react-spring";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

// Hooks
import useResizeObserver from "hooks/use-resize-observer";
import { useElementMove } from "../../../../hooks/spring-hooks/use-element-move";
import { useGameAutoNavigationOnResultTimeElapsed } from "../useGameAutoNavigationOnResultTimeElapsed";
import { useTutorial } from "context/tutorial-provider/use-tutorial";

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

  // - - - Move functionality (Object 1) - - -

  const { objInitialLeft, objInitialTop } = useMemo(
    () =>
      calculateObjectInitialPosition(
        viewScreen.image1OrigData,
        viewScreen.objectPositionProps?.containedImgPosition,
        containerSize
      ),
    [containerSize, viewScreen]
  );

  const { moveSpring, moveSpringApi, bindMoveDrag } = useElementMove({
    containerSize: containerSize,
    dragMovingObjectSize: objectDragSize,
    initialPosition: { left: objInitialLeft, top: objInitialTop },
  });

  // - - - Size calculation of object (Object 1) - - -

  const { objectWidth, objectHeight } = useMemo(
    () =>
      calculateObjectSize(
        viewScreen.image1OrigData,
        viewScreen.objectOrigData,
        viewScreen.objectSizeProps?.inContainedImgFractionSize,
        containerSize
      ),
    [containerSize, viewScreen]
  );

  // - - - Move functionality (Object 2) - - -

  const { objInitialLeft: obj2InitialLeft, objInitialTop: obj2InitialTop } =
    useMemo(
      () =>
        calculateObjectInitialPosition(
          viewScreen.image1OrigData,
          viewScreen.object2PositionProps?.containedImgPosition,
          containerSize
        ),
      [containerSize, viewScreen]
    );

  const {
    moveSpring: move2Spring,
    moveSpringApi: move2SpringApi,
    bindMoveDrag: bindMove2Drag,
  } = useElementMove({
    containerSize: containerSize,
    dragMovingObjectSize: object2DragSize,
    initialPosition: { left: obj2InitialLeft, top: obj2InitialTop },
  });

  // - - - Size calculation of object (Object 2) - - -

  const { objectWidth: object2Width, objectHeight: object2Height } = useMemo(
    () =>
      calculateObjectSize(
        viewScreen.image1OrigData,
        viewScreen.object2OrigData,
        viewScreen.object2SizeProps?.inContainedImgFractionSize,
        containerSize
      ),
    [containerSize, viewScreen]
  );

  // - - - Move functionality (Object 3) - - -

  const { objInitialLeft: obj3InitialLeft, objInitialTop: obj3InitialTop } =
    useMemo(
      () =>
        calculateObjectInitialPosition(
          viewScreen.image1OrigData,
          viewScreen.object3PositionProps?.containedImgPosition,
          containerSize
        ),
      [containerSize, viewScreen]
    );

  const {
    moveSpring: move3Spring,
    moveSpringApi: move3SpringApi,
    bindMoveDrag: bindMove3Drag,
  } = useElementMove({
    containerSize: containerSize,
    dragMovingObjectSize: object3DragSize,
    initialPosition: { left: obj3InitialLeft, top: obj3InitialTop },
  });

  // - - - Size calculation of object (Object 3) - - -

  const { objectWidth: object3Width, objectHeight: object3Height } = useMemo(
    () =>
      calculateObjectSize(
        viewScreen.image1OrigData,
        viewScreen.object2OrigData,
        viewScreen.object2SizeProps?.inContainedImgFractionSize,
        containerSize
      ),
    [containerSize, viewScreen]
  );

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
    moveSpringApi.start({ left: objInitialLeft, top: objInitialTop });
    move2SpringApi.start({ left: obj2InitialLeft, top: obj2InitialTop });
    move3SpringApi.start({ left: obj3InitialLeft, top: obj3InitialTop });
  }, [
    moveSpringApi,
    objInitialLeft,
    objInitialTop,
    move2SpringApi,
    obj2InitialLeft,
    obj2InitialTop,
    move3SpringApi,
    obj3InitialLeft,
    obj3InitialTop,
  ]);

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
