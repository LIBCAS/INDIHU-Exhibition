import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import { BasicTooltip } from "components/tooltip/tooltip";
import { useTranslation } from "react-i18next";

type GameActionsPanelProps = {
  isGameFinished?: boolean;
  onGameFinish?: () => void;
  onGameReset?: () => void;
  gameActions?: JSX.Element | JSX.Element[]; // e.g additional game buttons for this game screen
};

export const GameActionsPanel = ({
  isGameFinished,
  onGameFinish,
  onGameReset,
  gameActions,
}: GameActionsPanelProps) => {
  const { t } = useTranslation("view-screen");

  return (
    <div className="flex flex-row-reverse gap-2">
      <div className="flex gap-2">
        {/* Play again button */}
        <div
          className="pointer-events-auto"
          data-tooltip-id="game-overlay-replay-button-tooltip"
        >
          <Button
            iconBefore={<Icon name="replay" />}
            color="primary"
            style={{ width: "38px", height: "31px", border: "2px solid white" }}
            onClick={onGameReset}
          />
          <BasicTooltip
            id="game-overlay-replay-button-tooltip"
            content={t("game.controls.play-again")}
          />
        </div>

        {/* Done button */}
        <div
          className="pointer-events-auto"
          data-tooltip-id="game-overlay-done-button-tooltip"
        >
          <Button
            disabled={isGameFinished}
            iconBefore={<Icon name="done" />}
            color="primary"
            style={{ width: "38px", height: "31px", border: "2px solid white" }}
            onClick={onGameFinish}
          />
          <BasicTooltip
            id="game-overlay-done-button-tooltip"
            content={t("game.controls.finished")}
          />
        </div>
      </div>

      {/* Additional actions for particular game screens */}
      <div className="flex gap-2">
        {Array.isArray(gameActions)
          ? gameActions.map((action, index) => (
              <div key={index} className="pointer-events-auto">
                {action}
              </div>
            ))
          : gameActions && (
              <div className="pointer-events-auto">{gameActions}</div>
            )}
      </div>
    </div>
  );
};
