import ReactDOM from "react-dom";
import { useState, useCallback } from "react";
import { animated, useTransition } from "react-spring";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useTranslation } from "react-i18next";
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import useResizeObserver from "hooks/use-resize-observer";
import { useElementResize } from "./use-element-resize";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

// Models
import { ScreenProps } from "models";
import { GameSizingScreen } from "models";
import { AppState } from "store/store";

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

  const { spring: comparisonImgSpring, bindDrag: comparisongImgBindDrag } =
    useElementResize({
      imageOrigData: comparisonImgOrigData ?? { width: 0, height: 0 },
      containerSize: rightContainerSize,
    });

  const { spring: referenceImgSpring, bindDrag: referenceImgBindDrag } =
    useElementResize({
      imageOrigData: referenceImgOrigData ?? { width: 0, height: 0 },
      containerSize: leftContainerSize,
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

  const transition = useTransition(isGameFinished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <div className="w-full h-full flex px-12">
      {/* Left container */}
      <div
        className="flex-grow m-4 flex justify-center items-center relative"
        ref={leftContainerRef}
      >
        <div className="absolute p-2 border-2 border-white border-opacity-50 border-dashed">
          <animated.img
            src={referenceImgSrc}
            style={{
              width: referenceImgSpring.width,
              height: referenceImgSpring.height,
            }}
          />
          <img
            className="touch-none hover:cursor-se-resize absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2"
            src={expandImg}
            draggable={false}
            {...referenceImgBindDrag()}
            alt="expand image icon left"
          />
        </div>
      </div>

      {/* Right container */}
      <div
        className="flex-grow m-4 flex justify-center items-center relative"
        ref={rightContainerRef}
      >
        {transition(({ opacity }, isGameFinished) =>
          isGameFinished ? (
            <animated.img
              className="w-full h-full absolute object-contain"
              src={resultingImgSrc}
              style={{ opacity }}
            />
          ) : (
            <animated.div
              className="absolute p-2 border-2 border-white border-opacity-50 border-dashed"
              style={{ opacity }}
            >
              <animated.img
                src={comparisonImgSrc}
                style={{
                  width: comparisonImgSpring.width,
                  height: comparisonImgSpring.height,
                }}
              />
              <img
                className="touch-none hover:cursor-se-resize absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2"
                src={expandImg}
                draggable={false}
                {...comparisongImgBindDrag()}
                alt="expand image icon right"
              />
            </animated.div>
          )
        )}
      </div>

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
