import { useCallback, useState, MouseEvent, useRef, useEffect } from "react";
import { animated, useTransition } from "react-spring";
import ReactDOM from "react-dom";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { Icon } from "components/icon/icon";

import { ScreenProps } from "models";
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
  const { viewScreen } = useSelector(stateSelector);
  const { t } = useTranslation("view-screen");

  const [isGameFinished, setIsGameFinished] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // setting always, even when the pen or erase is not down
  const [color, setColor] = useState("#000000");
  const [thickness, setThickness] = useState(5);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [thicknessAnchor, setThicknessAnchor] =
    useState<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [
    open,
    { toggle: toggleThicknessPopover, setFalse: closeThicknessPopover },
  ] = useBoolean(false);

  const [erasing, { toggle: toggleTool }] = useBoolean(false);

  // - -

  const clearCanvas = useCallback(() => {
    ctx?.clearRect(
      0,
      0,
      canvasRef.current?.width ?? 0,
      canvasRef.current?.height ?? 0
    );
  }, [ctx]);

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
    clearCanvas();
  }, [clearCanvas]);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
    clearCanvas();
  }, [clearCanvas]);

  const updateMousePosition = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    },
    []
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.height = window.innerHeight;
    canvasRef.current.width = window.innerWidth;
    setCtx(canvasRef.current.getContext("2d"));
  }, []);

  useEffect(() => {
    if (!ctx) return;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
  }, [color, ctx, erasing, thickness]);

  const draw = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (!ctx || e.buttons !== 1 || isGameFinished) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        return;
      }
      ctx.beginPath();
      ctx.moveTo(mousePosition.x, mousePosition.y);
      setMousePosition({ x: e.clientX, y: e.clientY });
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    },
    [ctx, isGameFinished, mousePosition.x, mousePosition.y]
  );

  const transition = useTransition(isGameFinished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  // - -

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
    <div className="w-full h-full relative">
      {transition(({ opacity }, finished) =>
        !finished ? (
          <animated.img
            style={{ opacity }}
            className="h-full w-full absolute object-contain"
            src={screenPreloadedFiles.image1}
            alt="drawing background"
          />
        ) : (
          <animated.img
            style={{ opacity }}
            className="h-full w-full absolute object-contain"
            src={screenPreloadedFiles.image2}
            alt="solution"
          />
        )
      )}

      <canvas
        className={cx("absolute touch-none", {
          [classes.drawingCursor]: !isGameFinished && !erasing,
          [classes.erasingCursor]: !isGameFinished && erasing,
        })}
        ref={canvasRef}
        onPointerDown={updateMousePosition}
        onPointerEnter={updateMousePosition}
        onPointerMove={draw}
      />

      <Popper
        anchor={thicknessAnchor}
        placement="top-start"
        open={open}
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
                  iconBefore={<Icon name={erasing ? "draw" : "healing"} />}
                />
                <BasicTooltip
                  id="game-overlay-tool-button-tooltip"
                  content={
                    erasing
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
