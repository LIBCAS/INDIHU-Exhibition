import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

import { animated, useSpring } from "react-spring";
import { useGesture } from "@use-gesture/react";

// Custom hooks
import useResizeObserver from "hooks/use-resize-observer";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useTutorial } from "context/tutorial-provider/use-tutorial";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";

// Components
import { Icon } from "components/icon/icon";

// Types
import { AppState } from "store/store";
import { ImageChangeScreen } from "models";
import { ScreenProps } from "models";

// Utils
import cx from "classnames";
import { getScreenTime } from "utils/screen";
import { calculateObjectFit } from "utils/object-fit";
import {
  shouldShowBeforeImageInfopoint,
  shouldShowAfterImageInfopoint,
} from "./shouldShowDynamicInfopoint";
import { calculateInfopointPosition } from "utils/infopoint-utils";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ImageChangeScreen,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (viewScreen, shouldIncrement) => ({ viewScreen, shouldIncrement })
);

// - - - - - -

export const ViewImageChange = ({ screenPreloadedFiles }: ScreenProps) => {
  const { image1, image2 } = screenPreloadedFiles;
  const { viewScreen, shouldIncrement } = useSelector(stateSelector);

  const { expoDesignData } = useExpoDesignData();

  // - - - Data from the administration - - -

  /**
   * Time interval after which the app automatically transitions to the next screen.
   * This value is configured in the administration panel for this screen.
   */
  const time = useMemo(() => getScreenTime(viewScreen), [viewScreen]);

  /**
   * Animation type as selected inside administration panel
   * Possible values: 'HORIZONTAL' | 'VERTICAL' | 'GRADUAL_TRANSITION' | 'FADE_IN_OUT_TWO_IMAGES'
   */
  const animationType = useMemo(
    () => viewScreen.animationType,
    [viewScreen.animationType]
  );

  /**
   * Helper variable
   */
  const isAnimationTypeVertical = useMemo(
    () => animationType === "VERTICAL",
    [animationType]
  );

  /**
   * Represents initial position of rod, as selected in the administration panel for this screen.
   * Applicable only when the animation type is set to 'HORIZONTAL' or 'VERTICAL'.
   * That is because other animation types are not using rod.
   */
  const rodPosition = useMemo(
    () => viewScreen.rodPosition,
    [viewScreen.rodPosition]
  );

  /**
   * Applicable only when the animation type is set to 'GRADUAL_TRANSITION'.
   * That is because it represents the direction from where to where we are gradually transiting.
   */
  const gradualTransitionBeginPosition = useMemo(
    () => viewScreen.gradualTransitionBeginPosition,
    [viewScreen.gradualTransitionBeginPosition]
  );

  /**
   * Helper variable
   * NOTE: Undefined means here 'VERTICAL_TOP_TO_BOTTOM'
   */
  const isGradualTransitionVertical = useMemo(
    () =>
      gradualTransitionBeginPosition === "VERTICAL_TOP_TO_BOTTOM" ||
      gradualTransitionBeginPosition === "VERTICAL_BOTTOM_TO_TOP" ||
      gradualTransitionBeginPosition === undefined,
    [gradualTransitionBeginPosition]
  );

  // - - - States - - -

  const [imageBeforeEl, setImageBeforeEl] = useState<HTMLImageElement | null>(
    null
  );

  const [imageAfterEl, setImageAfterEl] = useState<HTMLImageElement | null>(
    null
  );

  const [isRodTouched, setIsRodTouched] = useState<boolean>(false);
  const [currentRodPosition, setCurrentRodPosition] = useState({ x: 0, y: 0 });
  const [currOpacityValue, setCurrOpacityValue] = useState<number>(1);

  // - - - Custom hooks - - -

  /**
   * Hook up with reference to screen container div, in order to get its current width and height
   */
  const [screenContainerRef, screenContainerSize] = useResizeObserver();

  // - - - Infopoints (1) - - -

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

  // - - - Infopoints (2) - - -

  const {
    infopointStatusMap,
    setInfopointStatusMap,
    closeInfopoints,
    AnchorInfopoint,
    TooltipInfoPoint,
  } = useTooltipInfopoint(viewScreen);

  // - - - Infopoints (3) - - -

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

  // - - - Tutorial - - -

  const {
    bind: bindTutorial,
    TutorialTooltip,
    isTutorialOpen,
  } = useTutorial("screenChange", {
    shouldOpen:
      animationType !== "GRADUAL_TRANSITION" &&
      animationType !== "FADE_IN_OUT_TWO_IMAGES",
  });

  // - - - Springs - - -

  /**
   * Spring responsible for controlling animation of the position of the rod
   * Applicable for animation type 'HORIZONTAL' | 'VERTICAL' | 'GRADUAL_TRANSITION'
   */
  const [{ x, y }, api] = useSpring(
    () => ({
      // NOTE: First, we need to calculate initial position for the rod
      // By default, the rod is placed in the middle of a screen (for horizontal and vertical)
      x:
        animationType === "GRADUAL_TRANSITION"
          ? 0
          : rodPosition === undefined
          ? screenContainerSize.width * 0.5
          : screenContainerSize.width * parseFloat(rodPosition),
      y:
        animationType === "GRADUAL_TRANSITION"
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
        if (animationType === "HORIZONTAL") {
          setCurrentRodPosition((prev) => ({ ...prev, y: newValues.y }));
        }
        if (animationType === "VERTICAL") {
          setCurrentRodPosition((prev) => ({ ...prev, x: newValues.x }));
        }
        if (
          animationType === "GRADUAL_TRANSITION" &&
          isGradualTransitionVertical
        ) {
          setCurrentRodPosition((prev) => ({ ...prev, y: newValues.y }));
        }
        if (
          animationType === "GRADUAL_TRANSITION" &&
          !isGradualTransitionVertical
        ) {
          setCurrentRodPosition((prev) => ({ ...prev, x: newValues.x }));
        }
      },
    }),
    [screenContainerSize, rodPosition, animationType]
  );

  /**
   * Spring responsible for controlling animation of opacity when transitioning from one image to the second one
   * Applicable only for the animation type 'FADE_IN_OUT_TWO_IMAGES' (prolnuti)
   */
  const [opacitySpring, opacityApi] = useSpring(
    () => ({
      from: { opacity: 1 },
      to: { opacity: 0 },
      config: { duration: time },
    }),
    [animationType]
  );

  // - - - Callbacks - - -

  /**
   *
   */
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

  /**
   *
   */
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

  // - - - Effects - - -

  /**
   * Effect responsible for shaking effect of the rod
   * Applicable only for the animation type: 'HORIZONTAL' | 'VERTICAL'
   */
  useEffect(() => {
    if (
      animationType === "GRADUAL_TRANSITION" ||
      animationType === "FADE_IN_OUT_TWO_IMAGES"
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
  }, [shake, isRodTouched, animationType]);

  /**
   * Effect responsible for starting the animation for the x,y coordinates of rod
   * This effect is applicable only for the animation type: 'GRADUAL_TRANSITION'
   */
  useEffect(() => {
    if (animationType !== "GRADUAL_TRANSITION") {
      return;
    }

    const fromY = isGradualTransitionVertical
      ? gradualTransitionBeginPosition === "VERTICAL_TOP_TO_BOTTOM" ||
        gradualTransitionBeginPosition === undefined
        ? 0
        : screenContainerSize.height
      : undefined;

    const toY = isGradualTransitionVertical
      ? gradualTransitionBeginPosition === "VERTICAL_TOP_TO_BOTTOM" ||
        gradualTransitionBeginPosition === undefined
        ? screenContainerSize.height
        : 0
      : undefined;

    const fromX = !isGradualTransitionVertical
      ? gradualTransitionBeginPosition === "HORIZONTAL_LEFT_TO_RIGHT"
        ? 0
        : screenContainerSize.width
      : undefined;

    const toX = !isGradualTransitionVertical
      ? gradualTransitionBeginPosition === "HORIZONTAL_LEFT_TO_RIGHT"
        ? screenContainerSize.width
        : 0
      : undefined;

    api.start({
      from: { x: fromX, y: fromY },
      to: { x: toX, y: toY },
      config: { duration: time },
    });
  }, [
    animationType,
    api,
    screenContainerSize,
    time,
    gradualTransitionBeginPosition,
    isGradualTransitionVertical,
  ]);

  /**
   * Effect responsible for starting the opacity animation
   * This effect is applicable only for the animation type: 'FADE_IN_OUT_TWO_IMAGES' (prolnuti)
   */
  useEffect(() => {
    if (animationType !== "FADE_IN_OUT_TWO_IMAGES") {
      return;
    }

    opacityApi.start({
      from: { opacity: 1 },
      to: { opacity: 0 },
      config: { duration: time },
      onChange: (changedValues) => {
        const newOpacityValue = changedValues.value.opacity as number;
        setCurrOpacityValue(newOpacityValue);
      },
    });
  }, [animationType, opacityApi, time]);

  /**
   * Effect responsible for stopping and resuming automatic animation for 'GRADUAL_TRANSITION'
   */
  useEffect(() => {
    if (animationType === "GRADUAL_TRANSITION") {
      if (!shouldIncrement) {
        api.pause();
      } else {
        api.resume();
      }
    }
  }, [animationType, shouldIncrement, api]);

  /**
   * Effect responsible for stopping and resuming automatic animation for 'FADE_IN_OUT_TWO_IMAGES'
   */
  useEffect(() => {
    if (animationType === "FADE_IN_OUT_TWO_IMAGES") {
      if (!shouldIncrement) {
        opacityApi.pause();
      } else {
        opacityApi.resume();
      }
    }
  }, [animationType, shouldIncrement, opacityApi]);

  // - - - Stylings - - -

  /**
   * Only for animation type 'HORIZONTAL' | 'VERTICAL'
   */
  const clipPath = isAnimationTypeVertical
    ? x.to((x) => `inset(0 0 0 ${x}px)`)
    : y.to((y) => `inset(${y}px 0 0 0)`);

  /**
   * Only for animation type 'GRADUAL_TRANSITION'
   */
  const clipPathGradual = isGradualTransitionVertical
    ? y.to((y) => `inset(${y}px 0 0 0)`)
    : x.to((x) => `inset(0 0 0 ${x}px)`);

  /**
   *
   */
  const dragHandleStyle = isAnimationTypeVertical
    ? { x, translateX: "-50%" }
    : { y, translateY: "-50%" };

  // - - - GUI - - -

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
            animationType === "FADE_IN_OUT_TWO_IMAGES"
              ? { opacity: opacitySpring.opacity.to((opac) => opac) }
              : undefined
          }
          onClick={() => closeInfopoints(viewScreen)()}
          onLoad={(e) => setImageBeforeEl(e.currentTarget)}
        />
      )}

      {/* 2. Div with clipPath */}
      <animated.div
        className="w-full h-full absolute bg-background"
        style={{
          backgroundColor: expoDesignData?.backgroundColor,
          clipPath:
            animationType === "FADE_IN_OUT_TWO_IMAGES"
              ? "inset(100% 100%)"
              : animationType === "GRADUAL_TRANSITION"
              ? clipPathGradual
              : clipPath,
        }}
      />

      {/* 3. Second image (after) */}
      {image2 && (
        <animated.img
          style={
            animationType === "FADE_IN_OUT_TWO_IMAGES"
              ? { opacity: opacitySpring.opacity.to((opac) => 1 - opac) }
              : animationType === "GRADUAL_TRANSITION"
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
          onLoad={(e) => setImageAfterEl(e.currentTarget)}
        />
      )}

      {/* 4. Infopoints Anchors - currently for all types of animation */}
      {/* 4a) Before image infopoints */}
      {viewScreen.image1Infopoints?.map((infopoint, infopointIndex) => {
        const infopointPosition = { left: infopoint.left, top: infopoint.top };
        const imgBoxSize = {
          width: viewScreen.image1OrigData?.width ?? 0,
          height: viewScreen.image1OrigData?.height ?? 0,
        };
        const imgNaturalSize = {
          width: imageBeforeEl?.naturalWidth ?? 0,
          height: imageBeforeEl?.naturalHeight ?? 0,
        };
        const imgViewSize = {
          width: firstContainedImageWidth,
          height: firstContainedImageHeight,
        };

        if (
          !imgBoxSize.width ||
          !imgBoxSize.height ||
          !imgNaturalSize.width ||
          !imgNaturalSize.height ||
          !imgViewSize.width ||
          !imgViewSize.height
        ) {
          return null;
        }

        const { left, top } = calculateInfopointPosition(
          infopointPosition,
          imgBoxSize,
          imgNaturalSize,
          imgViewSize
        );

        const adjustedLeft = fromContainerToSecondImageLeft + left;
        const adjustedTop = fromContainerToSecondImageTop + top;

        // Dynamic infopoints feature!
        if (
          !shouldShowBeforeImageInfopoint({
            infopointPosition: { left: adjustedLeft, top: adjustedTop },
            currentRodPosition: {
              left: currentRodPosition.x,
              top: currentRodPosition.y,
            },
            currOpacity: currOpacityValue,
            animationType: animationType,
            gradualPosition: gradualTransitionBeginPosition,
          })
        ) {
          return null;
        }

        // Render the anchor infopoints
        return (
          <React.Fragment key={`infopoint-tooltip-${0}-${infopointIndex}`}>
            <AnchorInfopoint
              id={`infopoint-tooltip-${0}-${infopointIndex}`}
              left={adjustedLeft}
              top={adjustedTop}
              infopoint={infopoint}
            />
            <TooltipInfoPoint
              id={`infopoint-tooltip-${0}-${infopointIndex}`}
              infopoint={infopoint}
              infopointStatusMap={infopointStatusMap}
              setInfopointStatusMap={setInfopointStatusMap}
              primaryKey="0"
              secondaryKey={infopointIndex.toString()}
              // canBeOpen // optional
            />
          </React.Fragment>
        );
      })}

      {/* 4b) After image infopoints */}
      {viewScreen.image2Infopoints?.map((infopoint, infopointIndex) => {
        const infopointPosition = { left: infopoint.left, top: infopoint.top };
        const imgBoxSize = {
          width: viewScreen.image2OrigData?.width ?? 0,
          height: viewScreen.image2OrigData?.height ?? 0,
        };
        const imgNaturalSize = {
          width: imageAfterEl?.naturalWidth ?? 0,
          height: imageAfterEl?.naturalHeight ?? 0,
        };
        const imgViewSize = {
          width: secondContainedImageWidth,
          height: secondContainedImageHeight,
        };

        if (
          !imgBoxSize.width ||
          !imgBoxSize.height ||
          !imgNaturalSize.width ||
          !imgNaturalSize.height ||
          !imgViewSize.width ||
          !imgViewSize.height
        ) {
          return null;
        }

        const { left, top } = calculateInfopointPosition(
          infopointPosition,
          imgBoxSize,
          imgNaturalSize,
          imgViewSize
        );

        const adjustedLeft = fromContainerToFirstImageLeft + left;
        const adjustedTop = fromContainerToFirstImageTop + top;

        // Dynamic infopoints feature!
        if (
          !shouldShowAfterImageInfopoint({
            infopointPosition: { left: adjustedLeft, top: adjustedTop },
            currentRodPosition: {
              left: currentRodPosition.x,
              top: currentRodPosition.y,
            },
            currOpacity: currOpacityValue,
            animationType: animationType,
            gradualPosition: gradualTransitionBeginPosition,
          })
        ) {
          return null;
        }

        return (
          <React.Fragment key={`infopoint-tooltip-${1}-${infopointIndex}`}>
            <AnchorInfopoint
              id={`infopoint-tooltip-${1}-${infopointIndex}`}
              left={adjustedLeft}
              top={adjustedTop}
              infopoint={infopoint}
            />
            <TooltipInfoPoint
              id={`infopoint-tooltip-${1}-${infopointIndex}`}
              infopoint={infopoint}
              infopointStatusMap={infopointStatusMap}
              setInfopointStatusMap={setInfopointStatusMap}
              primaryKey="1"
              secondaryKey={infopointIndex.toString()}
              // canBeOpen // optional
            />
          </React.Fragment>
        );
      })}

      {/* 5. Current position of 'tahlo' */}
      <animated.div
        style={
          animationType === "FADE_IN_OUT_TWO_IMAGES"
            ? undefined
            : animationType === "GRADUAL_TRANSITION"
            ? { x, y }
            : dragHandleStyle
        }
        className={cx(
          "absolute flex items-center touch-none pointer-events-none",
          isAnimationTypeVertical && "left-0 h-full flex-col",
          !isAnimationTypeVertical && "top-0 w-full"
        )}
      >
        <div
          className={cx(
            "flex-grow bg-white bg-opacity-75",
            isAnimationTypeVertical && "w-0.5",
            !isAnimationTypeVertical && "h-0.5"
          )}
        />

        {/* Show tahlo only when horizontal or vertical tahlo is selected! */}
        {(animationType === "HORIZONTAL" || animationType === "VERTICAL") && (
          <div
            {...bind()}
            {...bindTutorial("dragThumb")}
            className={cx(
              "pointer-events-auto touch-none px-2 py-1 border-2 border-white bg-primary flex hover:cursor-pointer items-center gap-1",
              {
                "flex-col": !isAnimationTypeVertical,
              }
            )}
            style={{ backgroundColor: expoDesignData?.iconsColor }}
          >
            <Icon
              color="white"
              name={`keyboard_arrow_${isAnimationTypeVertical ? "left" : "up"}`}
            />
            <Icon
              color="white"
              name={`keyboard_arrow_${
                isAnimationTypeVertical ? "right" : "down"
              }`}
            />
          </div>
        )}

        <div
          className={cx(
            "bg-white bg-opacity-75",
            isAnimationTypeVertical && "w-0.5 flex-grow-[4]",
            !isAnimationTypeVertical && "h-0.5 flex-grow"
          )}
        />
      </animated.div>

      {/* 6. Last relative div containing the tutorial for 'Tahlo' */}
      <animated.div
        style={isAnimationTypeVertical ? { x } : { y }}
        className="relative"
      >
        {TutorialTooltip}
      </animated.div>
    </div>
  );
};
