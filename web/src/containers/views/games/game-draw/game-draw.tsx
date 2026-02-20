import ReactDOM from "react-dom";
import {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
  Fragment,
  ReactNode,
} from "react";
import { animated, useTransition } from "react-spring";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Custom hooks
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";
import { useGameAutoNavigationOnResultTimeElapsed } from "../useGameAutoNavigationOnResultTimeElapsed";
import { useBoolean } from "hooks/boolean-hook";
import { useGameDraw } from "./useGameDraw";
import { useGameDrawScreenshot } from "./useGameDrawScreenshot";
import useResizeObserver from "hooks/use-resize-observer";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

import { Popper } from "components/popper/popper";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { PiEraserFill } from "react-icons/pi";
import { MdDraw } from "react-icons/md";

// Models
import { GameDrawScreen, ScreenProps } from "models";
import { AppState } from "store/store";

// Utils
import cx from "classnames";
import classes from "./game-draw.module.scss";
import {
  GAME_DRAW_DEFAULT_TRANSPARENCY,
  GAME_SCREEN_DEFAULT_RESULT_TIME,
} from "constants/screen";
import {
  GAME_DRAW_DEFAULT_COLOR,
  GAME_DRAW_DEFAULT_THICKNESS,
  GAME_DRAW_DEFAULT_IS_ERASING,
} from "constants/screen";

import { calculateObjectFit } from "utils/object-fit";
import { calculateInfopointPositionByImageBoxSize } from "utils/infopoint-utils";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameDrawScreen,
  (viewScreen) => ({ viewScreen })
);

// - - - - - -

export const GameDraw = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { t } = useTranslation("view-screen");
  const { viewScreen } = useSelector(stateSelector);

  const { image1: assignmentImgSrc, image2: resultingImgSrc } =
    screenPreloadedFiles;

  // - - - Derived variables (administration) - - -

  const resultTime = useMemo<number>(
    () => viewScreen.resultTime ?? GAME_SCREEN_DEFAULT_RESULT_TIME,
    [viewScreen.resultTime]
  );

  const showDrawing = useMemo<boolean>(
    () => viewScreen.showDrawing ?? false,
    [viewScreen.showDrawing]
  );

  const initialColor = useMemo<string>(
    () => viewScreen.initialColor ?? GAME_DRAW_DEFAULT_COLOR,
    [viewScreen.initialColor]
  );

  const initialThickness = useMemo<number>(
    () => viewScreen.initialThickness ?? GAME_DRAW_DEFAULT_THICKNESS,
    [viewScreen.initialThickness]
  );

  const initialTransparency = useMemo<number>(
    () => viewScreen.initialTransparency ?? GAME_DRAW_DEFAULT_TRANSPARENCY,
    [viewScreen.initialTransparency]
  );

  // - - - States - - -

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [color, setColor] = useState<string>(initialColor);

  const [thickness, setThickness] = useState<number>(initialThickness);

  const [transparency, setTransparency] = useState<number>(initialTransparency);

  const [isErasing, { toggle: toggleTool }] = useBoolean(
    GAME_DRAW_DEFAULT_IS_ERASING
  );

  // - - - States (thickness popover) - - -

  const [thicknessAnchor, setThicknessAnchor] =
    useState<HTMLButtonElement | null>(null);

  const [
    isThicknessPopoverOpen,
    { toggle: toggleThicknessPopover, setFalse: closeThicknessPopover },
  ] = useBoolean(false);

  // - - - States (transparency popover) - - -

  const [transparencyAnchor, setTransparencyAnchor] =
    useState<HTMLButtonElement | null>(null);

  const [
    isTransparencyPopoverOpen,
    { toggle: toggleTransparencyPopover, setFalse: closeTransparencyPopover },
  ] = useBoolean(false);

  // - - - Derived variables (helpers) - - -

  const shouldDisplayCanvas = useMemo<boolean>(
    () => !isGameFinished || showDrawing,
    [isGameFinished, showDrawing]
  );

  const shouldDisplayResultImg = useMemo<boolean>(
    () => isGameFinished && !!resultingImgSrc,
    [isGameFinished, resultingImgSrc]
  );

  const ToolIcon = useMemo<ReactNode>(() => {
    if (isErasing) {
      return <MdDraw size={24} />;
    }
    return <PiEraserFill size={24} />;
  }, [isErasing]);

  // - - - Ref - - -

  const [assignmentImgRef, assignmentImgSize, assignmentImgEl] =
    useResizeObserver<HTMLImageElement>();

  const [resultImgRef, resultImgSize, resultImgEl] =
    useResizeObserver<HTMLImageElement>();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // - - - Draw functionality - - -

  const { startDrawing, stopDrawing, draw } = useGameDraw({
    containerSize: assignmentImgSize,
    canvasRef,
    isGameFinished,
    color,
    thickness,
    transparency,
    isErasing,
  });

  // - - - Game Handling - - -

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
  }, []);

  // - - - Transition animation between drawing and solution img - - -

  const transition = useTransition(shouldDisplayResultImg, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  // - - - Tutorial stuff - - -

  const { bind, TutorialTooltip } = useTutorial("gameDraw", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
  });

  // - - - Infopoints (assignment image) - - -

  const {
    infopointStatusMap,
    setInfopointStatusMap,
    closeInfopoints,
    AnchorInfopoint,
    TooltipInfoPoint,
  } = useTooltipInfopoint(viewScreen);

  const image1OrigData = useMemo(
    () => viewScreen.image1OrigData ?? { width: 0, height: 0 },
    [viewScreen.image1OrigData]
  );

  const {
    width: containedAssignmentImgWidth,
    height: containedAssignmentImgHeight,
    left: containedAssignmentImgLeft,
    top: containedAssignmentImgTop,
  } = useMemo(
    () =>
      calculateObjectFit({
        type: "contain",
        parent: assignmentImgSize,
        child: image1OrigData,
      }),
    [image1OrigData, assignmentImgSize]
  );

  // - - - Infopoints (assignment image closing) - - -

  // Event handler on key down press
  const onKeyDownAction = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeInfopoints(viewScreen)();
      }
    },
    [closeInfopoints, viewScreen]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownAction);

    return () => {
      document.removeEventListener("keydown", onKeyDownAction);
    };
  }, [onKeyDownAction]);

  // - - - Screenshot functionality - - -

  const { handleTakeScreenshot } = useGameDrawScreenshot({
    imageContainerEl: assignmentImgEl,
    canvasEl: canvasRef.current,
    containedImageWidth: containedAssignmentImgWidth,
    containedImageHeight: containedAssignmentImgHeight,
    fromLeftWidth: containedAssignmentImgLeft,
    fromTopHeight: containedAssignmentImgTop,
  });

  // - - - Game Auto Navigation - - -

  useGameAutoNavigationOnResultTimeElapsed({
    gameResultTime: resultTime * 1000,
    isGameFinished: isGameFinished,
  });

  return (
    <div className="relative w-[100svw] h-[100svh]">
      {transition(({ opacity }, shouldDisplayResultImg) =>
        !shouldDisplayResultImg ? (
          <div className="absolute w-full h-full">
            <animated.img
              ref={assignmentImgRef}
              src={assignmentImgSrc}
              alt="assignment img"
              className="absolute w-full h-full object-contain"
              style={{ opacity }}
            />

            {/* Infopoints for assignment image */}
            {viewScreen.infopoints1?.map((infopoint, infopointIndex) => {
              const infopointPosition = {
                left: infopoint.left,
                top: infopoint.top,
              };
              const imgBoxSize = {
                width: image1OrigData.width,
                height: image1OrigData.height,
              };
              const imgViewSize = {
                width: containedAssignmentImgWidth,
                height: containedAssignmentImgHeight,
              };

              const { left, top } = calculateInfopointPositionByImageBoxSize(
                infopointPosition,
                imgBoxSize,
                imgViewSize
              );

              const adjustedLeft = containedAssignmentImgWidth + left;
              const adjustedTop = containedAssignmentImgHeight + top;

              return (
                <Fragment key={`draw-infopoint-${infopointIndex}`}>
                  <AnchorInfopoint
                    id={`draw-infopoint-tooltip-${infopointIndex}`}
                    left={adjustedLeft}
                    top={adjustedTop}
                    infopoint={infopoint}
                    style={{ zIndex: infopointIndex + 1 }}
                  />
                  <TooltipInfoPoint
                    key={`draw-infopoint-tooltip-${infopointIndex}`}
                    id={`draw-infopoint-tooltip-${infopointIndex}`}
                    infopoint={infopoint}
                    infopointStatusMap={infopointStatusMap}
                    setInfopointStatusMap={setInfopointStatusMap}
                    primaryKey={infopointIndex.toString()}
                  />
                </Fragment>
              );
            })}
          </div>
        ) : (
          <div className="absolute w-full h-full">
            <animated.img
              ref={resultImgRef}
              src={resultingImgSrc}
              alt="result image"
              className="absolute w-full h-full object-contain"
              style={{ opacity }}
            />
          </div>
        )
      )}

      {shouldDisplayCanvas && (
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
      )}

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

      <Popper
        anchor={transparencyAnchor}
        placement="top-start"
        open={isTransparencyPopoverOpen}
        onClickOutside={closeTransparencyPopover}
        arrow
      >
        <input
          type="range"
          draggable={false}
          className="h-full bg-white"
          min={5}
          max={100}
          step={5}
          value={transparency}
          onChange={(e) => setTransparency(parseInt(e.target.value))}
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
              isGameFinished === false ? (
                <div key="screenshot-button" className="relative">
                  <Button
                    color="expoTheme"
                    iconBefore={<Icon name="file_download" />}
                    onClick={async () => await handleTakeScreenshot(true)}
                    tooltip={{
                      id: "game-draw-overlay-screenshot-button-tooltip",
                      content: t("game-draw.takeScreenshotAction"),
                    }}
                  />
                </div>
              ) : (
                <></>
              ),

              <div key="tool-button" className="relative">
                <Button
                  color="expoTheme"
                  onClick={toggleTool}
                  iconBefore={<Icon name={ToolIcon} />}
                  tooltip={{
                    id: "game-overlay-tool-button-tooltip",
                    content: isErasing
                      ? t("game-draw.switchToPencilAction")
                      : t("game-draw.switchToEraserAction"),
                  }}
                />
              </div>,

              <div key="thickness-button" className="relative">
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

              <div key="color-picker-button" className="relative">
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

              <div key="transparency-button" className="relative">
                <Button
                  ref={(ref) => setTransparencyAnchor(ref)}
                  color="expoTheme"
                  onClick={toggleTransparencyPopover}
                  iconBefore={<Icon name="opacity" />}
                  tooltip={{
                    id: "game-draw-overlay-opacity-button-tooltip",
                    content: t("game-draw.transparencyChooserAction"),
                  }}
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
