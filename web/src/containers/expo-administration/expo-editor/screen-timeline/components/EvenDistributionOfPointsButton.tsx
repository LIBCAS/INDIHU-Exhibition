import { updateScreenData } from "actions/expoActions";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store/store";
import { TIMELINE_CONTAINER_SIZE, TIMELINE_ITEM_SIZE } from "./TimelineBox";
import { TimelineScreen } from "models";
import { calculateItemEvenDistributionPosition } from "../hooks/useItemLinearMovement/linear-movement-utils";
import ReactMdButton from "react-md/lib/Buttons/Button";

// - - - - - -

type EvenDistributionOfPointsButtonProps = {
  activeScreen: TimelineScreen;
};

const EvenDistributionOfPointsButton = ({
  activeScreen,
}: EvenDistributionOfPointsButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // - - - Derived variables - - -

  const timelineType = useMemo(
    () => activeScreen.timelineType ?? "HORIZONTAL",
    [activeScreen.timelineType]
  );

  const infopoints = useMemo(
    () => activeScreen.infopoints ?? [],
    [activeScreen.infopoints]
  );

  // - - - Callbacks - - -

  const handleItemEvenDistribution = useCallback(() => {
    dispatch(
      updateScreenData({
        infopoints: infopoints.map((ip, ipIdx) => ({
          ...ip,
          ...calculateItemEvenDistributionPosition(
            TIMELINE_CONTAINER_SIZE,
            TIMELINE_ITEM_SIZE,
            ipIdx,
            timelineType,
            infopoints.length
          ),
        })),
      })
    );
  }, [infopoints, timelineType, dispatch]);

  // - - - GUI - - -

  return (
    <ReactMdButton
      raised
      label="Rovnomerne rozdeliť body na časovej ose"
      onClick={handleItemEvenDistribution}
    />
  );
};

export default EvenDistributionOfPointsButton;
