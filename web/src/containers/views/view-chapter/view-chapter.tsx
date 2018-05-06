import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useSpring, animated } from "react-spring";
import { useGlassMagnifier } from "hooks/view-hooks/glass-magnifier-hook/useGlassMagnifier";

import { IntroScreen } from "models";
import { AppState } from "store/store";
import { ScreenProps } from "models";

import { getViewImageAnimation } from "../view-image/view-image-animation";
import { getScreenTime } from "utils/screen";
import cx from "classnames";

// - - - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as IntroScreen,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (viewScreen, shouldIncrement) => ({ viewScreen, shouldIncrement })
);

export const ViewChapter = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen, shouldIncrement } = useSelector(stateSelector);
  const { title, subTitle, animateText } = viewScreen;
  const { image } = screenPreloadedFiles;

  const { horizontal = "CENTER", vertical = "CENTER" } =
    viewScreen?.textPosition ?? {};

  const animation = useMemo(
    () => getViewImageAnimation(viewScreen.animationType),
    [viewScreen.animationType]
  );

  const duration = useMemo(
    () => getScreenTime(viewScreen, { unit: "ms" }),
    [viewScreen]
  );

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const containedImgRef = useRef<HTMLImageElement | null>(null);

  const { GlassMagnifier } = useGlassMagnifier(
    imageContainerRef.current,
    containedImgRef.current
  );

  const shadowColor = useMemo(() => {
    const textColor = viewScreen.introTextTheme ?? "light";
    const isTextEffectOn = viewScreen.isIntroTextHaloEffectOn ?? "off";
    if (isTextEffectOn === "off") {
      return null;
    }
    // TextEffect is ON here!
    if (textColor === "light") {
      return "black";
    }
    // TextColor is dark.. so return opposite white color of shadow
    return "white";
  }, [viewScreen.introTextTheme, viewScreen.isIntroTextHaloEffectOn]);

  // - - Animation springs - -
  // image animation
  const { scale, translateX, translateY } = useSpring({
    ...animation,
    config: {
      duration,
    },
    pause: !shouldIncrement,
  });

  // text animation
  const { y, opacity } = useSpring({
    from: { y: -30, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: { duration: 2000 },
    pause: !shouldIncrement,
  });

  return (
    <div className="w-full h-full" ref={imageContainerRef}>
      {image && (
        <animated.img
          className="w-full h-full object-contain"
          style={{ scale, translateX, translateY }}
          src={image}
          alt="background"
          ref={containedImgRef}
        />
      )}

      <div
        className={cx(
          "flex text-white fixed top-0 left-0 w-full h-full px-16 md:px-32 pt-24 pb-40 md:pt-32 md:pb-52",
          {
            "lg:pl-[7.5%]": horizontal === "LEFT",
            "lg:pr-[42.5%]": horizontal === "LEFT",
            "lg:pl-[25%]": horizontal === "CENTER",
            "lg:pr-[25%]": horizontal === "CENTER",
            "lg:pl-[42.5%]": horizontal === "RIGHT",
            "lg:pr-[7.5%]": horizontal === "RIGHT",

            "items-center": vertical === "CENTER",
            "items-end": vertical === "BOTTOM",
          }
        )}
      >
        <animated.div
          className={cx("w-full", {
            "text-slate-200":
              viewScreen.introTextTheme === "light" ||
              !viewScreen.introTextTheme,
            "text-neutral-800": viewScreen.introTextTheme === "dark",
          })}
          style={animateText ? { y, opacity } : {}}
        >
          <h1
            className={cx("text-inherit m-0 font-bold text-4xl md:text-7xl", {
              "text-start": horizontal === "LEFT",
              "text-center": horizontal === "CENTER",
              "text-right": horizontal === "RIGHT",
            })}
            style={
              shadowColor
                ? {
                    textShadow: `2px 2px 4px ${shadowColor}, -2px -2px 4px ${shadowColor}`,
                    // textShadow: `-1px 0 ${shadowColor}, 0 1px ${shadowColor}, 1px 0 ${shadowColor}, 0 -1px ${shadowColor}`,
                  }
                : undefined
            }
          >
            {title}
          </h1>
          <h2
            className={cx(
              "text-inherit m-0 text-2xl md:text-3xl font-semibold",
              {
                "text-start": horizontal === "LEFT",
                "text-center": horizontal === "CENTER",
                "text-right": horizontal === "RIGHT",
              }
            )}
            style={
              shadowColor
                ? {
                    textShadow: `1px 1px 2px ${shadowColor}, -1px -1px 2px ${shadowColor}`,
                    // textShadow: `-1px 0 ${shadowColor}, 0 1px ${shadowColor}, 1px 0 ${shadowColor}, 0 -1px ${shadowColor}`,
                  }
                : undefined
            }
          >
            {subTitle}
          </h2>
        </animated.div>
      </div>

      {image && <GlassMagnifier />}
    </div>
  );
};
