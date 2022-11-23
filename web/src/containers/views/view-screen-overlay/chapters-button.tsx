import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { createSelector } from "reselect";

import { Icon } from "components/icon/icon";
import { Button } from "components/button/button";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";
import { breakpoints } from "hooks/media-query-hook/breakpoints";
import { useScreenChapters } from "components/dialogs/chapters-dialog/screen-chapters-hook";
import { AppDispatch, AppState } from "store/store";
import { ScreenItem } from "components/dialogs/chapters-dialog/screen-item";
import { DialogType } from "components/dialogs/dialog-types";
import { setDialog } from "actions/dialog-actions";

import { useSectionScreen } from "../hooks/section-screen-hook";
import { useTranslation } from "react-i18next";

type Props = {
  maxHeight?: number;
};

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  (viewExpo) => ({ viewExpo })
);

export const ChaptersButton = ({ maxHeight = 250 }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const sectionScreen = useSectionScreen();
  const { viewExpo } = useSelector(stateSelector);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const screenChapters = useScreenChapters(viewExpo?.structure?.screens);
  const { t } = useTranslation("screen");

  const isMediumScreen = useMediaQuery(breakpoints.down("lg"));
  const isSmallScreen = useMediaQuery(breakpoints.down("md"));
  const isExtraSmallScreen = useMediaQuery(breakpoints.down("sm"));

  const maxWidth = useMemo(
    () =>
      isExtraSmallScreen
        ? 125
        : isSmallScreen
        ? 175
        : isMediumScreen
        ? 400
        : 550,
    [isExtraSmallScreen, isMediumScreen, isSmallScreen]
  );

  const { height, width, screenOpacity, buttonOpacity } = useSpring({
    height: isOpen ? maxHeight : buttonRef?.current?.offsetHeight,
    width: isOpen ? maxWidth : buttonRef?.current?.offsetWidth,
    screenOpacity: isOpen ? 1 : 0,
    buttonOpacity: isOpen ? 0 : 1,
  });

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const openChaptersDialog = useCallback(
    () =>
      dispatch(
        setDialog(DialogType.ChaptersDialog, {
          screens: viewExpo?.structure?.screens,
          viewExpoUrl: viewExpo?.url,
          hightlight: sectionScreen,
        })
      ),
    [dispatch, sectionScreen, viewExpo?.structure?.screens, viewExpo?.url]
  );

  if (isSmallScreen) {
    return (
      <Button
        iconBefore={<Icon color="primary" name="layers" />}
        color="white"
        onClick={openChaptersDialog}
      >
        Kapitoly
      </Button>
    );
  }

  return (
    <animated.div style={{ height, width }} className="bg-white">
      <animated.div
        style={{
          opacity: screenOpacity,
          visibility: isOpen ? "visible" : "hidden",
          height: isOpen ? undefined : 0,
          width: isOpen ? undefined : 0,
        }}
        className="h-full flex flex-col"
      >
        <div className="flex justify-between items-center py-2 px-6 border-b border-b-black border-opacity-10">
          <span className="text-3xl font-bold">{t("chapters")}</span>
          <Button iconBefore={<Icon name="close" />} onClick={toggle} />
        </div>
        <div className="overflow-y-auto grow">
          {screenChapters?.map((screen) => (
            <ScreenItem
              key={`${screen.sectionIndex}-${screen.screenIndex}`}
              screen={screen}
              viewExpoUrl={viewExpo?.url}
              onClick={toggle}
              highlight={sectionScreen}
            />
          ))}
        </div>
      </animated.div>

      <animated.div
        ref={buttonRef}
        style={{
          opacity: buttonOpacity,
          visibility: isOpen ? "hidden" : "visible",
          width: "min-content",
        }}
      >
        <Button
          iconBefore={<Icon color="primary" name="layers" />}
          color="white"
          onClick={toggle}
        >
          {t("chapters")}
        </Button>
      </animated.div>
    </animated.div>
  );
};
