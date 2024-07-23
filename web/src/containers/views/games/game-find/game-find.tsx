import ReactDOM from "react-dom";
import { useState, useMemo, useCallback, MouseEvent } from "react";
import { useTransition, animated } from "react-spring";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

import { useTutorial } from "context/tutorial-provider/use-tutorial";
import { useGameAutoNavigationOnResultTimeElapsed } from "../useGameAutoNavigationOnResultTimeElapsed";
import { useCornerInfoBox } from "hooks/spring-hooks/use-corner-info-box";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";
import { BasicTooltip } from "components/tooltip/BasicTooltip";

// Models
import { ScreenProps, Position } from "models";
import { GameFindScreen } from "models";
import { AppState } from "store/store";

// Utils
import cx from "classnames";
import classes from "./game-find.module.scss";
import {
  GAME_FIND_DEFAULT_NUMBER_OF_PINS,
  GAME_SCREEN_DEFAULT_RESULT_TIME,
} from "constants/screen";

// Assets
import pinIcon from "assets/img/pin.png";

// - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameFindScreen,
  (viewScreen) => ({ viewScreen })
);

// - - - -

export const GameFind = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { t } = useTranslation("view-screen");
  const { viewScreen } = useSelector(stateSelector);

  const {
    resultTime = GAME_SCREEN_DEFAULT_RESULT_TIME,
    showTip = false,
    numberOfPins = GAME_FIND_DEFAULT_NUMBER_OF_PINS,
    pinsTexts,
  } = viewScreen;

  // NOTE: pinsTexts - can store more than numberOfPins texts
  const slicedPinsTexts = useMemo(
    () => pinsTexts?.slice(0, numberOfPins),
    [numberOfPins, pinsTexts]
  );

  const { image1: assignmentImgSrc, image2: resultingImgSrc } =
    screenPreloadedFiles;

  // - - - -

  const [isGameFinished, setIsGameFinished] = useState(false);

  const [currentPinIndex, setCurrentPinIndex] = useState<number>(0);

  const [pinPositions, setPinPositions] = useState<(Position | undefined)[]>(
    new Array(numberOfPins).fill(undefined)
  );

  const areAllPinPositionsFilled = useMemo(
    () => pinPositions.every((pos) => pos !== undefined),
    [pinPositions]
  );

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const onGameReset = useCallback(() => {
    setPinPositions((prev) => prev.map((_position) => undefined));
    setCurrentPinIndex(0);
    setIsGameFinished(false);
  }, []);

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

  // When game is not finished, display always and when game is finished, it depends on showTip prop
  const shouldDisplayPin = useMemo(
    () => !isGameFinished || (isGameFinished && showTip),
    [isGameFinished, showTip]
  );

  // - - Tutorial - -

  const { bind, TutorialTooltip } = useTutorial("gameFind", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
  });

  // - - - -

  useGameAutoNavigationOnResultTimeElapsed({
    gameResultTime: resultTime * 1000,
    isGameFinished: isGameFinished,
  });

  // - - Transitions - -

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

  // NOTE: return value of this hook is transition as well
  const CornerPinInfoBox = useCornerInfoBox<string>({
    items: slicedPinsTexts,
    currIndex: currentPinIndex,
    textExtractor: (pinText) => pinText,
    position: "left",
  });

  return (
    <div className="w-full h-full relative">
      {imageTransition(({ opacity }, isGameFinished) =>
        !isGameFinished ? (
          <animated.img
            style={{ opacity }}
            className={cx("w-full h-full absolute object-contain", {
              [classes.pinningCursor]: !areAllPinPositionsFilled,
            })}
            onClick={pinImage}
            src={assignmentImgSrc}
            alt="assignment image"
          />
        ) : (
          <animated.img
            style={{ opacity }}
            className="w-full h-full absolute object-contain"
            src={resultingImgSrc}
            alt="result image"
          />
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
