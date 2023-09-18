import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  MouseEvent,
} from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useTranslation } from "react-i18next";
import useElementSize from "hooks/element-size-hook";

import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

import { ScreenProps } from "models";
import { AppState } from "store/store";
import { GameWipeScreen } from "models";

import cx from "classnames";
import classes from "./game-erase.module.scss";
import { calculateObjectFit } from "utils/object-fit";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameWipeScreen,
  (viewScreen) => ({ viewScreen })
);

// - - -

export const GameErase = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
}: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const { t } = useTranslation("screen");

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // current mouse position of the cursor
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [containerRef, containerSize] = useElementSize();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // - -

  const {
    width: containedImage1Width,
    height: containedImage1Height,
    left: fromLeft,
    top: fromTop,
  } = useMemo(
    () =>
      calculateObjectFit({
        parent: containerSize,
        child: viewScreen.image1OrigData ?? { height: 0, width: 0 },
      }),
    [containerSize, viewScreen.image1OrigData]
  );

  // - -

  const updateMousePosition = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    },
    []
  );

  const fillCanvas = useCallback(() => {
    if (!ctx) {
      return;
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.fillRect(
      0,
      0,
      canvasRef.current?.width ?? 0,
      canvasRef.current?.height ?? 0
    );
    const imageElement = document.createElement("img");
    imageElement.src = screenPreloadedFiles.image1 ?? "";
    imageElement.onload = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(
        imageElement,
        fromLeft,
        fromTop,
        containedImage1Width,
        containedImage1Height
      );
      ctx.globalCompositeOperation = "destination-out";
    };
  }, [
    ctx,
    containedImage1Height,
    fromLeft,
    screenPreloadedFiles.image1,
    fromTop,
    containedImage1Width,
  ]);

  // - -

  const clearCanvas = useCallback(() => {
    if (!ctx) {
      return;
    }

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(
      0,
      0,
      canvasRef.current?.width ?? 0,
      canvasRef.current?.height ?? 0
    );
  }, [ctx]);

  // - -

  const erase = useCallback(
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

  // - -

  const onFinish = useCallback(() => {
    setIsGameFinished(true);
    clearCanvas();
  }, [clearCanvas]);

  const onReset = useCallback(() => {
    setIsGameFinished(false);
    fillCanvas();
  }, [fillCanvas]);

  // - -

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    canvasRef.current.height = window.innerHeight;
    canvasRef.current.width = window.innerWidth;
    setCtx(canvasRef.current.getContext("2d"));
  }, []);

  useEffect(() => {
    if (!ctx) {
      return;
    }

    ctx.fillStyle = "black";
    fillCanvas();
    ctx.lineWidth = 40;
    ctx.lineCap = "round";
  }, [ctx, fillCanvas]);

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      <img
        className="w-full h-full absolute object-contain"
        src={screenPreloadedFiles.image2}
        alt="solution-image"
      />

      <canvas
        className={cx("absolute", {
          [classes.drawingCursor]: !isGameFinished,
        })}
        ref={canvasRef}
        onMouseDown={updateMousePosition}
        onMouseEnter={updateMousePosition}
        onMouseMove={erase}
      />

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={isGameFinished}
            text={t("game-erase.task")}
          />,
          infoPanelRef.current
        )}

      {actionsPanelRef.current &&
        ReactDOM.createPortal(
          <GameActionsPanel
            isGameFinished={isGameFinished}
            onGameFinish={onFinish}
            onGameReset={onReset}
          />,
          actionsPanelRef.current
        )}
    </div>
  );
};
