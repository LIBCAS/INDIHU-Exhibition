import { useCallback, useEffect, useMemo, useState } from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { useGesture } from "@use-gesture/react";
import cx from "classnames";

import { AppState } from "store/store";
import { ImageChangeScreen } from "models";
import { Icon } from "components/icon/icon";
import useElementSize from "hooks/element-size-hook";

import { ScreenProps } from "../types";
import { getScreenTime } from "utils/screen";
import { asTutorialSteps, useTutorial } from "components/tutorial/use-tutorial";
import { useTranslation } from "react-i18next";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ImageChangeScreen,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (viewScreen, shouldIncrement) => ({ viewScreen, shouldIncrement })
);

const useTutorialSteps = () => {
  const { t } = useTranslation("tutorial");

  return useMemo(
    () =>
      asTutorialSteps([
        {
          key: "dragThumb",
          label: t("screenChange.dragThumb.label"),
          text: t("screenChange.dragThumb.text"),
        },
      ]),
    [t]
  );
};

export const ViewImageChange = ({ screenFiles }: ScreenProps) => {
  const { viewScreen, shouldIncrement } = useSelector(stateSelector);
  const { image1, image2 } = screenFiles;
  const [ref, { height, width }] = useElementSize();
  const tutorialSteps = useTutorialSteps();
  const {
    bind: bindTutorial,
    store,
    TutorialTooltip,
  } = useTutorial("screenChange", tutorialSteps);

  const animation = viewScreen.animationType;
  const time = useMemo(() => getScreenTime(viewScreen), [viewScreen]);
  const isVertical = useMemo(() => animation === "VERTICAL", [animation]);
  const [touched, setTouched] = useState(false);

  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: {
      mass: 1,
      tension: 350,
      friction: 10,
    },
  }));

  const shake = useCallback(() => {
    const currentX = x.get();
    const currentY = y.get();
    api.start({
      x: currentX + 20,
      y: currentY + 20,
    });
    api.start({
      x: currentX,
      y: currentY,
      delay: 1000,
    });
  }, [api, x, y]);

  useEffect(() => {
    if (touched) return;

    const timeout = setTimeout(() => shake(), 2000);
    const interval = setInterval(() => shake(), 10000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [shake, touched]);

  const bind = useGesture(
    {
      onDrag: ({ down, offset: [x, y] }) => {
        if (!down) return;

        setTouched(true);

        api.start({ x, y, immediate: true });
      },
      onDragEnd: ({ offset: [x, y] }) => {
        const boundY = height * (15 / 100);
        const newY = y < boundY ? 0 : y > height - boundY ? height - 17 : y;

        const boundX = width * (15 / 100);
        const newX = x < boundX ? 0 : x > width - boundX ? width : x;

        api.start({ y: newY, x: newX });
      },
    },
    {
      drag: {
        from: () => [x.get(), y.get()],
        bounds: {
          left: 0,
          right: width,
          top: 0,
          bottom: height,
        },
      },
    }
  );

  useEffect(() => {
    if (animation !== "GRADUAL_TRANSITION") return;

    if (shouldIncrement) {
      api.resume();
      return;
    }

    api.pause();
  }, [animation, api, shouldIncrement]);

  useEffect(() => {
    if (animation !== "GRADUAL_TRANSITION") return;

    api.start({
      y: height,
      config: {
        duration: time,
      },
    });
  }, [animation, api, height, time]);

  const clipPath = isVertical
    ? x.to((x) => `inset(0 0 0 ${x}px)`)
    : y.to((y) => `inset(${y}px 0 0 0)`);

  const dragHandleStyle = isVertical
    ? { x, translateX: "-50%" }
    : { y, translateY: "-50%" };

  return (
    <div
      ref={ref}
      className="w-full h-full flex items-center justify-center relative"
    >
      {image1 && (
        <img
          src={image1}
          className="w-full h-full absolute object-contain"
          alt="backgound"
        />
      )}
      <animated.div
        className="w-full h-full absolute bg-background"
        style={{ clipPath }}
      />
      {image2 && (
        <animated.img
          style={{ clipPath }}
          src={image2}
          className="w-full h-full absolute object-contain"
          alt="foreground"
        />
      )}
      <animated.div
        style={dragHandleStyle}
        className={cx(
          "absolute flex items-center touch-none",
          isVertical && "left-0 h-full flex-col",
          !isVertical && "top-0 w-full"
        )}
      >
        <div
          className={cx(
            "flex-grow bg-white bg-opacity-75",
            isVertical && "w-0.5",
            !isVertical && "h-0.5"
          )}
        />
        {animation !== "GRADUAL_TRANSITION" && (
          <div
            {...bind()}
            {...bindTutorial("dragThumb")}
            className={cx(
              "touch-none px-2 py-1 border-2 border-white bg-primary flex hover:cursor-pointer items-center gap-1",
              !isVertical && "flex-col"
            )}
          >
            <Icon
              color="white"
              name={`keyboard_arrow_${isVertical ? "left" : "up"}`}
            />
            <Icon
              color="white"
              name={`keyboard_arrow_${isVertical ? "right" : "down"}`}
            />
          </div>
        )}
        <div
          className={cx(
            "bg-white bg-opacity-75",
            isVertical && "w-0.5 flex-grow-[4]",
            !isVertical && "h-0.5 flex-grow"
          )}
        />
      </animated.div>

      <animated.div style={isVertical ? { x } : { y }} className="relative">
        {!store.overlay && TutorialTooltip}
      </animated.div>
    </div>
  );
};
