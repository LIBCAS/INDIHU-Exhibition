import ReactDOM from "react-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { animated, useSpring, useTransition } from "react-spring";
import { createSelector } from "reselect";
import { useDrag } from "@use-gesture/react";
import { useSelector } from "react-redux";

import { ScreenProps } from "models";
import { GameSizingScreen } from "models";
import { AppState } from "store/store";
import { useTranslation } from "react-i18next";
import useElementSize from "hooks/element-size-hook";

import expand from "../../../../assets/img/expand.png";
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";
import { useTutorial } from "context/tutorial-provider/use-tutorial";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameSizingScreen,
  (viewScreen) => ({ viewScreen })
);

export const GameSizing = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const [finished, setFinished] = useState(false);
  const [ref, containerSize] = useElementSize();
  const { t } = useTranslation("view-screen");

  const onFinish = useCallback(() => {
    setFinished(true);
  }, []);

  const onReset = useCallback(() => {
    setFinished(false);
  }, []);

  const { height: originalHeight = 0, width: originalWidth = 0 } =
    viewScreen.image2OrigData ?? {};

  const [{ width, height }, api] = useSpring(() => ({
    width: originalWidth,
    height: originalHeight,
  }));

  const ratio = useMemo(
    () => originalWidth / originalHeight,
    [originalHeight, originalWidth]
  );

  const bind = useDrag(
    ({ down, offset: [x, y], lastOffset: [xp, yp] }) => {
      if (!down) {
        return;
      }

      // we double the increments since the container is centered (grows on both sides)
      const width = 2 * x - xp;
      const height = 2 * y - yp;

      const widthBased = width > height * ratio;

      api.start({
        width: widthBased ? width : height * ratio,
        height: widthBased ? width / ratio : height,
        immediate: true,
      });
    },
    {
      from: () => [width.get(), height.get()],
      bounds: (state) => {
        const [xp = 0, yp = 0] = state?.lastOffset ?? [];

        const maxWidth = (containerSize.width - 100 + xp) / 2;
        const maxHeight = (containerSize.height - 100 + yp) / 2;
        const widthBased = containerSize.width < containerSize.height * ratio;

        return {
          left: (50 + xp) / 2,
          top: (50 + yp) / 2,
          right: widthBased ? maxWidth : maxHeight * ratio,
          bottom: widthBased ? maxWidth / ratio : maxHeight,
        };
      },
    }
  );

  const transition = useTransition(finished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  // - -

  const {
    bind: bindTutorial,
    TutorialTooltip,
    escapeTutorial,
  } = useTutorial("gameSizing", !isMobileOverlay);

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
    <div className="w-full h-full flex px-12">
      <div className="flex-grow m-4 flex justify-center items-center relative">
        <img
          className="w-full h-full absolute object-contain"
          src={screenPreloadedFiles.image1}
        />
      </div>
      <div
        className="flex-grow m-4 flex justify-center items-center relative"
        ref={ref}
      >
        {transition(({ opacity }, finished) =>
          finished ? (
            <animated.img
              className="w-full h-full absolute object-contain"
              src={screenPreloadedFiles.image3}
              style={{ opacity }}
            />
          ) : (
            <animated.div
              className="absolute p-2 border-2 border-white border-opacity-50 border-dashed"
              style={{ opacity }}
            >
              <animated.img
                src={screenPreloadedFiles.image2}
                style={{ height, width }}
              />
              <img
                className="touch-none hover:cursor-se-resize absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2"
                src={expand}
                draggable={false}
                {...bind()}
                alt="expand icon"
              />
            </animated.div>
          )
        )}
      </div>

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={finished}
            text={t("game-sizing.task")}
            bindTutorial={bindTutorial("sizing")}
          />,
          infoPanelRef.current
        )}

      {actionsPanelRef.current &&
        ReactDOM.createPortal(
          <GameActionsPanel
            isMobileOverlay={isMobileOverlay}
            isGameFinished={finished}
            onGameFinish={onFinish}
            onGameReset={onReset}
          />,
          actionsPanelRef.current
        )}

      {TutorialTooltip}
    </div>
  );
};
