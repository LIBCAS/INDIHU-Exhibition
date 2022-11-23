import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { animated, useSpring, useTransition } from "react-spring";

import { Button } from "components/button/button";
import { Divider } from "components/divider/divider";
import { setDialog } from "actions/dialog-actions";
import { giveMeExpoTime, secondsToFormatedTime } from "utils";
import { AppDispatch, AppState } from "store/store";
import { DialogType } from "components/dialogs/dialog-types";
import { Icon } from "components/icon/icon";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";
import { breakpoints } from "hooks/media-query-hook/breakpoints";
import { ViewExpo } from "reducers/expo-reducer";
import { StartScreen } from "models";

import { useTranslation } from "react-i18next";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo as ViewExpo,
  ({ expo }: AppState) => expo.viewScreen as StartScreen,
  (viewExpo, viewScreen) => ({ viewExpo, viewScreen })
);

export const ViewStartInfo = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { viewExpo, viewScreen } = useSelector(stateSelector);
  const isSmall = useMediaQuery(breakpoints.down("lg"));
  const { t } = useTranslation("exposition");

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

  const openMobileInfoDialog = useCallback(() => {
    dispatch(setDialog(DialogType.ExpoInfoDialog, { viewExpo, viewScreen }));
  }, [dispatch, viewExpo, viewScreen]);

  const transition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center">
        <span className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">
          {viewScreen.title ?? t("no-name")}
        </span>
        <Button
          iconAfter={
            <animated.div style={{ rotateX }}>
              <Icon
                color="primary"
                name={isSmall ? "chevron_right" : "expand_less"}
              />
            </animated.div>
          }
          onClick={isSmall ? openMobileInfoDialog : toggle}
        >
          {!isSmall && isOpen ? t("less-info") : t("more-info")}
        </Button>
      </div>
      <span className="mb-2">{viewScreen.subTitle}</span>
      {transition(
        ({ opacity }, isOpen) =>
          isOpen &&
          !isSmall && (
            <animated.div
              className="py-2 flex-1 flex flex-col"
              style={{ opacity }}
            >
              <Divider />
              <div className="flex-grow basis-0 overflow-y-auto">
                <div className="text-gray-600 py-6">
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
      <div className="flex items-center mt-auto justify-between">
        <div className="flex items-center">
          <Icon name="schedule" color="primary" />
          <span className="ml-2">
            {t("approximately")} {expoTime}
          </span>
        </div>
        {!isSmall && (
          <Button
            iconAfter={<Icon color="primary" name="layers" />}
            onClick={openChaptersDialog}
          >
            {t("chapters")}
          </Button>
        )}
      </div>
    </div>
  );
};
