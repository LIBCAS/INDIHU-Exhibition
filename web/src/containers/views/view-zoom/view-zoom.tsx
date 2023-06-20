import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { animated, easings, useSpring, useTransition } from "react-spring";

import { ZoomScreen } from "models";
import { AppState } from "store/store";
import { calculateObjectFit } from "utils/object-fit";
import useElementSize from "hooks/element-size-hook";

import { ScreenProps } from "models";

const delayTime = 2000;

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as ZoomScreen,
  ({ expo }: AppState) => expo.viewProgress,
  (viewScreen, viewProgress) => ({ viewScreen, viewProgress })
);

export const ViewZoom = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen, viewProgress } = useSelector(stateSelector);
  const [ref, containerSize] = useElementSize();
  const animations = viewScreen.sequences;
  const [animation, setAnimation] = useState<
    typeof animations[number] | undefined
  >(undefined);
  const { image } = screenPreloadedFiles;

  const { height, width } = useMemo(
    () =>
      calculateObjectFit({
        type: "contain",
        parent: containerSize,
        child: viewScreen?.imageOrigData ?? { height: 0, width: 0 },
      }),
    [containerSize, viewScreen?.imageOrigData]
  );

  const [heightRatio, widthRatio] = useMemo(
    () => [
      height / (viewScreen.imageOrigData?.height ?? 1),
      width / (viewScreen.imageOrigData?.width ?? 1),
    ],
    [
      height,
      viewScreen.imageOrigData?.height,
      viewScreen.imageOrigData?.width,
      width,
    ]
  );

  const [{ zoom, translate }, api] = useSpring(() => ({
    zoom: 1,
    translate: 1,
  }));

  useEffect(() => {
    if (!viewProgress.shouldIncrement) {
      api.pause();
      return;
    }

    api.resume();
  }, [api, viewProgress.shouldIncrement]);

  useEffect(() => {
    animations.reduce((delay, animation) => {
      const duration = (animation.time ?? 2) * 2 * 1000 + delayTime;
      api.start({
        from: { zoom: 0, translate: 0 },
        to: { zoom: 1, translate: 1 },
        delay,
        config: { duration, easing: easings.easeInOutQuad },
        onStart: () => setAnimation(animation),
      });

      return delay + duration + delayTime;
    }, delayTime);
  }, [animations, api]);

  const tooltipPosition = viewScreen.tooltipPosition;

  const onRight = useMemo(
    () => tooltipPosition === "TOP_RIGHT",
    [tooltipPosition]
  );

  const infoTransition = useTransition(animation, {
    from: { opacity: 0, translateX: onRight ? 15 : -15 },
    enter: { opacity: 1, translateX: 0, delay: 250 },
    leave: { opacity: 0, translateX: onRight ? 15 : -15 },
  });

  const tooltipStyle = useMemo(
    () => ({
      top: 20,
      ...(onRight ? { right: 20 } : { left: 20 }),
    }),
    [onRight]
  );

  return (
    <div
      ref={ref}
      className="w-full h-full flex justify-center items-center overflow-hidden"
    >
      {image && (
        <animated.img
          className="w-full h-full object-contain"
          src={image}
          style={
            animation
              ? {
                  scale: zoom
                    .to([0, 0.35, 0.65, 1], [0, 1, 1, 0])
                    .to((x) => Math.log2(x + 1))
                    .to([0, 1], [1, animation.zoom]),
                  translateX: translate
                    .to([0, 0.35, 0.65, 1], [0, 1, 1, 0])
                    .to(easings.easeOutQuad)
                    .to([0, 1], [0, width / 2 - animation.left * widthRatio]),
                  translateY: translate
                    .to([0, 0.35, 0.65, 1], [0, 1, 1, 0])
                    .to(easings.easeOutQuad)
                    .to([0, 1], [0, height / 2 - animation.top * heightRatio]),
                }
              : undefined
          }
        />
      )}

      {infoTransition(
        ({ opacity, translateX }, animation) =>
          animation && (
            <animated.div
              style={{ opacity, translateX, ...tooltipStyle }}
              className="fixed p-4 text-black bg-white shadow-md"
            >
              {animation.text}
            </animated.div>
          )
      )}
    </div>
  );
};
