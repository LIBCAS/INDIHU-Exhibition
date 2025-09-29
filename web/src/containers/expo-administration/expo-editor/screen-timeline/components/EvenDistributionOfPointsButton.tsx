import { useCallback, useMemo } from "react";

// Hooks
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import ReactMdButton from "react-md/lib/Buttons/Button";

// Types
import { AppDispatch } from "store/store";
import { TimelineScreen } from "models";

// Actions
import { updateScreenData } from "actions/expoActions";

// Utils
import { TIMELINE_CONTAINER_SIZE, TIMELINE_ITEM_SIZE } from "./TimelineBox";
import { calculateItemEvenDistributionPosition } from "../hooks/useItemLinearMovement/linear-movement-utils";
import { DEFAULT_TIMELINE_TYPE } from "../default-values";

// - - - - - -

type EvenDistributionOfPointsButtonProps = {
  activeScreen: TimelineScreen;
};

const EvenDistributionOfPointsButton = ({
  activeScreen,
}: EvenDistributionOfPointsButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.timelineScreen",
  });

  // - - - Derived variables - - -

  const timelineType = useMemo(
    () => activeScreen.timelineType ?? DEFAULT_TIMELINE_TYPE,
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
      label={t("evenDistributionOfPointsBtnLabel")}
      onClick={handleItemEvenDistribution}
    />
  );
};

export default EvenDistributionOfPointsButton;
