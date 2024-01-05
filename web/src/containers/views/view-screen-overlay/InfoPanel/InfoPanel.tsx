import { RefObject, useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useTranslation } from "react-i18next";
import { useExpoScreenProgress } from "hooks/view-hooks/expo-screen-progress-hook";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";

import { ProgressBar } from "components/progress-bar/progress-bar";
import { Icon } from "components/icon/icon";

import { AppState } from "store/store";
import { RefCallback } from "context/tutorial-provider/use-tutorial";

import classes from "../view-screen-overlay.module.scss";
import cx from "classnames";
import { isGameScreen } from "utils/view-utils";
import { tickTime } from "constants/view-screen-progress";
import { screenType } from "enums/screen-type";

import { breakpoints } from "hooks/media-query-hook/breakpoints";

// - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen,
  (viewScreen) => ({ viewScreen })
);

type InfoPanelProps = {
  infoPanelRef: RefObject<HTMLDivElement>;
  openDrawer: () => void;
  keyKey: number;
  bind: (stepKey: string) => { ref: RefCallback };
  getTutorialEclipseClassnameByStepkeys: (stepKeys: string[]) => string;
};

const InfoPanel = ({
  infoPanelRef,
  openDrawer,
  keyKey,
  bind,
  getTutorialEclipseClassnameByStepkeys,
}: InfoPanelProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const { t } = useTranslation("view-screen");

  const isSm = useMediaQuery(breakpoints.down("sm"));

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

  if (amIGameScreen || isSm) {
    return null;
  }

  return (
    <div
      className={cx(
        classes.info, // info in the grid
        "hidden sm:flex h-full justify-start items-end p-3 gap-2"
      )}
      ref={infoPanelRef}
    >
      <div
        {...bind("info")}
        className={cx(
          getTutorialEclipseClassnameByStepkeys(["info", "progressbar"])
        )}
      >
        <div className="flex flex-col bg-white pointer-events-auto">
          <div
            {...bind("progressbar")}
            className={cx(
              getTutorialEclipseClassnameByStepkeys(["progressbar"])
            )}
          >
            <ProgressBar
              key={`${viewScreen?.id}-${keyKey}`}
              percentage={percentage}
              height={isVideoOrSlideshowScreen ? 10 : 6}
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
            <span>{viewScreen?.title ?? t("overlay.no-title")}</span>
            <Icon name="info" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
