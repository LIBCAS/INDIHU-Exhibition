import { useMemo } from "react";
import { useSelector } from "react-redux";
import { animated, easings, useSpring } from "react-spring";
import { createSelector } from "reselect";

import { AppState } from "store/store";
import { ParallaxScreeen } from "models";
import { getScreenTime } from "utils/screen";
import useElementSize from "hooks/element-size-hook";

import { ScreenProps } from "../types";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ParallaxScreeen,
  ({ expo }: AppState) => expo.viewProgress,
  (viewScreen, viewProgress) => ({ viewScreen, viewProgress })
);

export const ViewParallax = ({ screenFiles }: ScreenProps) => {
  const [ref, { height, width }] = useElementSize();
  const { viewScreen, viewProgress } = useSelector(stateSelector);
  const { images } = viewScreen;
  const rootImg = screenFiles.images?.[0];

  const animationType = viewScreen.animationType;

  const horizontal = useMemo(
    () =>
      animationType === "FROM_LEFT_TO_RIGHT" ||
      animationType === "FROM_RIGHT_TO_LEFT",
    [animationType]
  );

  const scale = useMemo(
    () =>
      animationType === "FROM_BOTTOM" || animationType === "FROM_RIGHT_TO_LEFT"
        ? -1
        : 1,
    [animationType]
  );

  const totalDistance = useMemo(
    () => (horizontal ? width : height) / 4,
    [height, horizontal, width]
  );

  const duration = useMemo(
    () => getScreenTime(viewScreen, { unit: "ms" }),
    [viewScreen]
  );

  const { offset } = useSpring({
    from: {
      offset: -1,
    },
    to: {
      offset: 1,
    },
    config: { duration, easing: easings.easeInOutSine },
    pause: !viewProgress.shouldIncrement,
  });

  return (
    <div
      ref={ref}
      className="h-full w-full flex justify-center items-center relative overflow-hidden"
    >
      {rootImg && (
        <img className="w-full h-full object-contain" src={rootImg} />
      )}

      {images?.slice(1).map((_value, index) => {
        const translateOffset = offset.to(
          (value) =>
            ((value * totalDistance) / images?.length ?? 1) *
            (index + 1) *
            scale
        );

        return (
          <animated.img
            key={index}
            className="absolute"
            style={{
              translateY: horizontal ? undefined : translateOffset,
              translateX: horizontal ? translateOffset : undefined,
            }}
            src={screenFiles.images?.[index]}
          />
        );
      })}
    </div>
  );
};
