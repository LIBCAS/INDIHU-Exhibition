import { useCallback, useEffect, useMemo, useState } from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

import { animated, useSpring } from "react-spring";
import { useGesture } from "@use-gesture/react";

import useElementSize from "hooks/element-size-hook";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useTutorialStore } from "context/tutorial-provider/tutorial-provider";
import { useTutorial } from "context/tutorial-provider/use-tutorial";

import { Icon } from "components/icon/icon";

import { AppState } from "store/store";
import { ImageChangeScreen } from "models";
import { ScreenProps } from "models";

import cx from "classnames";
import { getScreenTime } from "utils/screen";
import { calculateObjectFit } from "utils/object-fit";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";

// - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ImageChangeScreen,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (viewScreen, shouldIncrement) => ({ viewScreen, shouldIncrement })
);

// - - -

export const ViewImageChange = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen, shouldIncrement } = useSelector(stateSelector);
  const { image1, image2 } = screenPreloadedFiles;

  // Hook up with reference to screen container div, provide its current width and height
  const [screenContainerRef, screenContainerSize] = useElementSize();

  const { expoDesignData } = useExpoDesignData();

  // - - -

  // Infopoints
  const { image1OrigData, image2OrigData } = useMemo(() => {
    const image1OrigData = viewScreen.image1OrigData ?? { width: 0, height: 0 };
    const image2OrigData = viewScreen.image2OrigData ?? { width: 0, height: 0 };
    return { image1OrigData, image2OrigData };
  }, [viewScreen.image1OrigData, viewScreen.image2OrigData]);

  const {
    width: firstContainedImageWidth,
    height: firstContainedImageHeight,
    left: fromContainerToFirstImageLeft,
    top: fromContainerToFirstImageTop,
  } = useMemo(
    () =>
      calculateObjectFit({
        parent: screenContainerSize,
        child: image1OrigData,
        type: "contain",
      }),
    [screenContainerSize, image1OrigData]
  );

  const {
    width: secondContainedImageWidth,
    height: secondContainedImageHeight,
    left: fromContainerToSecondImageLeft,
    top: fromContainerToSecondImageTop,
  } = useMemo(
    () =>
      calculateObjectFit({
        parent: screenContainerSize,
        child: image2OrigData,
        type: "contain",
      }),
    [screenContainerSize, image2OrigData]
  );

  // - - -

  const {
    infopointOpenStatusMap,
    setInfopointOpenStatusMap,
    closeInfopoints,
    ScreenAnchorInfopoint,
    TooltipInfoPoint,
  } = useTooltipInfopoint(viewScreen);

  // - - -

  const onKeyDownAction = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeInfopoints(viewScreen)();
      }
    },
    [closeInfopoints, viewScreen]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownAction);
    return () => {
      document.removeEventListener("keydown", onKeyDownAction);
    };
  }, [onKeyDownAction]);

  // - - -

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
    gradualPosition === undefined; // undefined means here VERTICAL_TOP_TO_BOTTOM

  // - - -

  // Tutorial 'screenChange' as "infotour" for this screen
  const { store } = useTutorialStore();
  const {
    bind: bindTutorial,
    TutorialTooltip,
    isTutorialOpen,
  } = useTutorial(
    "screenChange",
    animation !== "GRADUAL_TRANSITION" &&
      animation !== "FADE_IN_OUT_TWO_IMAGES" &&
      store.overlay.isCompleted
  );

  // - - -

  const [currentRodPosition, setCurrentRodPosition] = useState({ x: 0, y: 0 });

  const [{ x, y }, api] = useSpring(
    () => ({
      // Initial position, either horizontal or vertical, for the 'tahlo' (rod)
      // By default placed in the middle of a screen (for horizontal | vertical)
      x:
        animation === "GRADUAL_TRANSITION"
          ? 0
          : rodPosition === undefined
          ? screenContainerSize.width * 0.5
          : screenContainerSize.width * parseFloat(rodPosition),
      y:
        animation === "GRADUAL_TRANSITION"
          ? 0
          : rodPosition === undefined
          ? screenContainerSize.height * 0.5
          : screenContainerSize.height * parseFloat(rodPosition),
      config: {
        mass: 1,
        tension: 350,
        friction: 10,
      },
      onChange: (changedValues) => {
        const newValues = changedValues.value;
        if (animation === "HORIZONTAL") {
          setCurrentRodPosition((prev) => ({ ...prev, y: newValues.y }));
        }
        if (animation === "VERTICAL") {
          setCurrentRodPosition((prev) => ({ ...prev, x: newValues.x }));
        }
        if (animation === "GRADUAL_TRANSITION" && isGradualPositionVertical) {
          setCurrentRodPosition((prev) => ({ ...prev, y: newValues.y }));
        }
        if (animation === "GRADUAL_TRANSITION" && !isGradualPositionVertical) {
          setCurrentRodPosition((prev) => ({ ...prev, x: newValues.x }));
        }
      },
    }),
    [screenContainerSize, rodPosition, animation]
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
        const boundY = screenContainerSize.height * (5 / 100);
        const newY =
          y < boundY
            ? 0
            : y > screenContainerSize.height - boundY
            ? screenContainerSize.height - 17
            : y;

        const boundX = screenContainerSize.width * (5 / 100);
        const newX =
          x < boundX
            ? 0
            : x > screenContainerSize.width - boundX
            ? screenContainerSize.width
            : x;

        api.start({ y: newY, x: newX });
      },
    },
    {
      drag: {
        from: () => [x.get(), y.get()],
        bounds: {
          left: 0,
          right: screenContainerSize.width,
          top: 0,
          bottom: screenContainerSize.height,
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
        : screenContainerSize.height
      : undefined;

    const toY = isGradualPositionVertical
      ? gradualPosition === "VERTICAL_TOP_TO_BOTTOM" ||
        gradualPosition === undefined
        ? screenContainerSize.height
        : 0
      : undefined;

    const fromX = !isGradualPositionVertical
      ? gradualPosition === "HORIZONTAL_LEFT_TO_RIGHT"
        ? 0
        : screenContainerSize.width
      : undefined;

    const toX = !isGradualPositionVertical
      ? gradualPosition === "HORIZONTAL_LEFT_TO_RIGHT"
        ? screenContainerSize.width
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
    screenContainerSize,
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
      {/* 1. First image (before) */}
      {image1 && (
        <animated.img
          src={image1}
          className={cx(
            "w-full h-full absolute object-contain",
            isTutorialOpen && "bg-black opacity-40"
          )}
          alt="background"
          style={
            animation === "FADE_IN_OUT_TWO_IMAGES"
              ? { opacity: opacitySpring.opacity.to((opac) => opac) }
              : undefined
          }
          onClick={() => closeInfopoints(viewScreen)()}
        />
      )}

      {/* 2. Div with clipPath */}
      <animated.div
        className="w-full h-full absolute bg-background"
        style={{
          backgroundColor: expoDesignData?.backgroundColor,
          clipPath:
            animation === "FADE_IN_OUT_TWO_IMAGES"
              ? "inset(100% 100%)"
              : animation === "GRADUAL_TRANSITION"
              ? clipPathGradual
              : clipPath,
        }}
      />

      {/* 3. Second image (after) */}
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
          className={cx(
            "w-full h-full absolute object-contain",
            isTutorialOpen && "bg-black opacity-40"
          )}
          alt="foreground"
          onClick={() => closeInfopoints(viewScreen)()}
        />
      )}

      {/* 4. Infopoints Anchors - currently not for one type of animation ("prolnuti") */}
      {animation !== "FADE_IN_OUT_TWO_IMAGES" &&
        viewScreen.image1Infopoints?.map((infopoint, infopointIndex) => {
          // Percentage when choosing the infopoints in administrative (BEFORE image)
          const origLeftPercentage =
            infopoint.left / (image1OrigData.width / 100);
          const origTopPercentage =
            infopoint.top / (image1OrigData.height / 100);

          const leftPosition =
            fromContainerToFirstImageLeft +
            (firstContainedImageWidth / 100) * origLeftPercentage;
          const topPosition =
            fromContainerToFirstImageTop +
            (firstContainedImageHeight / 100) * origTopPercentage;

          // Dynamic infopoints feature!
          let isDisplayed = true;
          if (
            animation === "HORIZONTAL" &&
            currentRodPosition.y < topPosition
          ) {
            isDisplayed = false;
          }

          if (animation === "VERTICAL" && currentRodPosition.x < leftPosition) {
            isDisplayed = false;
          }

          if (
            animation === "GRADUAL_TRANSITION" &&
            (gradualPosition === "VERTICAL_TOP_TO_BOTTOM" ||
              gradualPosition === undefined) &&
            currentRodPosition.y < topPosition
          ) {
            isDisplayed = false;
          }

          if (
            animation === "GRADUAL_TRANSITION" &&
            gradualPosition === "VERTICAL_BOTTOM_TO_TOP" &&
            currentRodPosition.y < topPosition
          ) {
            isDisplayed = false;
          }

          if (
            animation === "GRADUAL_TRANSITION" &&
            gradualPosition === "HORIZONTAL_LEFT_TO_RIGHT" &&
            currentRodPosition.x < leftPosition
          ) {
            isDisplayed = false;
          }

          if (
            animation === "GRADUAL_TRANSITION" &&
            gradualPosition === "HORIZONTAL_RIGHT_TO_LEFT" &&
            currentRodPosition.x < leftPosition
          ) {
            isDisplayed = false;
          }

          if (!isDisplayed) {
            return null;
          }

          // Render the anchor infopoints
          return (
            <ScreenAnchorInfopoint
              key={`infopoint-tooltip-${0}-${infopointIndex}`}
              id={`infopoint-tooltip-${0}-${infopointIndex}`}
              top={topPosition}
              left={leftPosition}
              infopoint={infopoint}
            />
          );
        })}

      {animation !== "FADE_IN_OUT_TWO_IMAGES" &&
        viewScreen.image2Infopoints?.map((infopoint, infopointIndex) => {
          // Percentage when choosing the infopoints in administrative (AFTER image)
          const origLeftPercentage =
            infopoint.left / (image2OrigData.width / 100);
          const origTopPercentage =
            infopoint.top / (image2OrigData.height / 100);

          const leftPosition =
            fromContainerToSecondImageLeft +
            (secondContainedImageWidth / 100) * origLeftPercentage;
          const topPosition =
            fromContainerToSecondImageTop +
            (secondContainedImageHeight / 100) * origTopPercentage;

          // Dynamic infopoints feature!
          let isDisplayed = true;
          if (
            animation === "HORIZONTAL" &&
            currentRodPosition.y > topPosition
          ) {
            isDisplayed = false;
          }
          if (animation === "VERTICAL" && currentRodPosition.x > leftPosition) {
            isDisplayed = false;
          }

          if (
            animation === "GRADUAL_TRANSITION" &&
            (gradualPosition === "VERTICAL_TOP_TO_BOTTOM" ||
              gradualPosition === undefined) &&
            currentRodPosition.y > topPosition
          ) {
            isDisplayed = false;
          }

          if (
            animation === "GRADUAL_TRANSITION" &&
            gradualPosition === "VERTICAL_BOTTOM_TO_TOP" &&
            currentRodPosition.y > topPosition
          ) {
            isDisplayed = false;
          }

          if (
            animation === "GRADUAL_TRANSITION" &&
            gradualPosition === "HORIZONTAL_LEFT_TO_RIGHT" &&
            currentRodPosition.x > leftPosition
          ) {
            isDisplayed = false;
          }

          if (
            animation === "GRADUAL_TRANSITION" &&
            gradualPosition === "HORIZONTAL_RIGHT_TO_LEFT" &&
            currentRodPosition.x > leftPosition
          ) {
            isDisplayed = false;
          }

          if (!isDisplayed) {
            return null;
          }

          return (
            <ScreenAnchorInfopoint
              key={`infopoint-tooltip-${1}-${infopointIndex}`}
              id={`infopoint-tooltip-${1}-${infopointIndex}`}
              top={topPosition}
              left={leftPosition}
              infopoint={infopoint}
            />
          );
        })}

      {/* 5. Current position of 'tahlo' */}
      <animated.div
        style={
          animation === "FADE_IN_OUT_TWO_IMAGES"
            ? undefined
            : animation === "GRADUAL_TRANSITION"
            ? { x, y }
            : dragHandleStyle
        }
        className={cx(
          "absolute flex items-center touch-none pointer-events-none",
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
              "pointer-events-auto touch-none px-2 py-1 border-2 border-white bg-primary flex hover:cursor-pointer items-center gap-1",
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

      {/* 6. Infopoints Tooltips */}
      {animation !== "FADE_IN_OUT_TWO_IMAGES" &&
        Object.keys(infopointOpenStatusMap).map((mapKey) => {
          const [primaryKey, secondaryKey] = mapKey.split("-").map(Number);
          const infopoint =
            primaryKey === 0
              ? viewScreen.image1Infopoints?.[secondaryKey]
              : viewScreen.image2Infopoints?.[secondaryKey];

          if (!infopoint) {
            return null;
          }

          return (
            <TooltipInfoPoint
              key={`infopoint-tooltip-${mapKey}`}
              id={`infopoint-tooltip-${mapKey}`}
              infopoint={infopoint}
              infopointOpenStatusMap={infopointOpenStatusMap}
              setInfopointOpenStatusMap={setInfopointOpenStatusMap}
              primaryKey={primaryKey.toString()}
              secondaryKey={secondaryKey.toString()}
              // canBeOpen // optional
            />
          );
        })}

      {/* 7. Last relative div containing the tutorial for 'Tahlo' */}
      <animated.div style={isVertical ? { x } : { y }} className="relative">
        {TutorialTooltip}
      </animated.div>
    </div>
  );
};
