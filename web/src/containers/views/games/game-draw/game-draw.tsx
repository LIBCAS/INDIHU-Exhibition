import { useCallback, useState, MouseEvent, useRef, useEffect } from "react";
import { animated, useTransition } from "react-spring";
import ReactDOM from "react-dom";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { Icon } from "components/icon/icon";

import { Position, ScreenProps } from "models";
import { AppState } from "store/store";
import { GameDrawScreen } from "models";

import classes from "./game-draw.module.scss";
import { GameInfoPanel } from "../GameInfoPanel";
import { Button } from "components/button/button";
import { useBoolean } from "hooks/boolean-hook";
import { Popper } from "components/popper/popper";
import { GameActionsPanel } from "../GameActionsPanel";
import { BasicTooltip } from "components/tooltip/tooltip";
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import { configureContext } from "./configureContext";

// - -

export const DEFAULT_COLOR = "#000000";
export const DEFAULT_THICKNESS = 5;
export const DEFAULT_IS_ERASING = false;

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameDrawScreen,
  (viewScreen) => ({ viewScreen })
);

export const GameDraw = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { t } = useTranslation("view-screen");
  const { viewScreen } = useSelector(stateSelector);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<Position | null>(null); // setting always, even when the pen or erase is not down

  const [color, setColor] = useState(DEFAULT_COLOR);

  const [thickness, setThickness] = useState(DEFAULT_THICKNESS);
  const [thicknessAnchor, setThicknessAnchor] =
    useState<HTMLButtonElement | null>(null);
  const [
    isThicknessPopoverOpen,
    { toggle: toggleThicknessPopover, setFalse: closeThicknessPopover },
  ] = useBoolean(false);

  const [isErasing, { toggle: toggleTool }] = useBoolean(DEFAULT_IS_ERASING);

  const [isGameFinished, setIsGameFinished] = useState(false);

  // - -

  useEffect(() => {
    if (!canvasRef.current) return; // should not happen

    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    const context = canvasRef.current.getContext("2d");
    setCtx(context);
  }, []);

  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // - -

  useEffect(() => {
    if (!ctx) return;

    configureContext(ctx, color, thickness, isErasing);
  }, [
    color,
    thickness,
    isErasing,
    ctx,
    canvasRef.current?.width,
    canvasRef.current?.height,
  ]);

  // - -

  const startDrawing = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    setMousePosition({ left: e.clientX, top: e.clientY });
    setIsDrawing(true);
  }, []);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const draw = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || isGameFinished || !ctx || !mousePosition) {
        return;
      }

      ctx.beginPath();
      ctx.moveTo(mousePosition.left, mousePosition.top);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();

      setMousePosition({ left: e.clientX, top: e.clientY });
    },
    [isDrawing, isGameFinished, mousePosition, ctx]
  );

  // - -

  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    if (!ctx) return;

    ctx.clearRect(
      0,
      0,
      canvasRef.current.width ?? 0,
      canvasRef.current.height ?? 0
    );
  }, [ctx]);

  // - -

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
    clearCanvas();
  }, [clearCanvas]);

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

  const { bind, TutorialTooltip, escapeTutorial } = useTutorial(
    "gameDraw",
    !isMobileOverlay
  );

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
    <div className="relative w-full h-full">
      {transition(({ opacity }, finished) =>
        !finished ? (
          <animated.img
            style={{ opacity }}
            className="absolute w-full h-full object-contain"
            src={screenPreloadedFiles.image1}
            alt="background drawing image"
          />
        ) : (
          <animated.img
            style={{ opacity }}
            className="absolute w-full h-full object-contain"
            src={screenPreloadedFiles.image2}
            alt="solution image"
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
            text={t("game-draw.task")}
            bindTutorial={bind("drawing")}
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
              <div
                key="tool-button"
                data-tooltip-id="game-overlay-tool-button-tooltip"
              >
                <Button
                  color="expoTheme"
                  onClick={toggleTool}
                  iconBefore={<Icon name={isErasing ? "draw" : "healing"} />}
                />
                <BasicTooltip
                  id="game-overlay-tool-button-tooltip"
                  content={
                    isErasing
                      ? t("game-draw.switchToPencilAction")
                      : t("game-draw.switchToEraserAction")
                  }
                />
              </div>,

              <div
                className="relative"
                key="thickness-button"
                data-tooltip-id="game-overlay-thickness-button-tooltip"
              >
                <Button
                  ref={(ref) => setThicknessAnchor(ref)}
                  color="expoTheme"
                  onClick={toggleThicknessPopover}
                  iconBefore={<Icon name="line_weight" />}
                />
                <BasicTooltip
                  id="game-overlay-thickness-button-tooltip"
                  content={t("game-draw.thicknessChooserAction")}
                />
              </div>,

              <div
                className="relative"
                key="color-picker-button"
                data-tooltip-id="game-overlay-color-picker-button-tooltip"
              >
                <Button color="expoTheme">
                  <Icon name="palette" />
                  <input
                    type="color"
                    className="h-full w-full left-0 top-0 absolute opacity-0 hover:cursor-pointer"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </Button>
                <BasicTooltip
                  id="game-overlay-color-picker-button-tooltip"
                  content={t("game-draw.colorChooserAction")}
                />
              </div>,
            ]}
          />,
          actionsPanelRef.current
        )}

      {TutorialTooltip}
    </div>
  );
};
