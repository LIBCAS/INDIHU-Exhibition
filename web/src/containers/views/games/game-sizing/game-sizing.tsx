import ReactDOM from "react-dom";
import { useState, useMemo, useCallback } from "react";
import { animated, useSpring, useTransition } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useTranslation } from "react-i18next";
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import useResizeObserver from "hooks/use-resize-observer";

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

  const { image2OrigData: comparisonImgOrigData } = viewScreen;

  const { width: comparisonImgWidth = 0, height: comparisonImgHeight = 0 } =
    comparisonImgOrigData ?? {};

  const comparisonImgRatio = useMemo(
    () => comparisonImgWidth / comparisonImgHeight,
    [comparisonImgWidth, comparisonImgHeight]
  );

  const {
    image1: referenceImgSrc,
    image2: comparisonImgSrc,
    image3: resultingImgSrc,
  } = screenPreloadedFiles;

  const [isGameFinished, setIsGameFinished] = useState(false);

  const [rightContainerRef, rightContainerSize] = useResizeObserver();

  const { bind: bindTutorial, TutorialTooltip } = useTutorial("gameSizing", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
  });

  const onGameFinish = useCallback(() => {
    setIsGameFinished(true);
  }, []);

  const onGameReset = useCallback(() => {
    setIsGameFinished(false);
  }, []);

  const [{ width, height }, api] = useSpring(() => ({
    width: comparisonImgWidth,
    height: comparisonImgHeight,
  }));

  const bindDrag = useDrag(
    ({ down, offset: [x, y], lastOffset: [xp, yp] }) => {
      if (!down) {
        return;
      }

      // we double the increments since the container is centered (grows on both sides)
      const width = 2 * x - xp;
      const height = 2 * y - yp;

      const widthBased = width > height * comparisonImgRatio;

      api.start({
        width: widthBased ? width : height * comparisonImgRatio,
        height: widthBased ? width / comparisonImgRatio : height,
        immediate: true,
      });
    },
    {
      from: () => [width.get(), height.get()],
      bounds: (state) => {
        const [xp = 0, yp = 0] = state?.lastOffset ?? [];

        const maxWidth = (rightContainerSize.width - 100 + xp) / 2;
        const maxHeight = (rightContainerSize.height - 100 + yp) / 2;
        const widthBased =
          rightContainerSize.width <
          rightContainerSize.height * comparisonImgRatio;

        return {
          left: (50 + xp) / 2,
          top: (50 + yp) / 2,
          right: widthBased ? maxWidth : maxHeight * comparisonImgRatio,
          bottom: widthBased ? maxWidth / comparisonImgRatio : maxHeight,
        };
      },
    }
  );

  const transition = useTransition(isGameFinished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <div className="w-full h-full flex px-12">
      <div className="flex-grow m-4 flex justify-center items-center relative">
        <img
          className="w-full h-full absolute object-contain"
          src={referenceImgSrc}
        />
      </div>

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
              <animated.img src={comparisonImgSrc} style={{ height, width }} />
              <img
                className="touch-none hover:cursor-se-resize absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2"
                src={expandImg}
                draggable={false}
                {...bindDrag()}
                alt="expand image icon"
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
