import { useCallback, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { animated, useSpring } from "react-spring";
import { useMediaQuery } from "hooks/media-query-hook/media-query-hook";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSectionScreenParams } from "hooks/view-hooks/section-screen-hook";
import { useScreenChapters } from "hooks/view-hooks/screen-chapters-hook";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import { Icon } from "components/icon/icon";
import { Button } from "components/button/button";
import { ScreenItem } from "components/dialogs/chapters-dialog/screen-item";

import { breakpoints } from "hooks/media-query-hook/breakpoints";
import { AppState } from "store/store";

import { parseUrlSection, parseUrlScreen } from "utils";
import cx from "classnames";

import { useDialogRef } from "context/dialog-ref-provider/dialog-ref-provider";
import { DialogRefType } from "context/dialog-ref-provider/dialog-ref-types";

// - -

type Props = {
  maxHeight?: number;
};

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  (viewExpo) => ({ viewExpo })
);

export const ChaptersButton = ({ maxHeight = 250 }: Props) => {
  const { viewExpo } = useSelector(stateSelector);

  const { openNewTopDialog } = useDialogRef();

  const { bgFgTheming } = useExpoDesignData();

  const { section, screen } = useParams<{
    section: string;
    screen: string;
  }>();

  const sectionScreen = useSectionScreenParams();
  const screenChapters = useScreenChapters(viewExpo?.structure?.screens);

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation("view-screen", { keyPrefix: "overlay" });

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

  //
  const parsedUrlSection = parseUrlSection(section);
  const parsedUrlScreen = parseUrlScreen(screen);

  /* Open and Close the Chapters panel */
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const openChaptersDialog = useCallback(() => {
    openNewTopDialog(DialogRefType.ChaptersDialog);
  }, [openNewTopDialog]);

  if (isSmallScreen) {
    return (
      <Button
        iconBefore={<Icon color="expoThemeIcons" name="layers" />}
        color="expoTheme"
        onClick={openChaptersDialog}
      >
        {t("chaptersButton")}
      </Button>
    );
  }

  return (
    <animated.div
      style={{ height, width }}
      className={cx("bg-white", {
        ...bgFgTheming,
      })}
    >
      {/* Opened Chapters */}
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
          <span className="text-3xl font-bold">{t("chaptersButton")}</span>
          <Button iconBefore={<Icon name="close" />} onClick={toggle} />
        </div>
        <div className="overflow-y-auto grow">
          {/* First special START SCREEN! */}
          {viewExpo && (
            <ScreenItem
              // key="start-screen"
              screen={{
                ...viewExpo.structure.start,
                sectionIndex: "start",
                screenIndex: undefined,
                subScreens: undefined,
              }}
              viewExpoUrl={viewExpo.url}
              onClick={toggle}
              isSubScreen={false}
              highlight={{
                section: parsedUrlSection,
                screen: parsedUrlScreen,
              }}
            />
          )}
          {/* Then others INTRO chapters screen with their subscreens! */}
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

      {/* Closed Chapters */}
      <animated.div
        ref={buttonRef}
        style={{
          opacity: buttonOpacity,
          visibility: isOpen ? "hidden" : "visible",
          width: "min-content",
        }}
      >
        <Button
          iconBefore={<Icon color="expoThemeIcons" name="layers" />}
          color="expoTheme"
          onClick={toggle}
        >
          {t("chaptersButton")}
        </Button>
      </animated.div>
    </animated.div>
  );
};
