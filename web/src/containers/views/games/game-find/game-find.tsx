import ReactDOM from "react-dom";
import { useState, useCallback, MouseEvent } from "react";
import { useTransition, animated } from "react-spring";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

import { useTutorial } from "context/tutorial-provider/use-tutorial";

// Components
import { GameInfoPanel } from "../GameInfoPanel";
import { GameActionsPanel } from "../GameActionsPanel";

// Models
import { ScreenProps } from "models";
import { GameFindScreen } from "models";
import { AppState } from "store/store";

// Utils
import cx from "classnames";
import classes from "./game-find.module.scss";

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

  const { bind, TutorialTooltip } = useTutorial("gameFind", {
    shouldOpen: !isMobileOverlay,
    closeOnEsc: true,
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
