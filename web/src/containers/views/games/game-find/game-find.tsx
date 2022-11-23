import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { MouseEvent, useCallback, useState } from "react";
import { animated, useTransition } from "react-spring";
import { ScreenProps } from "containers/views/types";
import cx from "classnames";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { AppState } from "store/store";
import { GameFindScreen } from "models";

import pinIcon from "assets/img/pin.png";
import classes from "./game-find.module.scss";
import { GameToolbar } from "../game-toolbar";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameFindScreen,
  (viewScreen) => ({ viewScreen })
);

export const GameFind = ({ screenFiles, toolbarRef }: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const [finished, setFinished] = useState(false);
  const [pin, setPin] = useState<{ x: number; y: number }>();
  const { t } = useTranslation("screen");

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
            src={screenFiles.image1}
            alt="find game background"
          />
        ) : (
          <animated.img
            style={{ opacity }}
            className="w-full h-full absolute object-contain"
            src={screenFiles.image2}
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

      {toolbarRef.current &&
        ReactDOM.createPortal(
          <GameToolbar
            text={t("game-find.task")}
            onFinish={onFinish}
            onReset={onReset}
            finished={finished}
            screen={viewScreen}
          />,
          toolbarRef.current
        )}
    </div>
  );
};
