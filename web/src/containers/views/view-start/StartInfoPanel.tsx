import { useMemo, Dispatch, SetStateAction } from "react";
import { useSpring, animated, useTransition } from "react-spring";
import { useTranslation } from "react-i18next";

import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";
import { breakpoints } from "hooks/media-query-hook/breakpoints";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import TagsList from "components/tags-list/TagsList";
import { Divider } from "components/divider/divider";
import Paper from "react-md/lib/Papers/Paper";

import { StartScreen, ViewExpo } from "models";
import { secondsToFormatedTime, giveMeExpoTime } from "utils";

import cx from "classnames";

// - -

type StartInfoPanelProps = {
  viewExpo: ViewExpo;
  viewScreen: StartScreen;
  isInfoPanelOpen: boolean;
  setIsInfoPanelOpen: Dispatch<SetStateAction<boolean>>;
  openMobileInfoDialog: () => void;
  openChaptersDialog: () => void;
};

const StartInfoPanel = ({
  viewExpo,
  viewScreen,
  isInfoPanelOpen,
  setIsInfoPanelOpen,
  openMobileInfoDialog,
  openChaptersDialog,
}: StartInfoPanelProps) => {
  const { t } = useTranslation("view-exhibition");
  const { bgTheming, fgTheming } = useExpoDesignData();
  const isSmall = useMediaQuery(breakpoints.down("lg"));

  const expoTime = useMemo(
    () =>
      viewScreen.expoTime
        ? secondsToFormatedTime(viewScreen.expoTime, false)
        : giveMeExpoTime(viewExpo.structure.screens),
    [viewExpo.structure.screens, viewScreen]
  );

  const expoPerexLines = useMemo(
    () =>
      viewScreen.perex
        ? (viewScreen.perex?.split("\n") as string[])
        : ["Expozice neobsahuje perex"],
    [viewScreen.perex]
  );

  // -- Animations --
  const { rotateX } = useSpring({
    rotateX: isInfoPanelOpen ? "180deg" : "0deg",
  });

  const transition = useTransition(isInfoPanelOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <Paper
      zDepth={3}
      className={cx({
        "h-full flex-1 bg-white p-4 cursor-pointer": isSmall,
        "h-full bg-white p-4 cursor-pointer": !isSmall,
        ...bgTheming,
      })}
      onClick={() =>
        isSmall ? openMobileInfoDialog() : setIsInfoPanelOpen(!isInfoPanelOpen)
      }
    >
      {/* Inside Start Info Panel, content */}
      <div className={cx("h-full flex flex-col gap-1", { ...fgTheming })}>
        <div className="h-full flex flex-col expo-scrollbar">
          <div className="flex justify-between items-center">
            <span className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">
              {viewScreen.title ?? t("no-name")}
            </span>
            <Button
              className="self-start"
              iconAfter={
                <animated.div style={{ rotateX }}>
                  <Icon
                    color="expoThemeIcons"
                    name={isSmall ? "chevron_right" : "expand_less"}
                  />
                </animated.div>
              }
              onClick={(e) => {
                e.stopPropagation(); // this button is inside Paper which has the same onClick
                if (isSmall) {
                  openMobileInfoDialog();
                } else {
                  setIsInfoPanelOpen(!isInfoPanelOpen);
                }
              }}
            >
              {!isSmall && isInfoPanelOpen ? t("less-info") : t("more-info")}
            </Button>
          </div>

          <span className="mb-2">{viewScreen.subTitle}</span>

          {!isSmall && viewExpo.tags && (
            <div className="my-2">
              <TagsList tags={viewExpo.tags} />
            </div>
          )}

          {transition(
            ({ opacity }, isOpen) =>
              isOpen &&
              !isSmall && (
                <animated.div
                  className="py-2 flex-1 flex flex-col"
                  style={{ opacity }}
                >
                  <Divider />
                  <div className="flex-grow basis-0">
                    <div className="pt-6 pb-3">
                      {expoPerexLines.map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </div>
                  </div>
                  <Divider />
                </animated.div>
              )
          )}
        </div>

        <div className="flex items-center mt-auto justify-between">
          <div className="flex items-center">
            <Icon name="schedule" color="expoThemeIcons" />
            <span className="ml-2">
              {t("approximately")} {expoTime}
            </span>
          </div>

          {!isSmall && (
            <Button
              iconAfter={<Icon color="expoThemeIcons" name="layers" />}
              onClick={(e) => {
                e.stopPropagation();
                openChaptersDialog();
              }}
            >
              {t("chapters")}
            </Button>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default StartInfoPanel;
