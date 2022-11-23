import { useCallback, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import cx from "classnames";

import { Collapse } from "components/collapse/collapse";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { ScreenChapters } from "./types";

export type ScreenHighlight = {
  section?: number;
  screen?: number;
};

interface ScreenItemProps {
  screen: ScreenChapters;
  viewExpoUrl?: string;
  isSubScreen?: boolean;
  onClick: () => void;
  highlight?: ScreenHighlight;
}

export const ScreenItem = ({
  screen,
  isSubScreen = false,
  viewExpoUrl,
  onClick,
  highlight,
}: ScreenItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isChapter = !!screen.subScreens;

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

  return (
    <>
      <div
        className={cx(
          "flex items-center gap-2 border-b border-b-black border-opacity-10 p-2",
          isSubScreen && "pl-4",
          shouldHighlight && "text-primary"
        )}
      >
        {isChapter ? (
          <Button noPadding onClick={handleToggle}>
            <animated.div style={{ rotate }}>
              <Icon
                name="chevron_right"
                color={shouldHighlight ? "primary" : undefined}
              />
            </animated.div>
          </Button>
        ) : (
          <Icon
            name="arrow_right"
            className={shouldHighlight ? "text-primary" : "text-muted-400"}
          />
        )}
        <NavLink
          className={cx(
            "text-black no-underline",
            shouldHighlight ? "font-bold" : "font-medium"
          )}
          onClick={onClick}
          to={`/view/${viewExpoUrl}/${screen.sectionIndex}/${screen.screenIndex}`}
        >
          {screen.title ??
            `Nepojmenovaná ${isChapter ? "kapitola" : "obrazovka"}`}
        </NavLink>
      </div>
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
