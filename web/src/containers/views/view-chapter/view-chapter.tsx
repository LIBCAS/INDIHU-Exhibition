import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useSpring, animated } from "react-spring";

import { IntroScreen } from "models";
import { AppState } from "store/store";
import { ScreenProps } from "models";

import { getViewImageAnimation } from "../view-image/view-image-animation";
import { getScreenTime } from "utils/screen";
import cx from "classnames";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as IntroScreen,
  ({ expo }: AppState) => expo.viewProgress.shouldIncrement,
  (viewScreen, shouldIncrement) => ({ viewScreen, shouldIncrement })
);

export const ViewChapter = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen, shouldIncrement } = useSelector(stateSelector);
  const { image } = screenPreloadedFiles;
  const { title, subTitle, animateText } = viewScreen;

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

  const animation = useMemo(
    () => getViewImageAnimation(viewScreen.animationType),
    [viewScreen.animationType]
  );

  const duration = useMemo(
    () => getScreenTime(viewScreen, { unit: "ms" }),
    [viewScreen]
  );

  const { scale, translateX, translateY } = useSpring({
    ...animation,
    config: {
      duration,
    },
    pause: !shouldIncrement,
  });

  const { y, opacity } = useSpring({
    from: { y: -30, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: { duration: 2000 },
    pause: !shouldIncrement,
  });

  const { horizontal: horizontal = "CENTER", vertical: vertical = "CENTER" } =
    viewScreen?.textPosition ?? {};

  return (
    <div className="w-full h-full">
      {image && (
        <animated.img
          className="w-full h-full object-contain"
          style={{ scale, translateX, translateY }}
          src={image}
          alt="background"
        />
      )}
      <div
        className={cx(
          "flex text-white fixed top-0 left-0 w-full h-full px-24 md:px-32 pt-24 md:pt-32 pb-36 md:pb-52 ",
          {
            "items-center": vertical === "CENTER",
            "items-end": vertical === "BOTTOM",
          }
        )}
      >
        <animated.div
          className="w-full"
          style={animateText ? { y, opacity } : {}}
        >
          <h1
            className={cx("m-0 font-bold text-4xl md:text-7xl", {
              "text-center": horizontal === "CENTER",
              "text-right": horizontal === "RIGHT",
              "text-slate-200":
                viewScreen.introTextTheme === "light" ||
                !viewScreen.introTextTheme,
              "text-neutral-800": viewScreen.introTextTheme === "dark",
            })}
            style={
              shadowColor
                ? {
                    textShadow: `3px 3px 3px ${shadowColor}`,
                  }
                : undefined
            }
          >
            {title}
          </h1>
          <h2
            className={cx("text-white m-0 text-2xl md:text-3xl font-semibold", {
              "text-center": horizontal === "CENTER",
              "text-right": horizontal === "RIGHT",
              "text-slate-200":
                viewScreen.introTextTheme === "light" ||
                !viewScreen.introTextTheme,
              "text-neutral-800": viewScreen.introTextTheme === "dark",
            })}
            style={
              shadowColor
                ? {
                    textShadow: `3px 3px 3px ${shadowColor}`,
                  }
                : undefined
            }
          >
            {subTitle}
          </h2>
        </animated.div>
      </div>
    </div>
  );
};
