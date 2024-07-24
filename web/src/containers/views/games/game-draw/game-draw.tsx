import ReactDOM from "react-dom";
import { useCallback, useState, useRef } from "react";
import { animated, useTransition } from "react-spring";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Custom hooks
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import { useGameAutoNavigationOnResultTimeElapsed } from "../useGameAutoNavigationOnResultTimeElapsed";
import { useBoolean } from "hooks/boolean-hook";
import { useGameDraw } from "./useGameDraw";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

import { Popper } from "components/popper/popper";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Models
import { GameDrawScreen, ScreenProps } from "models";
import { AppState } from "store/store";

// Utils
import cx from "classnames";
import classes from "./game-draw.module.scss";
import { GAME_SCREEN_DEFAULT_RESULT_TIME } from "constants/screen";
import {
  GAME_DRAW_DEFAULT_COLOR,
  GAME_DRAW_DEFAULT_THICKNESS,
  GAME_DRAW_DEFAULT_IS_ERASING,
} from "constants/screen";

// - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameDrawScreen,
  (viewScreen) => ({ viewScreen })
);

// - - - -

export const GameDraw = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { t } = useTranslation("view-screen");
  const { viewScreen } = useSelector(stateSelector);

  const {
    resultTime = GAME_SCREEN_DEFAULT_RESULT_TIME,
    showDrawing = false,
    initialColor = GAME_DRAW_DEFAULT_COLOR,
    initialThickness = GAME_DRAW_DEFAULT_THICKNESS,
  } = viewScreen;

  const { image1: assignmentImgSrc, image2: resultingImgSrc } =
    screenPreloadedFiles;

  // - - States - -

  const [color, setColor] = useState<string>(initialColor);

  const [thickness, setThickness] = useState<number>(initialThickness);

  const [isErasing, { toggle: toggleTool }] = useBoolean(
    GAME_DRAW_DEFAULT_IS_ERASING
  );

  const [thicknessAnchor, setThicknessAnchor] =
    useState<HTMLButtonElement | null>(null);

  const [
    isThicknessPopoverOpen,
    { toggle: toggleThicknessPopover, setFalse: closeThicknessPopover },
  ] = useBoolean(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  // - - Draw functionality - -

  const { startDrawing, stopDrawing, draw, clearCanvas } = useGameDraw({
    canvasRef,
    isGameFinished,
    color,
    thickness,
    isErasing,
  });

  // - - - -

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
    if (!showDrawing) {
      clearCanvas();
    }
  }, [clearCanvas, showDrawing]);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
    clearCanvas();
  }, [clearCanvas]);

  // - - Transition animation between drawing and solution img - -

  const transition = useTransition(isGameFinished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  // - - Tutorial stuff - -

  const { bind, TutorialTooltip } = useTutorial("gameDraw", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
  });

  // - -

  useGameAutoNavigationOnResultTimeElapsed({
    gameResultTime: resultTime * 1000,
    isGameFinished: isGameFinished,
  });

  return (
    <div className="relative w-[100svw] h-[100svh]">
      {transition(({ opacity }, isGameFinished) =>
        !isGameFinished ? (
          <animated.img
            style={{ opacity }}
            className="absolute w-full h-full object-contain"
            src={assignmentImgSrc}
            alt="assignment img"
          />
        ) : (
          <animated.img
            style={{ opacity }}
            className="absolute w-full h-full object-contain"
            src={resultingImgSrc}
            alt="result image"
          />
        )
      )}

      <canvas
        className={cx("absolute touch-none", {
          [classes.drawingCursor]: !isGameFinished && !isErasing,
          [classes.erasingCursor]: !isGameFinished && isErasing,
        })}
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerUp={stopDrawing}
        onPointerMove={draw}
      />

      <Popper
        anchor={thicknessAnchor}
        placement="top-start"
        open={isThicknessPopoverOpen}
        onClickOutside={closeThicknessPopover}
        arrow
      >
        <input
          type="range"
          draggable={false}
          className="h-full bg-white"
          min={1}
          max={50}
          value={thickness}
          onChange={(e) => setThickness(parseInt(e.target.value))}
        />
      </Popper>

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={isGameFinished}
            bindTutorial={bind("drawing")}
            solutionText={t("game-draw.solution")}
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
            gameActions={[
              <div key="tool-button">
                <Button
                  color="expoTheme"
                  onClick={toggleTool}
                  iconBefore={<Icon name={isErasing ? "draw" : "healing"} />}
                  tooltip={{
                    id: "game-overlay-tool-button-tooltip",
                    content: isErasing
                      ? t("game-draw.switchToPencilAction")
                      : t("game-draw.switchToEraserAction"),
                  }}
                />
              </div>,

              <div className="relative" key="thickness-button">
                <Button
                  ref={(ref) => setThicknessAnchor(ref)}
                  color="expoTheme"
                  onClick={toggleThicknessPopover}
                  iconBefore={<Icon name="line_weight" />}
                  tooltip={{
                    id: "game-overlay-thickness-button-tooltip",
                    content: t("game-draw.thicknessChooserAction"),
                  }}
                />
              </div>,

              <div className="relative" key="color-picker-button">
                <Button
                  color="expoTheme"
                  tooltip={{
                    id: "game-overlay-color-picker-button-tooltip",
                    content: t("game-draw.colorChooserAction"),
                  }}
                >
                  <Icon name="palette" />
                  <input
                    type="color"
                    className="h-full w-full left-0 top-0 absolute opacity-0 hover:cursor-pointer"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </Button>
              </div>,
            ]}
          />,
          actionsPanelRef.current
        )}

      {TutorialTooltip}
    </div>
  );
};
