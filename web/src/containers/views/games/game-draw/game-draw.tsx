import { useCallback, useState, MouseEvent, useRef, useEffect } from "react";
import { animated, useTransition } from "react-spring";
import ReactDOM from "react-dom";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { Icon } from "components/icon/icon";

import { ScreenProps } from "containers/views/types";
import { AppState } from "store/store";
import { GameDrawScreen } from "models";

import classes from "./game-draw.module.scss";
import { GameToolbar } from "../game-toolbar";
import { Button } from "components/button/button";
import { useBoolean } from "hooks/boolean-hook";
import { Popper } from "components/popper/popper";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameDrawScreen,
  (viewScreen) => ({ viewScreen })
);

export const GameDraw = ({ screenFiles, toolbarRef }: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const [finished, setFinished] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("#000000");
  const [thickness, setThickness] = useState(5);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation("screen");
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const [
    open,
    { toggle: toggleThicknessPopover, setFalse: closeThicknessPopover },
  ] = useBoolean(false);
  const [erasing, { toggle: toggleTool }] = useBoolean(false);

  const clearCanvas = useCallback(() => {
    ctx?.clearRect(0, 0, ref.current?.width ?? 0, ref.current?.height ?? 0);
  }, [ctx]);

  const onFinish = useCallback(() => {
    setFinished(true);
    clearCanvas();
  }, [clearCanvas]);

  const onReset = useCallback(() => {
    setFinished(false);
    clearCanvas();
  }, [clearCanvas]);

  const updateMousePosition = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    },
    []
  );

  useEffect(() => {
    if (!ref.current) return;

    ref.current.height = window.innerHeight;
    ref.current.width = window.innerWidth;
    setCtx(ref.current.getContext("2d"));
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
      if (!ctx || e.buttons !== 1 || finished) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        return;
      }
      ctx.beginPath();
      ctx.moveTo(mousePosition.x, mousePosition.y);
      setMousePosition({ x: e.clientX, y: e.clientY });
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    },
    [ctx, finished, mousePosition.x, mousePosition.y]
  );

  const transition = useTransition(finished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <div className="w-full h-full relative">
      {transition(({ opacity }, finished) =>
        !finished ? (
          <animated.img
            style={{ opacity }}
            className="h-full w-full absolute object-contain"
            src={screenFiles.image1}
            alt="drawing background"
          />
        ) : (
          <animated.img
            style={{ opacity }}
            className="h-full w-full absolute object-contain"
            src={screenFiles.image2}
            alt="solution"
          />
        )
      )}

      <canvas
        className={cx("absolute", {
          [classes.drawingCursor]: !finished && !erasing,
          [classes.erasingCursor]: !finished && erasing,
        })}
        ref={ref}
        onMouseDown={updateMousePosition}
        onMouseEnter={updateMousePosition}
        onMouseMove={draw}
      />

      <Popper
        anchor={anchor}
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

      {toolbarRef.current &&
        ReactDOM.createPortal(
          <GameToolbar
            text={t("game-draw.task")}
            onFinish={onFinish}
            onReset={onReset}
            finished={finished}
            screen={viewScreen}
            actions={[
              <Button
                key="color-picker-button"
                color="white"
                className="relative"
              >
                <Icon name="palette" />
                <input
                  type="color"
                  className="h-full w-full left-0 top-0 absolute opacity-0 hover:cursor-pointer"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </Button>,
              <Button
                ref={(ref) => setAnchor(ref)}
                key="thickness-button"
                color="white"
                className="relative"
                onClick={toggleThicknessPopover}
              >
                <Icon name="line_weight" />
              </Button>,
              <Button key="tool-button" color="white" onClick={toggleTool}>
                <Icon name={erasing ? "draw" : "healing"} />
              </Button>,
            ]}
          />,
          toolbarRef.current
        )}
    </div>
  );
};
