import {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  Fragment,
} from "react";
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
import { calculateObjectFit } from "utils/object-fit";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";
import { calculateInfopointPositionByImageBoxSize } from "utils/infopoint-utils";

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

  const bottomImageOrigData = useMemo(
    () => viewScreen.image2OrigData ?? { width: 0, height: 0 },
    [viewScreen.image2OrigData]
  );

  // - - - Erase functionality - - -

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [setContainerRef, containerSize] = useResizeObserver();

  const {
    fillCanvas,
    clearCanvas,
    updateMousePosition,
    erase,
    isInfopointErased,
  } = useGameErase({
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

  // - - - Infopoints - - -

  const {
    width: containedImage1Width,
    height: containedImage1Height,
    left: fromLeft1,
    top: fromTop1,
  } = useMemo(
    () =>
      calculateObjectFit({
        parent: containerSize,
        child: upperImageOrigData,
      }),
    [containerSize, upperImageOrigData]
  );

  const {
    width: containedImage2Width,
    height: containedImage2Height,
    left: fromLeft2,
    top: fromTop2,
  } = useMemo(
    () =>
      calculateObjectFit({
        parent: containerSize,
        child: bottomImageOrigData,
      }),
    [containerSize, bottomImageOrigData]
  );

  const {
    infopointStatusMap,
    setInfopointStatusMap,
    closeInfopoints,
    AnchorInfopoint,
    TooltipInfoPoint,
  } = useTooltipInfopoint(viewScreen);

  // - - - Infopoints (closing) - - -

  useEffect(() => {
    const onKeyDownAction = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeInfopoints(viewScreen)();
      }
    };

    window.addEventListener("keydown", onKeyDownAction);
    return () => {
      window.removeEventListener("keydown", onKeyDownAction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeInfopoints, viewScreen.type]);

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

      {/* INFOPOINTS */}
      {viewScreen.infopoints1?.map((infopoint, infopointIndex) => {
        if (isGameFinished) {
          return null;
        }

        const infopointPosition = {
          left: infopoint.left,
          top: infopoint.top,
        };
        const imgBoxSize = {
          width: upperImageOrigData.width,
          height: upperImageOrigData.height,
        };
        const imgViewSize = {
          width: containedImage1Width,
          height: containedImage1Height,
        };

        const { left, top } = calculateInfopointPositionByImageBoxSize(
          infopointPosition,
          imgBoxSize,
          imgViewSize
        );

        const adjustedLeft = fromLeft1 + left;
        const adjustedTop = fromTop1 + top;

        const infopointInfo = {
          width: infopoint.pxSize ?? 24,
          height: infopoint.pxSize ?? 24,
          left: adjustedLeft,
          top: adjustedTop,
        };

        const isErased = isInfopointErased(infopointInfo);
        if (isErased) {
          return null;
        }

        return (
          <Fragment key={`erase-infopoint-upper-${infopointIndex}`}>
            <AnchorInfopoint
              id={`erase-infopoint-tooltip-upper-${infopointIndex}`}
              left={adjustedLeft}
              top={adjustedTop}
              infopoint={infopoint}
            />
            <TooltipInfoPoint
              key={`erase-infopoint-tooltip-upper-${infopointIndex}`}
              id={`erase-infopoint-tooltip-upper-${infopointIndex}`}
              infopoint={infopoint}
              infopointStatusMap={infopointStatusMap}
              setInfopointStatusMap={setInfopointStatusMap}
              primaryKey="0"
              secondaryKey={infopointIndex.toString()}
            />
          </Fragment>
        );
      })}

      {viewScreen.infopoints2?.map((infopoint, infopointIndex) => {
        const infopointPosition = {
          left: infopoint.left,
          top: infopoint.top,
        };
        const imgBoxSize = {
          width: bottomImageOrigData.width,
          height: bottomImageOrigData.height,
        };
        const imgViewSize = {
          width: containedImage2Width,
          height: containedImage2Height,
        };

        const { left, top } = calculateInfopointPositionByImageBoxSize(
          infopointPosition,
          imgBoxSize,
          imgViewSize
        );

        const adjustedLeft = fromLeft2 + left;
        const adjustedTop = fromTop2 + top;

        const infopointInfo = {
          width: infopoint.pxSize ?? 24,
          height: infopoint.pxSize ?? 24,
          left: adjustedLeft,
          top: adjustedTop,
        };

        const isErased = isInfopointErased(infopointInfo, 0.9);

        const shouldDisplay = isGameFinished || isErased;
        if (!shouldDisplay) {
          return null;
        }

        return (
          <Fragment key={`erase-infopoint-bottom-${infopointIndex}`}>
            <AnchorInfopoint
              id={`erase-infopoint-tooltip-bottom-${infopointIndex}`}
              left={adjustedLeft}
              top={adjustedTop}
              infopoint={infopoint}
            />
            <TooltipInfoPoint
              key={`erase-infopoint-tooltip-bottom-${infopointIndex}`}
              id={`erase-infopoint-tooltip-bottom-${infopointIndex}`}
              infopoint={infopoint}
              infopointStatusMap={infopointStatusMap}
              setInfopointStatusMap={setInfopointStatusMap}
              primaryKey="1"
              secondaryKey={infopointIndex.toString()}
            />
          </Fragment>
        );
      })}

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
