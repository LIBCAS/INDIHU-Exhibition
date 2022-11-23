import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useSpring, animated } from "react-spring";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { ProgressBar } from "components/progress-bar/progress-bar";
import { tickTime } from "constants/view-screen-progress";
import { AppState } from "store/store";
import { Screen } from "models";

import { useExpoScreenProgress } from "../hooks/expo-screen-progress-hook";
import { useOnClickOutside } from "hooks/use-on-click-outside";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as Screen | undefined,
  (viewScreen) => ({
    viewScreen,
  })
);

export const ViewScreenOverlayDrawer = ({ isOpen, onClose }: Props) => {
  const { viewScreen } = useSelector(stateSelector);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("screen");

  const drawerStyle = useSpring({
    transform: `translate(${isOpen ? "0%" : "-100%"}, 0)`,
  });

  const contentStyle = useSpring({
    y: isOpen ? 0 : 20,
    opacity: isOpen ? 1 : -1,
  });

  useOnClickOutside(ref, onClose);

  const screenText =
    (viewScreen
      ? viewScreen.type === "INTRO"
        ? viewScreen.subTitle
        : "text" in viewScreen
        ? viewScreen.text
        : undefined
      : undefined) ?? t("no-text");

  return (
    <animated.div
      ref={ref}
      className="fixed bg-primary z-50 w-full md:w-[450px] lg:w-[550px] top-0 h-[calc(100vh-15px)] text-white"
      style={drawerStyle}
    >
      <animated.div className="h-full flex flex-col" style={contentStyle}>
        <div className="flex justify-end items-center p-4 flex-none">
          <Button
            iconBefore={<Icon name="close" color="white" />}
            onClick={onClose}
          />
        </div>
        <div className="flex-1 px-8 py-4 flex overflow-y-auto flex-col justify-center md:px-16 md:py-8">
          <ExpoTimeProgress key={viewScreen?.id} />
          <span className="text-4xl font-bold py-4">
            {viewScreen?.title ?? t("no-title")}
          </span>
          <div className="overflow-y-auto">{screenText?.repeat(50)}</div>
        </div>
      </animated.div>
    </animated.div>
  );
};

const ExpoTimeProgress = () => {
  const { percentage } = useExpoScreenProgress({ offsetTotalTime: -tickTime });
  return <ProgressBar height={6} color="white" percentage={percentage} />;
};
