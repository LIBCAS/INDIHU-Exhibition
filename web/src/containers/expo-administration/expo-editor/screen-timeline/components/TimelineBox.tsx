import { useRef, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";

import useItemLinearMovement from "../hooks/useItemLinearMovement/useItemLinearMovement";

// Components
import HelpIcon from "components/help-icon";

// Types
import { AppDispatch } from "store/store";
import { TimelineScreen, Size } from "models";
import { updateScreenData } from "actions/expoActions";
import { calculateItemInitialPosition } from "../hooks/useItemLinearMovement/linear-movement-utils";

import { FontIcon } from "react-md";
import { BasicTooltip } from "components/tooltip/BasicTooltip";
import { DEFAULT_TIMELINE_TYPE } from "../default-values";

// - - - - - -

type TimelineBoxProps = {
  activeScreen: TimelineScreen;
  title: string;
  helpIconLabel: string;
  helpIconId: string;
};

const TimelineBox = ({
  activeScreen,
  title,
  helpIconLabel,
  helpIconId,
}: TimelineBoxProps) => {
  return (
    <div className="flex">
      <div className="flex flex-col">
        <div>{title}</div>
        <TimelineContainer activeScreen={activeScreen} />
      </div>

      <HelpIcon label={helpIconLabel} id={helpIconId} />
    </div>
  );
};

export default TimelineBox;

// - - - - - -

export const TIMELINE_CONTAINER_SIZE: Size = { width: 400, height: 400 };
export const TIMELINE_ITEM_SIZE: Size = { width: 24, height: 24 };

// - - - - - -

type TimelineContainerProps = {
  activeScreen: TimelineScreen;
};

const TimelineContainer = ({ activeScreen }: TimelineContainerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const containerRef = useRef<HTMLDivElement | null>(null);

  // - - - Derived variables - - -

  const timelineType = useMemo(
    () => activeScreen.timelineType ?? DEFAULT_TIMELINE_TYPE,
    [activeScreen.timelineType]
  );

  const infopoints = useMemo(
    () => activeScreen.infopoints ?? [],
    [activeScreen.infopoints]
  );

  // - - - Item Linear Movement Hook - - -

  const handleItemUpdateAtPosition = useCallback(
    (itemKey: number, newLeft: number, newTop: number) => {
      dispatch(
        updateScreenData({
          infopoints: infopoints.map((ip, ipIndex) =>
            ipIndex === itemKey ? { ...ip, left: newLeft, top: newTop } : ip
          ),
        })
      );
    },
    [infopoints, dispatch]
  );

  const handleItemResets = useCallback(() => {
    dispatch(
      updateScreenData({
        infopoints: infopoints.map((ip, ipIdx) => ({
          ...ip,
          ...calculateItemInitialPosition(
            TIMELINE_CONTAINER_SIZE,
            TIMELINE_ITEM_SIZE,
            ipIdx,
            timelineType
          ),
        })),
      })
    );
  }, [infopoints, timelineType, dispatch]);

  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    containerStyle,
    lineStyle,
    itemStyle,
  } = useItemLinearMovement({
    containerRef: containerRef,
    containerSize: TIMELINE_CONTAINER_SIZE,
    itemSize: TIMELINE_ITEM_SIZE,
    items: infopoints,
    timelineType: timelineType,
    handleItemUpdateAtPosition: handleItemUpdateAtPosition,
    handleItemsReset: handleItemResets,
  });

  // - - - GUI - - -

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className="border-solid border-black border-[2px]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* --- Drag line --- */}
      <div style={lineStyle} />

      {/* --- Drag items --- */}
      {infopoints.map((infopoint, idx) => (
        <div
          key={idx}
          className="flex justify-center items-center"
          style={itemStyle(idx)}
          onMouseDown={(e) => handleMouseDown(e, idx)}
          data-tooltip-id={`screen-timeline-infopoint-${idx}`}
        >
          <FontIcon style={{ color: "#3366CC" }}>help</FontIcon>
          <BasicTooltip
            id={`screen-timeline-infopoint-${idx}`}
            content={
              infopoint.bodyContentType === "IMAGE"
                ? infopoint.imageFile?.name ?? "Neuveden název obrázku"
                : infopoint.bodyContentType === "VIDEO"
                ? infopoint.videoFile?.name ?? "Neuveden název videa"
                : infopoint.header ?? infopoint.text ?? "Neuvedeno"
            }
            variant="dark"
          />
        </div>
      ))}
    </div>
  );
};
