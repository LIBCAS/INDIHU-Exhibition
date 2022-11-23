import { useCallback } from "react";
import Paper from "react-md/lib/Papers/Paper";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { animated, useSpring } from "react-spring";
import { useTranslation } from "react-i18next";

import { breakpoints } from "hooks/media-query-hook/breakpoints";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";
import { AppDispatch, AppState } from "store/store";
import { setViewProgress } from "actions/expoActions/viewer-actions";
import { StartScreen } from "models";

import { ViewStartDetail } from "./view-start-detail";
import { ViewStartInfo } from "./view-start-info";
import { useViewStartAnimation } from "./view-start-animation-hook";
import { ScreenProps } from "../types";
import { useBoolean } from "hooks/boolean-hook";
import { useExpoNavigation } from "../hooks/expo-navigation-hook";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as StartScreen,
  (viewScreen) => ({ viewScreen })
);

export const ViewStart = ({ screenFiles }: ScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { viewScreen } = useSelector(stateSelector);
  const isSmall = useMediaQuery(breakpoints.down("lg"));
  const animationProps = useViewStartAnimation(viewScreen?.animationType);
  const animationStyles = useSpring(animationProps);
  const { image } = screenFiles ?? {};
  const { t } = useTranslation("exposition");
  const [infoOpen, { toggle: toggleInfo }] = useBoolean(false);
  const [detailsOpen, { toggle: toggleDetails }] = useBoolean(false);
  const { navigateForward } = useExpoNavigation();

  const handleStart = useCallback(async () => {
    await dispatch(setViewProgress({ shouldIncrement: true }));
    navigateForward();
  }, [dispatch, navigateForward]);

  const { infoHeight } = useSpring({
    infoHeight: infoOpen ? "75%" : "0%",
    config: { duration: 250 },
  });

  const { detailsHeight } = useSpring({
    detailsHeight: detailsOpen ? "75%" : "0%",
    config: { duration: 250 },
  });

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
      <div className="fixed top-0 left-0 h-full w-full flex px-4 pt-4 gap-4">
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
