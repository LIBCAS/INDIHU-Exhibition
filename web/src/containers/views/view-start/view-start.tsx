import { CSSProperties, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { useTranslation } from "react-i18next";
import { createSelector } from "reselect";

import useElementSize from "hooks/element-size-hook";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";
import { useBoolean } from "hooks/boolean-hook";
import { useExpoNavigation } from "hooks/view-hooks/expo-navigation-hook";
import { useViewStartAnimation } from "./view-start-animation-hook";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

// Components
import Paper from "react-md/lib/Papers/Paper";
import { ViewStartInfo } from "./view-start-info";
import { ViewStartDetail } from "./view-start-detail";

// Models
import { AppDispatch, AppState } from "store/store";
import { ViewExpo, StartScreen, ScreenProps } from "models";

// Utils and actions
import { DialogType } from "components/dialogs/dialog-types";
import { breakpoints } from "hooks/media-query-hook/breakpoints";
import { setViewProgress } from "actions/expoActions/viewer-actions";
import { setDialog } from "actions/dialog-actions";
import cx from "classnames";
import { calculateObjectFit } from "utils/object-fit";

// - - - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo as ViewExpo,
  ({ expo }: AppState) => expo.viewScreen as StartScreen,
  (viewExpo, viewScreen) => ({ viewExpo, viewScreen })
);

export const ViewStart = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewExpo, viewScreen } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const [screenContainerRef, screenContainerSize] = useElementSize();

  const { expoDesignData, bgTheming } = useExpoDesignData();

  const animationProps = useViewStartAnimation(viewScreen?.animationType);
  const animationStyles = useSpring(animationProps);

  const isSmall = useMediaQuery(breakpoints.down("lg"));
  const { navigateForward } = useExpoNavigation();

  const [infoOpen, { toggle: toggleInfo }] = useBoolean(false); // toggling ViewStartInfo Component (left one)
  const [detailsOpen, { toggle: toggleDetails }] = useBoolean(false); // toggling ViewStartDetail Component (right one)

  const { image } = screenPreloadedFiles ?? {}; // background image, if set

  // - -

  const imageOrigData = useMemo(() => {
    const imageOrigData = viewScreen.imageOrigData ?? { width: 0, height: 0 };
    return imageOrigData;
  }, [viewScreen.imageOrigData]);

  const {
    width: containedBgImageWidth,
    height: containedBgImageHeight,
    left: fromContainerToBgImageLeft,
    top: fromContainerToBgImageTop,
  } = useMemo(
    () =>
      calculateObjectFit({
        parent: screenContainerSize,
        child: imageOrigData,
        type: "contain",
      }),
    [imageOrigData, screenContainerSize]
  );

  // - -

  const { infoHeight } = useSpring({
    infoHeight: infoOpen ? "50%" : "0%", // 75% previous
    config: { duration: 250 },
  });

  const { detailsHeight } = useSpring({
    detailsHeight: detailsOpen ? "50%" : "0%", // 75% previous
    config: { duration: 250 },
  });

  // - -

  const handleStart = useCallback(async () => {
    await dispatch(setViewProgress({ shouldIncrement: true }));
    navigateForward();
  }, [dispatch, navigateForward]);

  const openMobileInfoDialog = useCallback(() => {
    dispatch(setDialog(DialogType.ExpoInfoDialog, { viewExpo, viewScreen }));
  }, [dispatch, viewExpo, viewScreen]);

  // - -

  const logoPositionStyles = useMemo<CSSProperties>(() => {
    if (!expoDesignData) {
      return {};
    }
    if (expoDesignData.logoPosition === "UPPER_LEFT") {
      return {
        left: `calc(${fromContainerToBgImageLeft}px + (${containedBgImageWidth}px / 12) )`,
        top: `calc(${fromContainerToBgImageTop}px + (${containedBgImageHeight}px / 12) )`,
      };
    }
    if (expoDesignData.logoPosition === "UPPER_RIGHT") {
      return {
        right: `calc(${fromContainerToBgImageLeft}px + (${containedBgImageWidth}px / 12) )`,
        top: `calc(${fromContainerToBgImageTop}px + (${containedBgImageHeight}px / 12) )`,
      };
    }
    if (expoDesignData.logoPosition === "LOWER_LEFT") {
      return {
        left: `calc(${fromContainerToBgImageLeft}px + (${containedBgImageWidth}px / 12) )`,
        bottom: `calc(${fromContainerToBgImageTop}px + (${containedBgImageHeight}px / 12) )`,
      };
    }
    return {};
  }, [
    expoDesignData,
    containedBgImageWidth,
    containedBgImageHeight,
    fromContainerToBgImageLeft,
    fromContainerToBgImageTop,
  ]);

  return (
    <>
      {/* a) Background image */}
      <div className="h-full w-full" ref={screenContainerRef}>
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

      {/* LOGO if set */}
      {expoDesignData &&
        expoDesignData.logoFile &&
        expoDesignData.logoType &&
        expoDesignData.logoPosition && (
          <div className="absolute left-0 top-0 w-full h-full">
            <img
              src={`/api/files/${expoDesignData.logoFile.fileId}`}
              alt="logo-image"
              className="absolute"
              style={{
                width: containedBgImageWidth / 4,
                opacity:
                  expoDesignData.logoType === "WATERMARK" ? 0.4 : undefined,
                // left: `calc(${fromContainerToBgImageLeft}px + (${containedBgImageWidth}px / 12) )`,
                // top: `calc(${fromContainerToBgImageTop}px + (${containedBgImageHeight}px / 12) )`,
                ...logoPositionStyles,
              }}
            />
          </div>
        )}

      {/* b) Flex container with 2 items, left Info panel, right Detail panel with start button (on top of bg image) */}
      <div className="fixed top-0 left-0 h-full w-full flex px-4 pt-4 gap-4">
        {/* b1) small screen under 1024px first - only  start button and info panel which opens dialog with chapters and files */}
        {isSmall ? (
          <Section>
            <div />
            <div className="flex justify-self-end gap-4">
              <Paper
                zDepth={3}
                className={cx("h-full flex-1 bg-white p-4 cursor-pointer", {
                  ...bgTheming,
                })}
                onClick={() => openMobileInfoDialog()}
              >
                <ViewStartInfo
                  isOpen={infoOpen}
                  toggle={toggleInfo}
                  openMobileInfoDialog={openMobileInfoDialog}
                  tags={viewExpo?.tags}
                />
              </Paper>
              <StartButton handleStart={handleStart} />
            </div>
          </Section>
        ) : (
          <>
            {/* b2) bigger screen, above 1024px, classic info panel, details panel and start button */}
            {/* Info panel */}
            <Section>
              <div className="h-36" />
              <animated.div style={{ height: infoHeight, minHeight: "13rem" }}>
                <Paper
                  zDepth={3}
                  className={cx("h-full bg-white p-4 cursor-pointer", {
                    ...bgTheming,
                  })}
                  onClick={() => toggleInfo()}
                >
                  <ViewStartInfo
                    isOpen={infoOpen}
                    toggle={toggleInfo}
                    openMobileInfoDialog={openMobileInfoDialog}
                    tags={viewExpo?.tags}
                  />
                </Paper>
              </animated.div>
            </Section>

            {/* Detail panel + Start button */}
            <Section>
              <StartButton handleStart={handleStart} />
              <animated.div
                className="flex flex-col"
                style={{ height: detailsHeight, minHeight: "13rem" }}
              >
                <Paper
                  zDepth={3}
                  className={cx("h-full bg-white p-4 flex-1 cursor-pointer", {
                    ...bgTheming,
                  })}
                  onClick={() => toggleDetails()}
                >
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

// - - - - - - - -

interface StartButtonProps {
  handleStart: () => Promise<void>;
}

const StartButton = ({ handleStart }: StartButtonProps) => {
  const { t } = useTranslation("exhibition");
  const { expoDesignData } = useExpoDesignData();

  return (
    <button
      className="h-full lg:h-32 w-32 ml-auto border-x-4 border-t-4 lg:border-b-4 border-white p-4 text-bold text-lg bg-primary cursor-pointer mb-4 text-white"
      style={{ backgroundColor: expoDesignData?.startButtonColor }}
      onClick={handleStart}
    >
      {t("start")}
    </button>
  );
};

// - - - - - - - -

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 flex flex-col justify-end">{children}</div>
);
