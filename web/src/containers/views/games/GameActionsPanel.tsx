import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

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
  return (
    <div className="flex flex-row-reverse gap-2">
      <div className="flex flex-row-reverse gap-2">
        <Button
          disabled={isGameFinished}
          iconBefore={<Icon name="done" />}
          color="primary"
          className="pointer-events-auto"
          style={{ width: "38px", height: "31px", border: "2px solid white" }}
          onClick={onGameFinish}
        />
        <Button
          iconBefore={<Icon name="replay" />}
          color="primary"
          className="pointer-events-auto"
          style={{ width: "38px", height: "31px", border: "2px solid white" }}
          onClick={onGameReset}
        />
      </div>

      <div className="flex flex-row-reverse gap-2">
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
