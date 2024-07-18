import ReactDOM from "react-dom";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { animated, useTransition } from "react-spring";
import { ScreenProps } from "models";
import cx from "classnames";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { AppState } from "store/store";
import { GameFindScreen } from "models";

import pinIcon from "assets/img/pin.png";
import classes from "./game-find.module.scss";
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import { useTranslation } from "react-i18next";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameFindScreen,
  (viewScreen) => ({ viewScreen })
);

export const GameFind = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const { t } = useTranslation("view-screen");

  const [finished, setFinished] = useState(false);
  const [pin, setPin] = useState<{ x: number; y: number }>();

  const onFinish = useCallback(() => {
    setFinished(true);
  }, []);

  const onReset = useCallback(() => {
    setFinished(false);
    setPin(undefined);
  }, []);

  const pinImage = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      if (pin) {
        return;
      }

      setPin({ x: e.clientX, y: e.clientY });
    },
    [pin]
  );

  const imageTransition = useTransition(finished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const pinTransition = useTransition(pin, {
    from: { x: 0 },
    enter: { x: 1 },
    leave: { x: 1 },
  });

  //

  const { bind, TutorialTooltip, escapeTutorial } = useTutorial("gameFind", {
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
    <div className="w-full h-full relative">
      {imageTransition(({ opacity }, finished) =>
        !finished ? (
          <animated.img
            style={{ opacity }}
            className={cx("w-full h-full absolute object-contain", {
              [classes.pinningCursor]: !pin,
            })}
            onClick={pinImage}
            src={screenPreloadedFiles.image1}
            alt="find game background"
          />
        ) : (
          <animated.img
            style={{ opacity }}
            className="w-full h-full absolute object-contain"
            src={screenPreloadedFiles.image2}
            alt="solution"
          />
        )
      )}

      {pinTransition(
        ({ x }, pin) =>
          pin && (
            <animated.img
              src={pinIcon}
              alt="pin icon"
              style={{
                position: "fixed",
                x: pin.x - 25,
                y: x.to(
                  [0, 0.9, 0.95, 1],
                  [pin.y - 50, pin.y - 80, pin.y - 45, pin.y - 50]
                ),
                rotateZ: x.to([0, 0.9, 0.95, 1], [0, 10, 0, 0]),
              }}
            />
          )
      )}

      {infoPanelRef.current &&
        ReactDOM.createPortal(
          <GameInfoPanel
            gameScreen={viewScreen}
            isGameFinished={finished}
            bindTutorial={bind("finding")}
            solutionText={t("game-find.solution")}
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
