import ReactDOM from "react-dom";
import { useCallback, useState } from "react";
import { animated, useSpring, useTransition } from "react-spring";
import { useTranslation } from "react-i18next";
import { useDrag } from "@use-gesture/react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { AppState } from "store/store";

import { ScreenProps } from "models";
import useElementSize from "hooks/element-size-hook";
import { GameMoveScreen } from "models";

import { GameToolbar } from "../game-toolbar";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameMoveScreen,
  (viewScreen) => ({ viewScreen })
);

export const GameMove = ({ screenPreloadedFiles, toolbarRef }: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const [finished, setFinished] = useState(false);
  const [ref, { width, height }] = useElementSize();
  const [dragRef, { width: dragWidth, height: dragHeight }] = useElementSize();
  const { t } = useTranslation("screen");

  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
  }));

  const onFinish = useCallback(() => {
    setFinished(true);
  }, []);

  const onReset = useCallback(() => {
    setFinished(false);
    api.start({ x: 0, y: 0 });
  }, [api]);

  const bind = useDrag(
    ({ down, offset: [x, y] }) => {
      if (!down) {
        return;
      }

      api.start({ x, y, immediate: true });
    },
    {
      from: () => [x.get(), y.get()],
      bounds: {
        left: 0,
        right: width - dragWidth,
        top: 0,
        bottom: height - dragHeight,
      },
    }
  );

  const transition = useTransition(finished, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <div className="w-full h-full relative" ref={ref}>
      {transition(({ opacity }, finished) =>
        finished ? (
          <animated.img
            className="w-full h-full absolute object-contain"
            src={screenPreloadedFiles.image2}
            style={{ opacity }}
          />
        ) : (
          <>
            <animated.img
              className="w-full h-full absolute object-contain"
              src={screenPreloadedFiles.image1}
              style={{ opacity }}
            />
            <animated.div
              className="toch-none absolute p-2 border-2 border-white border-opacity-50 border-dashed hover:cursor-move"
              style={{ x, y, opacity }}
              {...bind()}
              ref={dragRef}
            >
              <img
                src={screenPreloadedFiles.object}
                draggable={false}
                alt="drag content"
              />
            </animated.div>
          </>
        )
      )}

      {toolbarRef.current &&
        ReactDOM.createPortal(
          <GameToolbar
            text={t("game-move.task")}
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
