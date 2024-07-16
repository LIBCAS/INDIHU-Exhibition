import { useTranslation } from "react-i18next";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { Icon } from "components/icon/icon";
import { RefCallback } from "context/tutorial-provider/use-tutorial";

import cx from "classnames";

type GameInfoPanelProps = {
  gameScreen: { title?: string; task?: string };
  isGameFinished?: boolean;
  bindTutorial: { ref: RefCallback };
};

export const GameInfoPanel = ({
  gameScreen,
  isGameFinished,
  bindTutorial,
}: GameInfoPanelProps) => {
  const { t } = useTranslation("view-screen");
  const { bgFgTheming } = useExpoDesignData();
  const { title, task } = gameScreen;

  return (
    <div className="flex flex-col gap-4" {...bindTutorial}>
      <div
        className={cx(
          "p-4 bg-white text-black min-w-[150px] max-w-[450px] flex flex-col gap-2 pointer-events-auto",
          { ...bgFgTheming }
        )}
      >
        <div className="flex items-center gap-2">
          <Icon name="info" />
          <span className="font-bold">
            {isGameFinished ? t("game.solution") : title}
          </span>
        </div>
        {task && <span className="text-gray pointer-events-auto">{task}</span>}
      </div>
    </div>
  );
};
