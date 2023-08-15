import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { animated, useSpring, useTransition } from "react-spring";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";
import { useTranslation } from "react-i18next";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

// Components
import { Button } from "components/button/button";
import { Divider } from "components/divider/divider";
import { Icon } from "components/icon/icon";

// Models
import { AppDispatch, AppState } from "store/store";
import { DialogType } from "components/dialogs/dialog-types";
import { ViewExpo, StartScreen } from "models";
import { TagValues } from "containers/expo-administration/expo-settings/tags-options";

// Actions and utils
import { setDialog } from "actions/dialog-actions";
import { giveMeExpoTime, secondsToFormatedTime } from "utils";
import { breakpoints } from "hooks/media-query-hook/breakpoints";
import cx from "classnames";
import TagsList from "components/tags-list/TagsList";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo as ViewExpo,
  ({ expo }: AppState) => expo.viewScreen as StartScreen,
  (viewExpo, viewScreen) => ({ viewExpo, viewScreen })
);

// - - - - - - - -

interface ViewStartInfoProps {
  isOpen: boolean;
  toggle: () => void;
  openMobileInfoDialog: () => void;
  tags: TagValues[] | undefined;
}

export const ViewStartInfo = ({
  isOpen,
  toggle,
  openMobileInfoDialog,
  tags,
}: ViewStartInfoProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { viewExpo, viewScreen } = useSelector(stateSelector);

  const { fgTheming } = useExpoDesignData();

  const isSmall = useMediaQuery(breakpoints.down("lg"));
  const { t } = useTranslation("exhibition");

  const { rotateX } = useSpring({
    rotateX: isOpen ? "180deg" : "0deg",
  });

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

  const openChaptersDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.ChaptersDialog, {
          screens: viewExpo.structure.screens,
          viewExpoUrl: viewExpo.url,
        })
      ),
    [dispatch, viewExpo.structure.screens, viewExpo.url]
  );

  const transition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <div
      className={cx("flex flex-col h-full gap-1", {
        ...fgTheming,
      })}
    >
      {/* A) Scrollable container with title, subtitle, openable description, if not small screen tags*/}
      <div className="flex flex-col h-full expo-scrollbar">
        {/*  A1) Title and more/less information */}
        <div className="flex justify-between items-center">
          <span className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">
            {viewScreen.title ?? t("no-name")}
          </span>
          <Button
            iconAfter={
              <animated.div style={{ rotateX }}>
                <Icon
                  color="expoTheme"
                  name={isSmall ? "chevron_right" : "expand_less"}
                />
              </animated.div>
            }
            onClick={(e) => {
              e.stopPropagation(); // this button is inside Paper which has the same onClick
              const func = isSmall ? openMobileInfoDialog : toggle;
              func();
            }}
            className="self-start"
          >
            {!isSmall && isOpen ? t("less-info") : t("more-info")}
          </Button>
        </div>

        {/* A2) Subtitle */}
        <span className="mb-2">{viewScreen.subTitle}</span>

        {/* A3 Tags */}
        {!isSmall && tags && (
          <div className="my-2">
            <TagsList tags={tags} />
          </div>
        )}

        {/* A4) If display is bigger than "lg" && Panel is toggled, then point 1,2) stays and render also Divider + Info lines */}
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
                  <div className="text-gray-600 pt-6 pb-3">
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

      {/* B) Schedule time + Chapters Button if display is bigger than "lg" */}
      <div className="flex items-center mt-auto justify-between">
        <div className="flex items-center">
          <Icon name="schedule" color="expoTheme" />
          <span className="ml-2">
            {t("approximately")} {expoTime}
          </span>
        </div>

        {!isSmall && (
          <Button
            iconAfter={<Icon color="expoTheme" name="layers" />}
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
  );
};
