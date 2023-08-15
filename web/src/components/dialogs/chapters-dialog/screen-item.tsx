import { useCallback, useMemo, useState } from "react";

import { animated, useSpring } from "react-spring";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";

import { NavLink } from "react-router-dom";
import { Collapse } from "components/collapse/collapse";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { ScreenChapters, ScreenHighlight } from "models";
import cx from "classnames";

// - -

interface ScreenItemProps {
  screen: ScreenChapters;
  onClick: () => void;
  viewExpoUrl?: string;
  isSubScreen?: boolean;
  highlight?: ScreenHighlight;
  usedInDialog?: boolean;
}

export const ScreenItem = ({
  screen,
  onClick,
  viewExpoUrl,
  isSubScreen = false,
  highlight,
  usedInDialog = false,
}: ScreenItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isChapter = !!screen.subScreens;

  const { fgThemingIf } = useExpoDesignData();

  const { rotate } = useSpring({
    rotate: isOpen ? "90deg" : "0deg",
  });

  const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const shouldHighlight = useMemo(
    () =>
      screen.sectionIndex === highlight?.section &&
      (screen.screenIndex === highlight?.screen || isChapter),
    [
      highlight?.screen,
      highlight?.section,
      isChapter,
      screen.screenIndex,
      screen.sectionIndex,
    ]
  );

  const currentScreenItemNavLink = `/view/${viewExpoUrl}/${
    screen.sectionIndex
  }${screen.screenIndex !== undefined ? `/${screen.screenIndex}` : ""}`;

  return (
    <>
      {/*1. Icon for the chapter or subscreen OR nothing for the START screen */}
      <div
        className={cx(
          "flex items-center gap-2 border-b border-b-black border-opacity-10 p-2",
          isSubScreen && "pl-4",
          shouldHighlight && "text-primary"
        )}
      >
        {screen.type === "START" ? (
          <Icon name="first_page" />
        ) : isChapter ? (
          <Button noPadding onClick={handleToggle}>
            <animated.div style={{ rotate }}>
              <Icon
                name="chevron_right"
                color={shouldHighlight ? "expoTheme" : undefined}
              />
            </animated.div>
          </Button>
        ) : (
          <Icon
            name="arrow_right"
            color={shouldHighlight ? "expoTheme" : "muted-400"}
            //className={shouldHighlight ? "text-primary" : "text-muted-400"}
          />
        )}

        {/* After icon.. title of the chapter or subscreen as a link */}
        <NavLink
          className={cx(
            "text-black no-underline",
            shouldHighlight ? "font-bold" : "font-medium",
            {
              // NOTE: for now, dialogs are white, do not color in dialog.. keep always black
              ...fgThemingIf(!usedInDialog),
            }
          )}
          onClick={onClick}
          to={currentScreenItemNavLink}
        >
          {screen.type === "START"
            ? "Úvodní obrazovka"
            : screen.title ??
              `Nepojmenovaná ${isChapter ? "kapitola" : "obrazovka"}`}
        </NavLink>
      </div>

      {/* 2. If the current ScreenItem is chapter and not the subscreen.. generate chapter's subscreen as a collapse */}
      {isChapter && (
        <Collapse isOpen={isOpen}>
          {screen.subScreens?.map((screen) => (
            <ScreenItem
              key={`${screen.sectionIndex}-${screen.screenIndex}`}
              onClick={onClick}
              screen={screen}
              viewExpoUrl={viewExpoUrl}
              highlight={highlight}
              isSubScreen
            />
          ))}
        </Collapse>
      )}
    </>
  );
};
