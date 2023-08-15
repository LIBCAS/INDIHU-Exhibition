import { RefObject, useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useTranslation } from "react-i18next";
import { useExpoScreenProgress } from "hooks/view-hooks/expo-screen-progress-hook";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import { ProgressBar } from "components/progress-bar/progress-bar";
import { Icon } from "components/icon/icon";

import { AppState } from "store/store";
import { RefCallback } from "context/tutorial-provider/use-tutorial";
import { TutorialStep } from "context/tutorial-provider/tutorial-provider";

import classes from "../view-screen-overlay.module.scss";
import cx from "classnames";
import { isGameScreen } from "utils/view-utils";
import { tickTime } from "constants/view-screen-progress";
import { screenType } from "enums/screen-type";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen,
  (viewScreen) => ({ viewScreen })
);

type InfoPanelProps = {
  toolbarRef: RefObject<HTMLDivElement>;
  openDrawer: () => void;
  keyKey: number;
  bind: (stepKey: string) => { ref: RefCallback };
  isTutorialOpen: boolean;
  isAnyTutorialOpened: boolean;
  step: TutorialStep | null;
};

const InfoPanel = ({
  toolbarRef,
  openDrawer,
  keyKey,
  bind,
  isTutorialOpen,
  isAnyTutorialOpened,
  step,
}: InfoPanelProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const { t } = useTranslation(["screen", "tutorial"]);

  const { percentage } = useExpoScreenProgress({ offsetTotalTime: -tickTime });
  const { bgFgTheming } = useExpoDesignData();

  const amIGameScreen = useMemo(
    () => isGameScreen(viewScreen?.type),
    [viewScreen?.type]
  );

  const isVideoOrSlideshowScreen = useMemo(() => {
    return (
      viewScreen?.type === "VIDEO" || viewScreen?.type === screenType.SLIDESHOW
    );
  }, [viewScreen?.type]);

  return (
    <div
      className={cx(
        classes.info, // info in the grid
        "flex h-full items-end p-3 gap-2 justify-start"
      )}
      ref={toolbarRef}
    >
      {!amIGameScreen && (
        <div
          {...bind("info")}
          className={cx(
            isAnyTutorialOpened &&
              (!isTutorialOpen ||
                (step?.stepKey !== "info" &&
                  step?.stepKey !== "progressbar")) &&
              "bg-black opacity-40"
          )}
        >
          <div className="flex flex-col bg-white pointer-events-auto">
            <div
              {...bind("progressbar")}
              className={cx(
                isAnyTutorialOpened &&
                  (!isTutorialOpen || step?.stepKey !== "progressbar") &&
                  "bg-black opacity-40"
              )}
            >
              <ProgressBar
                key={`${viewScreen?.id}-${keyKey}`}
                height={isVideoOrSlideshowScreen ? 10 : 6}
                percentage={percentage}
                color={isVideoOrSlideshowScreen ? "secondary" : "primary"}
              />
            </div>

            <div
              className={cx(
                "flex justify-between gap-4 p-4 cursor-pointer min-w-[300px]",
                {
                  ...bgFgTheming,
                }
              )}
              onClick={openDrawer}
            >
              <span>{viewScreen?.title ?? t("no-title")}</span>
              <Icon name="info" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
