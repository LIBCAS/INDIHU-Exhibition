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

// CSS
import "./timeline.scss";

// - - - - - -

// NOTE: When changed, it is also required to change border css styles inside 'timeline.scss'
const LINE_THICKNESS = 4;

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

export const ViewTimeline = () => {
  const { viewScreen } = useSelector(stateSelector);
  const { t } = useTranslation("view-screen", { keyPrefix: "timelineScreen" });

  const [parentRef, parentSize] = useResizeObserver();

  // - - - Derived variables - - -

  const timelineType = useMemo(
    () => viewScreen.timelineType ?? "HORIZONTAL",
    [viewScreen.timelineType]
  );

  const lineStyle = useMemo<CSSProperties>(
    () => ({
      position: "absolute",
      backgroundColor: "black",
      ...calculateLineSizing(timelineType, parentSize, LINE_THICKNESS),
      ...calculateLinePosition(timelineType),
      ...calculateLineTransformation(timelineType, parentSize),
      borderRadius: "9999px",
    }),
    [parentSize, timelineType]
  );

  const lineArrowClassName = useMemo(() => {
    if (timelineType === "VERTICAL") {
      return "timeline-line vertical";
    }
    // Also diagonals, for some reason, works well with horizontal arrow setup
    return "timeline-line horizontal";
  }, [timelineType]);

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
