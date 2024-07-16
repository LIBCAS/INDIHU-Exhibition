import ReactDOM from "react-dom";
import { useCallback, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import { animated, useSpring, useTransition } from "react-spring";
import { useDrag } from "@use-gesture/react";
import useResizeObserver from "hooks/use-resize-observer";
import { useTranslation } from "react-i18next";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

// Models
import { AppState } from "store/store";
import { ScreenProps, GameMoveScreen } from "models";

// - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameMoveScreen,
  (viewScreen) => ({ viewScreen })
);

// - - -

export const GameMove = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const { t } = useTranslation("view-screen");

  const [containerRef, { width: containerWidth, height: containerHeight }] =
    useResizeObserver();
  const [dragRef, { width: dragWidth, height: dragHeight }] =
    useResizeObserver(); // dragTarget as a container with the object img

  // - -

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  // Initialize the position for drag object image, it will be reset back to [0, 0] whenever the width or height of the container changes
  const [{ dragLeft, dragTop }, dragApi] = useSpring(
    () => ({
      dragLeft: 0,
      dragTop: 0,
    }),
    [containerWidth, containerHeight]
  );

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
    dragApi.start({ dragLeft: 0, dragTop: 0 });
  }, [dragApi]);

  // - -

  const bind = useDrag(
    ({ down, offset: [x, y] }) => {
      if (!down) {
        return;
      }

      dragApi.start({ dragLeft: x, dragTop: y, immediate: true });
    },
    {
      from: () => [dragLeft.get(), dragTop.get()],
      bounds: {
        left: 0,
        top: 0,
        right: containerWidth - dragWidth,
        bottom: containerHeight - dragHeight,
      },
    }
  );

  const transition = useTransition(isGameFinished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  // - -

  const {
    bind: bindTutorial,
    TutorialTooltip,
    escapeTutorial,
  } = useTutorial("gameMove", !isMobileOverlay);

  const onKeydownAction = useCallback(
    (event) => {
      if (event.key === "Escape") {
        escapeTutorial();
      }
    },
    [escapeTutorial]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeydownAction);
    return () => document.removeEventListener("keydown", onKeydownAction);
  });

  return (
    <div className="relative w-[100svw] h-[100svh]" ref={containerRef}>
      {transition(({ opacity }, isGameFinished) =>
        isGameFinished ? (
          // Image2 is result image
          <animated.img
            src={screenPreloadedFiles.image2}
            className="w-full h-full absolute object-contain"
            style={{ opacity }}
            alt="result image"
          />
        ) : (
          <>
            {/* Image1 is background image (zadanie) */}
            <animated.img
              src={screenPreloadedFiles.image1}
              className="touch-none w-full h-full absolute object-contain"
              style={{ opacity }}
              alt="assignment-background-image"
            />

            {/* Object */}
            <animated.div
              className="touch-none absolute p-2 border-2 border-white border-opacity-50 border-dashed hover:cursor-move"
              style={{
                left: dragLeft,
                top: dragTop,
                opacity,
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
              }}
              ref={dragRef}
              {...bind()}
            >
              <img
                src={screenPreloadedFiles.object}
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
