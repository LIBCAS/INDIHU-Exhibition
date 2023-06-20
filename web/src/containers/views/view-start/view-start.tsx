import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { useTranslation } from "react-i18next";

import { createSelector } from "reselect";

import Paper from "react-md/lib/Papers/Paper";

import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";
import { useBoolean } from "hooks/boolean-hook";
import { useExpoNavigation } from "../hooks/expo-navigation-hook";
import { useViewStartAnimation } from "./view-start-animation-hook";

import { ViewStartDetail } from "./view-start-detail";
import { ViewStartInfo } from "./view-start-info";

import { breakpoints } from "hooks/media-query-hook/breakpoints";

import { AppDispatch, AppState } from "store/store";
import { StartScreen } from "models";
import { ScreenProps } from "models";

import { setViewProgress } from "actions/expoActions/viewer-actions";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as StartScreen,
  (viewScreen) => ({ viewScreen })
);

export const ViewStart = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const animationProps = useViewStartAnimation(viewScreen?.animationType);
  const animationStyles = useSpring(animationProps);

  const isSmall = useMediaQuery(breakpoints.down("lg"));
  const { t } = useTranslation("exhibition");
  const { navigateForward } = useExpoNavigation();

  const [infoOpen, { toggle: toggleInfo }] = useBoolean(false); // toggling ViewStartInfo Component
  const [detailsOpen, { toggle: toggleDetails }] = useBoolean(false); // toggling ViewStartDetail Component

  const { image } = screenPreloadedFiles ?? {};

  const handleStart = useCallback(async () => {
    await dispatch(setViewProgress({ shouldIncrement: true }));
    navigateForward();
  }, [dispatch, navigateForward]);

  const { infoHeight } = useSpring({
    infoHeight: infoOpen ? "50%" : "0%", // 75% previous
    config: { duration: 250 },
  });

  const { detailsHeight } = useSpring({
    detailsHeight: detailsOpen ? "50%" : "0%", // 75% previous
    config: { duration: 250 },
  });

  // StartButton as component
  const startButton = (
    <button
      className="h-full lg:h-32 w-32 ml-auto border-x-4 border-t-4 lg:border-b-4 border-white p-6 text-bold text-lg bg-primary cursor-pointer mb-4 text-white"
      onClick={handleStart}
    >
      {t("start")}
    </button>
  );

  return (
    <>
      {/* 1) Background image */}
      <div className="h-full w-full">
        <animated.div
          className="flex justify-center items-center h-full w-full"
          style={animationStyles}
        >
          {image && (
            <img
              className="h-full w-full object-contain"
              src={image}
              alt="background"
            />
          )}
        </animated.div>
      </div>

      {/* 2) Flex 2 Items (Info and Perex) Overlay above the background image */}
      <div className="fixed top-0 left-0 h-full w-full flex px-4 pt-4 gap-4">
        {/* Small (less than "lg") layout - only info and next start button */}
        {isSmall ? (
          <Section>
            <div />
            <div className="flex justify-self-end gap-4">
              <Paper zDepth={3} className="h-full flex-1 bg-white p-4">
                <ViewStartInfo isOpen={infoOpen} toggle={toggleInfo} />
              </Paper>
              {startButton}
            </div>
          </Section>
        ) : (
          <>
            {/* Bigger layout - info and perex + start button above */}
            <Section>
              <div className="h-36" />
              <animated.div style={{ height: infoHeight, minHeight: "12rem" }}>
                <Paper zDepth={3} className="h-full bg-white p-4">
                  <ViewStartInfo isOpen={infoOpen} toggle={toggleInfo} />
                </Paper>
              </animated.div>
            </Section>
            <Section>
              {startButton}
              <animated.div
                className="flex flex-col"
                style={{ height: detailsHeight, minHeight: "12rem" }}
              >
                <Paper zDepth={3} className="h-full bg-white p-4 flex-1">
                  <ViewStartDetail
                    isOpen={detailsOpen}
                    toggle={toggleDetails}
                  />
                </Paper>
              </animated.div>
            </Section>
          </>
        )}
      </div>
    </>
  );
};

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 flex flex-col justify-end">{children}</div>
);
