import React, { CSSProperties, useCallback, useEffect } from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

// Hooks
import useResizeObserver from "hooks/use-resize-observer";
import useTooltipInfopoint from "components/infopoint/useTooltipInfopoint";

// Types
import { AppState } from "store/store";
import { ScreenProps, TimelineScreen } from "models";

// Utils
import {
  calculateLinePosition,
  calculateLineSizing,
  calculateLineTransformation,
} from "containers/expo-administration/expo-editor/screen-timeline/hooks/useItemLinearMovement/linear-movement-utils";
import {
  calculateArrowThickness,
  calculateInfopointsPosition,
} from "./view-timeline-utils";
import {
  DEFAULT_TIMELINE_BG_TRANSPARENCY,
  DEFAULT_TIMELINE_COLOR,
  DEFAULT_TIMELINE_THICKNESS,
  DEFAULT_TIMELINE_TYPE,
} from "containers/expo-administration/expo-editor/screen-timeline/default-values";

// CSS
import "./timeline.scss";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as TimelineScreen,
  (viewScreen) => ({ viewScreen })
);

// - - - - - -

export const ViewTimeline = ({ screenPreloadedFiles }: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const { backgroundImage } = screenPreloadedFiles;
  const { t } = useTranslation("view-screen", { keyPrefix: "timelineScreen" });

  const [parentRef, parentSize] = useResizeObserver();

  // - - - Derived variables (settings ) - - -

  const timelineType = useMemo(
    () => viewScreen.timelineType ?? DEFAULT_TIMELINE_TYPE,
    [viewScreen.timelineType]
  );

  const timelineColor = useMemo(
    () => viewScreen.timelineColor ?? DEFAULT_TIMELINE_COLOR,
    [viewScreen.timelineColor]
  );

  const timelineThickness = useMemo(
    () => viewScreen.timelineThickness ?? DEFAULT_TIMELINE_THICKNESS,
    [viewScreen.timelineThickness]
  );

  const { arrowThicknessBig, arrowThicknessSmall } = useMemo(
    () => ({
      arrowThicknessBig: calculateArrowThickness(timelineThickness, true),
      arrowThicknessSmall: calculateArrowThickness(timelineThickness, false),
    }),
    [timelineThickness]
  );

  const bgImageTransparency = useMemo(
    () =>
      (viewScreen.backgroundImageTransparency ??
        DEFAULT_TIMELINE_BG_TRANSPARENCY) / 100,
    [viewScreen.backgroundImageTransparency]
  );

  // - - - Derived variables (styles) - - -

  const lineStyle = useMemo<CSSProperties>(
    () => ({
      position: "absolute",
      ...calculateLineSizing(timelineType, parentSize, timelineThickness),
      ...calculateLinePosition(timelineType),
      ...calculateLineTransformation(timelineType, parentSize),
      borderRadius: "9999px",
      backgroundColor: timelineColor,
      // NOTE: for the scss styles (dot and arrow of the straight line)
      "--timeline-color": timelineColor,
      "--timeline-thickness-lg": `${arrowThicknessBig}px`,
      "--timeline-thickness-sm": `${arrowThicknessSmall}px`,
    }),
    [
      parentSize,
      timelineType,
      timelineColor,
      timelineThickness,
      arrowThicknessBig,
      arrowThicknessSmall,
    ]
  );

  const lineArrowClassName = useMemo(() => {
    if (timelineType === "VERTICAL") {
      return "timeline-line vertical";
    }
    // NOTE: Also diagonals, for some reason, works well with horizontal arrow setup
    return "timeline-line horizontal";
  }, [timelineType]);

  // - - - Derived variables (others) - - -

  const adjustedInfopoints = useMemo(
    () => calculateInfopointsPosition(viewScreen.infopoints, parentSize),
    [viewScreen.infopoints, parentSize]
  );

  // - - - Infopoints - - -

  const {
    infopointStatusMap,
    setInfopointStatusMap,
    closeInfopoints,
    AnchorInfopoint,
    TooltipInfoPoint,
  } = useTooltipInfopoint(viewScreen);

  // - - - Close Infopoints - - -

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
    return () => document.removeEventListener("keydown", onKeyDownAction);
  }, [onKeyDownAction]);

  // - - - GUI - - -

  return (
    <div className="w-full h-full px-[5%] xl:px-[10%] py-[5%]">
      <div className="h-full flex flex-col justify-center items-center gap-8 md:gap-12">
        {/* 1. Title */}
        <div className="w-full text-center text-white font-bold text-2xl md:text-3xl mt-4 md:mt-0">
          {viewScreen.timelineName ?? t("missingTimelineName")}
        </div>

        {/* 2. Timeline */}
        <div className="relative w-full h-full">
          {backgroundImage && (
            <img
              src={backgroundImage}
              className="absolute left-0 top-0 w-full h-full object-cover"
              style={{ opacity: bgImageTransparency }}
            />
          )}

          <div className="w-full h-full p-[12.5%] xl:p-[5%]">
            <div
              ref={parentRef}
              className="relative w-full h-full flex justify-center items-center"
            >
              {/* 2a) Timeline line */}
              <div style={lineStyle} className={lineArrowClassName} />

              {/* 2b) Timeline Points */}
              {adjustedInfopoints.map((ip, ipIdx) => (
                <React.Fragment key={`infopoint-tooltip-${ipIdx}`}>
                  <AnchorInfopoint
                    id={`infopoint-tooltip-${ipIdx}`}
                    left={ip.left}
                    top={ip.top}
                    infopoint={ip}
                  />
                  <TooltipInfoPoint
                    key={`infopoint-tooltip-${ipIdx}`}
                    id={`infopoint-tooltip-${ipIdx}`}
                    infopoint={ip}
                    infopointStatusMap={infopointStatusMap}
                    setInfopointStatusMap={setInfopointStatusMap}
                    primaryKey={ipIdx.toString()}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
