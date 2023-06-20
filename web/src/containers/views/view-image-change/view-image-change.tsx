import { useCallback, useEffect, useMemo, useState } from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

import { animated, useSpring } from "react-spring";
import { useGesture } from "@use-gesture/react";

import useElementSize from "hooks/element-size-hook";
import { asTutorialSteps, useTutorial } from "components/tutorial/use-tutorial";
import { useTranslation } from "react-i18next";

import { Icon } from "components/icon/icon";

import { AppState } from "store/store";
import { ImageChangeScreen } from "models";
import { ScreenProps } from "models";

import cx from "classnames";
import { getScreenTime } from "utils/screen";

// - - -

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

// - - -

export const ViewImageChange = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen, shouldIncrement } = useSelector(stateSelector);
  const { image1, image2 } = screenPreloadedFiles;

  // Tutorial 'screenChange' as "infotour" for this screen
  const tutorialSteps = useTutorialSteps();
  const {
    bind: bindTutorial,
    store,
    TutorialTooltip,
  } = useTutorial("screenChange", tutorialSteps);

  // Hook up with reference to screen container div, provide its current width and height
  const [screenContainerRef, { height, width }] = useElementSize();

  // Time after which the screen will go the next screen, set up in the administration panel for this screen
  const time = useMemo(() => getScreenTime(viewScreen), [viewScreen]);

  // viewScreen.animationType is either 'HORIZONTAL' | 'VERTICAL' | 'GRADUAL_TRANSITION' | 'FADE_IN_OUT_TWO_IMAGES'
  // viewScreen.transitionType is either 'ON_TIME' | 'ON_BUTTON' (not used!!)
  const animation = viewScreen.animationType;
  const isVertical = useMemo(() => animation === "VERTICAL", [animation]);

  const [isRodTouched, setIsRodTouched] = useState(false);
  const rodPosition = viewScreen.rodPosition;

  const gradualPosition = viewScreen.gradualTransitionBeginPosition;
  const isGradualPositionVertical =
    gradualPosition === "VERTICAL_TOP_TO_BOTTOM" ||
    gradualPosition === "VERTICAL_BOTTOM_TO_TOP" ||
    gradualPosition === undefined;

  const [{ x, y }, api] = useSpring(
    () => ({
      // Initial position, either horizontal or vertical, for the 'tahlo' (rod)
      // By default placed in the middle of a screen (for horizontal | vertical)
      x:
        animation === "GRADUAL_TRANSITION"
          ? 0
          : rodPosition === undefined
          ? width * 0.5
          : width * parseFloat(rodPosition),
      y:
        animation === "GRADUAL_TRANSITION"
          ? 0
          : rodPosition === undefined
          ? height * 0.5
          : height * parseFloat(rodPosition),
      config: {
        mass: 1,
        tension: 350,
        friction: 10,
      },
    }),
    [width, height, rodPosition, animation]
  );

  // Used for 'FADE_IN_OUT_TWO_IMAGES' animation
  const [opacitySpring, opacityApi] = useSpring(
    () => ({
      from: {
        opacity: 1,
      },
      to: {
        opacity: 0,
      },
      config: {
        duration: time,
      },
    }),
    [animation]
  );

  const shake = useCallback(() => {
    const currentX = x.get();
    const currentY = y.get();

    const jumpedX =
      rodPosition && (rodPosition === "0.75" || rodPosition === "1")
        ? currentX - 20
        : currentX + 20;
    const jumpedY =
      rodPosition && (rodPosition === "0.75" || rodPosition === "1")
        ? currentY - 20
        : currentY + 20;

    api.start({
      x: jumpedX,
      y: jumpedY,
    });
    api.start({
      x: currentX,
      y: currentY,
      delay: 1000,
    });
  }, [api, x, y, rodPosition]);

  // Shaking effect of 'tahlo'
  useEffect(() => {
    if (
      animation === "GRADUAL_TRANSITION" ||
      animation === "FADE_IN_OUT_TWO_IMAGES"
    ) {
      return;
    }
    if (isRodTouched) {
      return;
    }

    const timeout = setTimeout(() => shake(), 2000);
    const interval = setInterval(() => shake(), 10000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [shake, isRodTouched, animation]);

  //
  const bind = useGesture(
    {
      onDrag: ({ down, offset: [x, y] }) => {
        if (!down) return;

        setIsRodTouched(true);

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

  // Effect to calculate initial x,y coordinates of tahlo for gradual transition only!
  useEffect(() => {
    if (animation !== "GRADUAL_TRANSITION") {
      return;
    }

    const fromY = isGradualPositionVertical
      ? gradualPosition === "VERTICAL_TOP_TO_BOTTOM" ||
        gradualPosition === undefined
        ? 0
        : height
      : undefined;

    const toY = isGradualPositionVertical
      ? gradualPosition === "VERTICAL_TOP_TO_BOTTOM" ||
        gradualPosition === undefined
        ? height
        : 0
      : undefined;

    const fromX = !isGradualPositionVertical
      ? gradualPosition === "HORIZONTAL_LEFT_TO_RIGHT"
        ? 0
        : width
      : undefined;

    const toX = !isGradualPositionVertical
      ? gradualPosition === "HORIZONTAL_LEFT_TO_RIGHT"
        ? width
        : 0
      : undefined;

    api.start({
      from: { x: fromX, y: fromY },
      to: { x: toX, y: toY },
      config: {
        duration: time,
      },
    });
  }, [
    animation,
    api,
    width,
    height,
    time,
    gradualPosition,
    isGradualPositionVertical,
  ]);

  // Effect to possibly stop either GRADUAL_TRANSITION or FADE_IN_OUT_TWO_IMAGES animation
  useEffect(() => {
    if (animation === "GRADUAL_TRANSITION") {
      if (!shouldIncrement) {
        api.pause();
      } else {
        api.resume();
      }
    }

    if (animation === "FADE_IN_OUT_TWO_IMAGES") {
      if (!shouldIncrement) {
        opacityApi.pause();
      } else {
        opacityApi.resume();
      }
    }
  }, [shouldIncrement, animation, api, opacityApi]);

  // For 'HORIZONTAL' | 'VERTICAL' animation
  const clipPath = isVertical
    ? x.to((x) => `inset(0 0 0 ${x}px)`)
    : y.to((y) => `inset(${y}px 0 0 0)`);

  // For 'GRADUAL_TRANSITION' animation
  const clipPathGradual = isGradualPositionVertical
    ? y.to((y) => `inset(${y}px 0 0 0)`)
    : x.to((x) => `inset(0 0 0 ${x}px)`);

  const dragHandleStyle = isVertical
    ? { x, translateX: "-50%" }
    : { y, translateY: "-50%" };

  return (
    <div
      ref={screenContainerRef}
      className="w-full h-full flex items-center justify-center relative"
    >
      {/* 1. First image */}
      {image1 && (
        <animated.img
          src={image1}
          className="w-full h-full absolute object-contain"
          alt="background"
          style={
            animation === "FADE_IN_OUT_TWO_IMAGES"
              ? { opacity: opacitySpring.opacity.to((opac) => opac) }
              : undefined
          }
        />
      )}

      {/* 2. Div with clipPath */}
      <animated.div
        className="w-full h-full absolute bg-background"
        style={
          animation === "FADE_IN_OUT_TWO_IMAGES"
            ? { clipPath: "inset(100% 100%)" }
            : animation === "GRADUAL_TRANSITION"
            ? { clipPath: clipPathGradual }
            : { clipPath: clipPath }
        }
      />

      {/* 3. Second image */}
      {image2 && (
        <animated.img
          style={
            animation === "FADE_IN_OUT_TWO_IMAGES"
              ? { opacity: opacitySpring.opacity.to((opac) => 1 - opac) }
              : animation === "GRADUAL_TRANSITION"
              ? { clipPath: clipPathGradual }
              : { clipPath: clipPath }
          }
          src={image2}
          className="w-full h-full absolute object-contain"
          alt="foreground"
        />
      )}

      {/* 4. Current position of 'tahlo' */}
      <animated.div
        style={
          animation === "FADE_IN_OUT_TWO_IMAGES"
            ? undefined
            : animation === "GRADUAL_TRANSITION"
            ? { x, y }
            : dragHandleStyle
        }
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

        {/* Show tahlo only when horizontal or vertical tahlo is selected! */}
        {(animation === "HORIZONTAL" || animation === "VERTICAL") && (
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

      {/* 5. Last relative div containing the tutorial for 'Tahlo' */}
      <animated.div style={isVertical ? { x } : { y }} className="relative">
        {!store.overlay && TutorialTooltip}
      </animated.div>
    </div>
  );
};
