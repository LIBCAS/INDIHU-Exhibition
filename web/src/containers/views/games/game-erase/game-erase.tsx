import {
  useCallback,
  useState,
  MouseEvent,
  useRef,
  useEffect,
  useMemo,
} from "react";
import ReactDOM from "react-dom";
import cx from "classnames";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

import { ScreenProps } from "models";
import { calculateObjectFit } from "utils/object-fit";
import useElementSize from "hooks/element-size-hook";
import { useTranslation } from "react-i18next";
import { AppState } from "store/store";
import { GameWipeScreen } from "models";

import classes from "./game-erase.module.scss";
import { GameToolbar } from "../game-toolbar";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameWipeScreen,
  (viewScreen) => ({ viewScreen })
);

export const GameErase = ({
  screenPreloadedFiles,
  toolbarRef,
}: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const [finished, setFinished] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const [containerRef, containerSize] = useElementSize();
  const { t } = useTranslation("screen");

  const { height, width, left, top } = useMemo(
    () =>
      calculateObjectFit({
        parent: containerSize,
        child: viewScreen.image1OrigData ?? { height: 0, width: 0 },
      }),
    [containerSize, viewScreen.image1OrigData]
  );

  const fillCanvas = useCallback(() => {
    if (!ctx) {
      return;
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.fillRect(0, 0, ref.current?.width ?? 0, ref.current?.height ?? 0);
    const imageElement = document.createElement("img");
    imageElement.src = screenPreloadedFiles.image1 ?? "";
    imageElement.onload = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(imageElement, left, top, width, height);
      ctx.globalCompositeOperation = "destination-out";
    };
  }, [ctx, height, left, screenPreloadedFiles.image1, top, width]);

  const clearCanvas = useCallback(() => {
    if (!ctx) {
      return;
    }

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(0, 0, ref.current?.width ?? 0, ref.current?.height ?? 0);
  }, [ctx]);

  const onFinish = useCallback(() => {
    setFinished(true);
    clearCanvas();
  }, [clearCanvas]);

  const onReset = useCallback(() => {
    setFinished(false);
    fillCanvas();
  }, [fillCanvas]);

  const updateMousePosition = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    },
    []
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.height = window.innerHeight;
    ref.current.width = window.innerWidth;
    setCtx(ref.current.getContext("2d"));
  }, []);

  useEffect(() => {
    if (!ctx) return;

    ctx.fillStyle = "black";
    fillCanvas();
    ctx.lineWidth = 40;
    ctx.lineCap = "round";
  }, [ctx, fillCanvas]);

  const erase = useCallback(
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

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      <img
        className="w-full h-full absolute object-contain"
        src={screenPreloadedFiles.image2}
        alt="solution"
      />

      <canvas
        className={cx("absolute", {
          [classes.drawingCursor]: !finished,
        })}
        ref={ref}
        onMouseDown={updateMousePosition}
        onMouseEnter={updateMousePosition}
        onMouseMove={erase}
      />

      {toolbarRef.current &&
        ReactDOM.createPortal(
          <GameToolbar
            text={t("game-erase.task")}
            onFinish={onFinish}
            onReset={onReset}
            finished={finished}
            screen={viewScreen}
          />,
          toolbarRef.current
        )}
    </div>
  );
};
