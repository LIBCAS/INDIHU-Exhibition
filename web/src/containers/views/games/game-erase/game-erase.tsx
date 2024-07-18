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
import useResizeObserver from "hooks/use-resize-observer";

import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

import { ScreenProps } from "models";
import { AppState } from "store/store";
import { GameWipeScreen } from "models";

import cx from "classnames";
import classes from "./game-erase.module.scss";
import { calculateObjectFit } from "utils/object-fit";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useTutorial } from "context/tutorial-provider/use-tutorial";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameWipeScreen,
  (viewScreen) => ({ viewScreen })
);

const LINE_WIDTH = 40;

// - - -

export const GameErase = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const { expoDesignData, palette } = useExpoDesignData();
  const { t } = useTranslation("view-screen");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [setContainerRef, containerSize] = useResizeObserver();

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // current mouse position of the cursor

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  // - -

  const eraserToolType = useMemo(
    () => viewScreen.eraserToolType ?? "eraser",
    [viewScreen.eraserToolType]
  );

  // - -

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    setCtx(canvasRef.current.getContext("2d"));
  }, []);

  //

  // Upper image orig data, the one which will erase into the bottom image
  const upperImageOrigData = useMemo(
    () => viewScreen.image1OrigData ?? { width: 0, height: 0 },
    [viewScreen.image1OrigData]
  );

  // Upper image (its contained size on the screen)
  const {
    width: containedImage1Width,
    height: containedImage1Height,
    left: fromLeft,
    top: fromTop,
  } = useMemo(
    () =>
      calculateObjectFit({
        parent: containerSize,
        child: upperImageOrigData,
      }),
    [containerSize, upperImageOrigData]
  );

  //
  const fillCanvas = useCallback(() => {
    if (!ctx || !canvasRef.current) {
      return;
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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

  //
  const clearCanvas = useCallback(() => {
    if (!ctx || !canvasRef.current) {
      return;
    }

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, [ctx]);

  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    setCtx(canvasRef.current.getContext("2d"));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // - -

  //
  const updateMousePosition = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    },
    []
  );

  const erase = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (!ctx || e.buttons !== 1 || isGameFinished) {
        //setMousePosition({ x: e.clientX, y: e.clientY });
        return;
      }

      ctx.beginPath();
      ctx.moveTo(mousePosition.x, mousePosition.y);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();

      setMousePosition({ x: e.clientX, y: e.clientY });
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

  useEffect(() => {
    if (!ctx) {
      return;
    }

    ctx.fillStyle = expoDesignData?.backgroundColor ?? palette.background;
    fillCanvas();
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = "round";
  }, [ctx, expoDesignData?.backgroundColor, fillCanvas, palette.background]);

  // - -

  const { bind, TutorialTooltip, escapeTutorial } = useTutorial("gameWipe", {
    shouldOpen: !isMobileOverlay,
  });

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
    <div className="relative w-full h-full" ref={setContainerRef}>
      <img
        className="absolute w-full h-full object-contain"
        src={screenPreloadedFiles.image2}
        alt="solution-image"
      />

      <canvas
        className={cx("absolute touch-none", {
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
