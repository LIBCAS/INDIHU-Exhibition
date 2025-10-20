import ReactDOM from "react-dom";
import { useState, useCallback, useMemo, useEffect, Fragment } from "react";
import { animated } from "react-spring";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Hooks
import { useTranslation } from "react-i18next";
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import { useGameAutoNavigationOnResultTimeElapsed } from "../useGameAutoNavigationOnResultTimeElapsed";
import useResizeObserver from "hooks/use-resize-observer";
import { useElementResize } from "../../../../hooks/spring-hooks/use-element-resize";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

// Models
import { ScreenProps } from "models";
import { GameSizingScreen } from "models";
import { AppState } from "store/store";

// Utils
import { GAME_SCREEN_DEFAULT_RESULT_TIME } from "constants/screen";
import { calculateObjectFit } from "utils/object-fit";
import { calculateInfopointPositionByImageBoxSize } from "utils/infopoint-utils";

// Assets
import expandImg from "../../../../assets/img/expand.png";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameSizingScreen,
  (viewScreen) => ({ viewScreen })
);

// - - - - - -

export const GameSizing = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { t } = useTranslation("view-screen");
  const { viewScreen } = useSelector(stateSelector);

  const { resultTime = GAME_SCREEN_DEFAULT_RESULT_TIME } = viewScreen;

  const {
    image1: referenceImgSrc,
    image2: comparisonImgSrc,
    image3: resultingImgSrc,
  } = screenPreloadedFiles;

  // - - Resizing functionality - -

  const {
    image1OrigData: referenceImgOrigData,
    image2OrigData: comparisonImgOrigData,
  } = viewScreen;

  const [rightContainerRef, rightContainerSize] = useResizeObserver();
  const [leftContainerRef, leftContainerSize] = useResizeObserver();

  const {
    resizeSpring: comparisonImgResizeSpring,
    bindResizeDrag: comparisongImgBindResizeDrag,
  } = useElementResize({
    containerSize: rightContainerSize,
    dragResizingImgOrigData: comparisonImgOrigData ?? { width: 0, height: 0 },
  });

  const {
    resizeSpring: referenceImgResizeSpring,
    bindResizeDrag: referenceImgBindResizeDrag,
  } = useElementResize({
    containerSize: leftContainerSize,
    dragResizingImgOrigData: referenceImgOrigData ?? { width: 0, height: 0 },
  });

  // - - Tutorial - -

  const { bind: bindTutorial, TutorialTooltip } = useTutorial("gameSizing", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
  });

  // - - - -

  const [isGameFinished, setIsGameFinished] = useState(false);

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
  }, []);

  // const transition = useTransition(isGameFinished, {
  //   initial: { opacity: 1 },
  //   from: { opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  // });

  // - - - Infopoints (result image) - - -

  const {
    infopointStatusMap,
    setInfopointStatusMap,
    closeInfopoints,
    AnchorInfopoint,
    TooltipInfoPoint,
  } = useTooltipInfopoint(viewScreen);

  const image3OrigData = useMemo(
    () => viewScreen.image3OrigData ?? { width: 0, height: 0 },
    [viewScreen.image3OrigData]
  );

  const [resultImageRef, resultImageSize] =
    useResizeObserver<HTMLImageElement>();

  const {
    width: containedImageWidth,
    height: containedImageHeight,
    left: fromLeftWidth,
    top: fromTopHeight,
  } = useMemo(
    () =>
      calculateObjectFit({
        type: "contain",
        parent: resultImageSize,
        child: image3OrigData,
      }),
    [image3OrigData, resultImageSize]
  );

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

  // - - - - - -

  useGameAutoNavigationOnResultTimeElapsed({
    gameResultTime: resultTime * 1000,
    isGameFinished: isGameFinished,
  });

  return (
    <div className="w-full h-full flex px-12">
      {isGameFinished ? (
        <div className="relative m-4 flex flex-grow justify-center items-center">
          <img
            ref={resultImageRef}
            src={resultingImgSrc}
            className="absolute w-full h-full object-contain"
            alt="result image"
          />

          {/* Infopoints */}
          {viewScreen.infopoints3?.map((infopoint, infopointIndex) => {
            const infopointPosition = {
              left: infopoint.left,
              top: infopoint.top,
            };
            const imgBoxSize = {
              width: image3OrigData.width,
              height: image3OrigData.height,
            };
            const imgViewSize = {
              width: containedImageWidth,
              height: containedImageHeight,
            };

            const { left, top } = calculateInfopointPositionByImageBoxSize(
              infopointPosition,
              imgBoxSize,
              imgViewSize
            );

            const adjustedLeft = fromLeftWidth + left;
            const adjustedTop = fromTopHeight + top;

            return (
              <Fragment
                key={`infopoint-game-sizing-result-image-${infopointIndex}`}
              >
                <AnchorInfopoint
                  id={`infopoint-game-sizing-result-image-${infopointIndex}`}
                  left={adjustedLeft}
                  top={adjustedTop}
                  infopoint={infopoint}
                />
                <TooltipInfoPoint
                  key={`infopoint-game-sizing-result-image-${infopointIndex}`}
                  id={`infopoint-game-sizing-result-image-${infopointIndex}`}
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
        <div className="w-full h-full flex">
          {/* Left container */}
          <div
            className="relative m-4 flex flex-grow justify-center items-center"
            ref={leftContainerRef}
          >
            <div className="absolute p-2 border-2 border-white border-opacity-50 border-dashed">
              <animated.img
                src={referenceImgSrc}
                style={{
                  width: referenceImgResizeSpring.width,
                  height: referenceImgResizeSpring.height,
                }}
              />
              <img
                className="touch-none hover:cursor-se-resize absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2"
                src={expandImg}
                draggable={false}
                {...referenceImgBindResizeDrag()}
                alt="expand image icon left"
              />
            </div>
          </div>

          {/* Right container */}
          <div
            className="relative m-4 flex flex-grow justify-center items-center"
            ref={rightContainerRef}
          >
            <div className="absolute p-2 border-2 border-white border-opacity-50 border-dashed">
              <animated.img
                src={comparisonImgSrc}
                style={{
                  width: comparisonImgResizeSpring.width,
                  height: comparisonImgResizeSpring.height,
                }}
              />
              <img
                className="touch-none hover:cursor-se-resize absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2"
                src={expandImg}
                draggable={false}
                {...comparisongImgBindResizeDrag()}
                alt="expand image icon right"
              />
            </div>
          </div>
        </div>
      )}

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={isGameFinished}
            bindTutorial={bindTutorial("sizing")}
            solutionText={t("game-sizing.solution")}
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
          />,
          actionsPanelRef.current
        )}

      {TutorialTooltip}
    </div>
  );
};
