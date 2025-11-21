import { useState, useRef, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

// Hooks
import useResizeObserver from "hooks/use-resize-observer";
import { useGameErase } from "./useGameErase";
import { useTutorial } from "context/tutorial-provider/use-tutorial";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";
import { useGameAutoNavigationOnResultTimeElapsed } from "../useGameAutoNavigationOnResultTimeElapsed";

// Types
import { AppState } from "store/store";
import { ScreenProps } from "models";
import { GameWipeScreen } from "models";

// Utils
import cx from "classnames";
import classes from "./game-erase.module.scss";
import { GAME_SCREEN_DEFAULT_RESULT_TIME } from "constants/screen";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameWipeScreen,
  (viewScreen) => ({ viewScreen })
);

// - - - - - -

export const GameErase = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const { image1: upperImageSrc, image2: bottomImageSrc } =
    screenPreloadedFiles;
  const { t } = useTranslation("view-screen");

  // - - - States - - -

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  // - - - Derived variables (settings) - - -

  const eraserToolType = useMemo(
    () => viewScreen.eraserToolType ?? "eraser",
    [viewScreen.eraserToolType]
  );

  const { resultTime = GAME_SCREEN_DEFAULT_RESULT_TIME } = viewScreen;

  const upperImageOrigData = useMemo(
    () => viewScreen.image1OrigData ?? { width: 0, height: 0 },
    [viewScreen.image1OrigData]
  );

  // - - - Erase functionality - - -

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [setContainerRef, containerSize] = useResizeObserver();

  const { fillCanvas, clearCanvas, updateMousePosition, erase } = useGameErase({
    canvasRef,
    containerSize,
    upperImageOrigData,
    upperImageSrc,
    shouldErase: !isGameFinished,
  });

  // - - - Game Handling - - -

  const onFinish = useCallback(() => {
    setIsGameFinished(true);
    clearCanvas();
  }, [clearCanvas]);

  const onReset = useCallback(() => {
    setIsGameFinished(false);
    fillCanvas();
  }, [fillCanvas]);

  // - - - Tutorial - - -

  const { bind, TutorialTooltip } = useTutorial("gameWipe", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
  });

  // - - - Game Auto Navigation - - -

  useGameAutoNavigationOnResultTimeElapsed({
    gameResultTime: resultTime * 1000,
    isGameFinished: isGameFinished,
  });

  return (
    <div
      className={cx(
        "relative w-[100svw] h-[100svh]",
        classes["erase-container"]
      )}
      ref={setContainerRef}
    >
      <img
        className="absolute w-full h-full object-contain"
        src={bottomImageSrc}
        alt="solution-image"
      />

      <canvas
        className={cx("absolute touch-none outline-none", {
          [classes.eraserEraser]:
            !isGameFinished && eraserToolType === "eraser",
          [classes.eraserBroom]: !isGameFinished && eraserToolType === "broom",
          [classes.eraserBrush]: !isGameFinished && eraserToolType === "brush",
          [classes.eraserChisel]:
            !isGameFinished && eraserToolType === "chisel",
          [classes.eraserHammer]:
            !isGameFinished && eraserToolType === "hammer",
          [classes.eraserStick]: !isGameFinished && eraserToolType === "stick",
          [classes.eraserTowel]: !isGameFinished && eraserToolType === "towel",
          [classes.eraserWipetowel]:
            !isGameFinished && eraserToolType === "wipe_towel",
        })}
        ref={canvasRef}
        onPointerDown={updateMousePosition}
        onPointerEnter={updateMousePosition}
        onPointerMove={erase}
      />

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={isGameFinished}
            bindTutorial={bind("wiping")}
            solutionText={t("game-erase.solution")}
          />,
          infoPanelRef.current
        )}

      {actionsPanelRef.current &&
        ReactDOM.createPortal(
          <GameActionsPanel
            isMobileOverlay={isMobileOverlay}
            isGameFinished={isGameFinished}
            onGameFinish={onFinish}
            onGameReset={onReset}
          />,
          actionsPanelRef.current
        )}

      {TutorialTooltip}
    </div>
  );
};
