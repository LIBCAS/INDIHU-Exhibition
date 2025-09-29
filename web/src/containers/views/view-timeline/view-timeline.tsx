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
import { TimelineScreen } from "models";
import { Infopoint, Size } from "models";

// Utils
import { TIMELINE_CONTAINER_SIZE } from "containers/expo-administration/expo-editor/screen-timeline/components/TimelineBox";
import {
  calculateLinePosition,
  calculateLineSizing,
  calculateLineTransformation,
} from "containers/expo-administration/expo-editor/screen-timeline/hooks/useItemLinearMovement/linear-movement-utils";
import {
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

const calculateInfopointsPosition = (
  infopoints: Infopoint[] | undefined,
  parentSize: Size
) => {
  const adjustedInfopoints = infopoints?.map<Infopoint>((ip) => {
    const wPercentage = ip.left / TIMELINE_CONTAINER_SIZE.width;
    const hPercentage = ip.top / TIMELINE_CONTAINER_SIZE.height;

    const adjustedLeft = wPercentage * parentSize.width;
    const adjustedTop = hPercentage * parentSize.height;

    return {
      ...ip,
      left: adjustedLeft,
      top: adjustedTop,
    };
  });

  return adjustedInfopoints ?? [];
};

// - - - - - -

const calculateArrowThickness = (thickness: number, returnBig: boolean) => {
  if (thickness <= 1) {
    const finalThickness = 1;
    const big = finalThickness * 6;
    const small = finalThickness * 6;
    const toReturn = returnBig ? big : small;
    return toReturn;
  }

  const big = thickness * 6;
  const small = (thickness - 1) * 6;
  const toReturn = returnBig ? big : small;
  return toReturn;
};

// - - - - - -

export const ViewTimeline = () => {
  const { viewScreen } = useSelector(stateSelector);
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

  const { arrowThicknessBig, arrowThicknessSmal } = useMemo(
    () => ({
      arrowThicknessBig: calculateArrowThickness(timelineThickness, true),
      arrowThicknessSmal: calculateArrowThickness(timelineThickness, false),
    }),
    [timelineThickness]
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
      // NOTE: for the scss styles (dot and arrow od the straight line)
      "--timeline-color": timelineColor,
      "--timeline-thickness-lg": `${arrowThicknessBig}px`,
      "--timeline-thickness-sm": `${arrowThicknessSmal}px`,
    }),
    [
      parentSize,
      timelineType,
      timelineColor,
      timelineThickness,
      arrowThicknessBig,
      arrowThicknessSmal,
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
  );
};
