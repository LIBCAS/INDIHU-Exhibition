import ReactDOM from "react-dom";
import {
  useState,
  useMemo,
  useCallback,
  MouseEvent,
  useEffect,
  Fragment,
} from "react";
import { useTransition, animated } from "react-spring";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

// Custom hooks
import useResizeObserver from "hooks/use-resize-observer";
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import { useGameAutoNavigationOnResultTimeElapsed } from "../useGameAutoNavigationOnResultTimeElapsed";
import { useCornerInfoBox } from "hooks/spring-hooks/use-corner-info-box";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";
import { BasicTooltip } from "components/tooltip/BasicTooltip";

// Models
import { ScreenProps, Position, ImageOrigData } from "models";
import { GameFindScreen } from "models";
import { AppState } from "store/store";

// Utils
import cx from "classnames";
import classes from "./game-find.module.scss";
import {
  GAME_FIND_DEFAULT_NUMBER_OF_PINS,
  GAME_SCREEN_DEFAULT_RESULT_TIME,
} from "constants/screen";
import { calculateObjectFit } from "utils/object-fit";
import { calculateInfopointPositionByImageBoxSize } from "utils/infopoint-utils";

// Assets
import pinIcon from "assets/img/pin.png";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameFindScreen,
  (viewScreen) => ({ viewScreen })
);

// - - - - - -

export const GameFind = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { t } = useTranslation("view-screen");
  const { viewScreen } = useSelector(stateSelector);

  const { image1: assignmentImgSrc, image2: resultingImgSrc } =
    screenPreloadedFiles;

  // - - - Custom hooks - - -

  const [containerRef, containerSize] = useResizeObserver();

  // - - - Derived variables (administration) - - -

  const resultTime = useMemo<number>(
    () => viewScreen.resultTime ?? GAME_SCREEN_DEFAULT_RESULT_TIME,
    [viewScreen.resultTime]
  );

  const showTip = useMemo<boolean>(
    () => viewScreen.showTip ?? false,
    [viewScreen.showTip]
  );

  const numberOfPins = useMemo<number>(
    () => viewScreen.numberOfPins ?? GAME_FIND_DEFAULT_NUMBER_OF_PINS,
    [viewScreen.numberOfPins]
  );

  const pinsTexts = useMemo<string[] | undefined>(
    () => viewScreen.pinsTexts,
    [viewScreen.pinsTexts]
  );

  // - - - States - - -

  const [isGameFinished, setIsGameFinished] = useState(false);

  const [currentPinIndex, setCurrentPinIndex] = useState<number>(0);

  const [pinPositions, setPinPositions] = useState<(Position | undefined)[]>(
    new Array(numberOfPins).fill(undefined)
  );

  // - - - Derived variables - - -

  /**
   * NOTE: Original pinsTexts can store more than numberOfPins texts!
   */
  const slicedPinsTexts = useMemo(
    () => pinsTexts?.slice(0, numberOfPins),
    [numberOfPins, pinsTexts]
  );

  /**
   *
   */
  const areAllPinPositionsFilled = useMemo(
    () => pinPositions.every((pos) => pos !== undefined),
    [pinPositions]
  );

  /**
   * When game is not finished, display always and when game is finished, it depends on showTip prop
   */
  const shouldDisplayPin = useMemo(
    () => !isGameFinished || (isGameFinished && showTip),
    [isGameFinished, showTip]
  );

  // - - - Callbacks - - -

  /**
   *
   */
  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  /**
   *
   */
  const onGameReset = useCallback(() => {
    setPinPositions((prev) => prev.map((_position) => undefined));
    setCurrentPinIndex(0);
    setIsGameFinished(false);
  }, []);

  /**
   *
   */
  const pinImage = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      if (areAllPinPositionsFilled || currentPinIndex === pinPositions.length) {
        return;
      }

      setPinPositions((prevPositions) =>
        prevPositions.map((pos, posIdx) =>
          posIdx === currentPinIndex ? { left: e.clientX, top: e.clientY } : pos
        )
      );

      setCurrentPinIndex((prev) => prev + 1);
    },
    [areAllPinPositionsFilled, currentPinIndex, pinPositions.length]
  );

  // - - - Infopoint Comments (result image) - - -

  const resultImageOrigData = useMemo<ImageOrigData>(
    () => viewScreen.image2OrigData ?? { width: 0, height: 0 },
    [viewScreen.image2OrigData]
  );

  const {
    width: containedResultImgWidth,
    height: containedResultImgHeight,
    left: containedResultImgLeft,
    top: containedResultImgTop,
  } = useMemo(
    () =>
      calculateObjectFit({
        type: "contain",
        parent: containerSize,
        child: resultImageOrigData,
      }),
    [containerSize, resultImageOrigData]
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

  // - - - Tutorial - --

  const { bind, TutorialTooltip } = useTutorial("gameFind", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
  });

  // - - - Corner Info Box - - -

  /**
   * NOTE: Return value of this hook is transition !!
   */
  const CornerPinInfoBox = useCornerInfoBox<string>({
    items: slicedPinsTexts,
    currIndex: currentPinIndex,
    textExtractor: (pinText) => pinText,
    position: "left",
  });

  // - - - Auto Game Navigation - - -

  useGameAutoNavigationOnResultTimeElapsed({
    gameResultTime: resultTime * 1000,
    isGameFinished: isGameFinished,
  });

  // - - - Animation Transitions - - -

  const imageTransition = useTransition(isGameFinished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const pinPositionsTransition = useTransition(pinPositions, {
    from: { x: 0 },
    enter: { x: 1 },
    leave: { x: 1 },
  });

  // - - - GUI - - -

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {imageTransition(({ opacity }, isGameFinished) =>
        !isGameFinished ? (
          <div className="absolute w-full h-full">
            <animated.img
              src={assignmentImgSrc}
              alt="assignment image"
              className={cx("absolute w-full h-full object-contain", {
                [classes.pinningCursor]: !areAllPinPositionsFilled,
              })}
              style={{ opacity }}
              onClick={pinImage}
            />
          </div>
        ) : (
          <div className="absolute w-full h-full">
            <animated.img
              src={resultingImgSrc}
              alt="result image"
              className="absolute w-full h-full object-contain"
              style={{ opacity }}
            />

            {/* Infopoints 2 */}
            {viewScreen.image2Infopoints?.map((infopoint, infopointIndex) => {
              const infopointPosition = {
                left: infopoint.left,
                top: infopoint.top,
              };
              const imgBoxSize = {
                width: resultImageOrigData.width,
                height: resultImageOrigData.height,
              };
              const imgViewSize = {
                width: containedResultImgWidth,
                height: containedResultImgHeight,
              };

              const { left, top } = calculateInfopointPositionByImageBoxSize(
                infopointPosition,
                imgBoxSize,
                imgViewSize
              );

              const adjustedLeft = containedResultImgLeft + left;
              const adjustedTop = containedResultImgTop + top;

              return (
                <Fragment key={`find-result-img-infopoint-${infopointIndex}`}>
                  <AnchorInfopoint
                    id={`find-result-img-tooltip-${infopointIndex}`}
                    left={adjustedLeft}
                    top={adjustedTop}
                    infopoint={infopoint}
                    isComment={true}
                  />
                  <TooltipInfoPoint
                    key={`find-result-img-tooltip-${infopointIndex}`}
                    id={`find-result-img-tooltip-${infopointIndex}`}
                    infopoint={infopoint}
                    infopointStatusMap={infopointStatusMap}
                    setInfopointStatusMap={setInfopointStatusMap}
                    primaryKey={infopointIndex.toString()}
                  />
                </Fragment>
              );
            })}
          </div>
        )
      )}

      {pinPositionsTransition(
        ({ x }, pinPos, _trState, trIndex) =>
          pinPos &&
          shouldDisplayPin && (
            <>
              <animated.img
                key={`pin-icon-${trIndex}`}
                data-tooltip-id={`pin-icon-${trIndex}`}
                src={pinIcon}
                alt="pin icon"
                style={{
                  position: "fixed",
                  x: pinPos.left - 25,
                  y: x.to(
                    [0, 0.9, 0.95, 1],
                    [
                      pinPos.top - 50,
                      pinPos.top - 80,
                      pinPos.top - 45,
                      pinPos.top - 50,
                    ]
                  ),
                  rotateZ: x.to([0, 0.9, 0.95, 1], [0, 10, 0, 0]),
                }}
              />

              <BasicTooltip
                id={`pin-icon-${trIndex}`}
                content={slicedPinsTexts?.[trIndex] ?? ""}
              />
            </>
          )
      )}

      {CornerPinInfoBox}

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={isGameFinished}
            bindTutorial={bind("finding")}
            solutionText={t("game-find.solution")}
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
