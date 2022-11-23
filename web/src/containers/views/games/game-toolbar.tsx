import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { useTranslation } from "react-i18next";

type GameToolbarProps = {
  onFinish?: () => void;
  onReset?: () => void;
  text?: string;
  finished?: boolean;
  screen: { title?: string; task?: string };
  actions?: JSX.Element | JSX.Element[];
};

export const GameToolbar = ({
  onFinish,
  onReset,
  text,
  finished,
  screen,
  actions,
}: GameToolbarProps) => {
  const { t } = useTranslation("screen");
  const { title, task } = screen;

  return (
    <div className="flex flex-col gap-4">
      {text && (
        <div className="p-4 bg-white text-black min-w-[150px] max-w-[450px] flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Icon name="info" />
            <span className="font-bold">
              {finished ? t("game.solution") : title}
            </span>
          </div>
          {task && (
            <span className="text-muted pointer-events-auto">{task}</span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          disabled={finished}
          iconBefore={<Icon name="done" />}
          color="white"
          className="pointer-events-auto"
          onClick={onFinish}
        >
          {t("game.controls.finished")}
        </Button>
        <Button
          iconBefore={<Icon name="replay" />}
          color="white"
          className="pointer-events-auto"
          onClick={onReset}
        >
          {t("game.controls.play-again")}
        </Button>
        {Array.isArray(actions)
          ? actions.map((action, index) => (
              <div key={index} className="pointer-events-auto">
                {action}
              </div>
            ))
          : actions && <div className="pointer-events-auto">{actions}</div>}
      </div>
    </div>
  );
};
