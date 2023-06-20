import ReactDOM from "react-dom";
import { useCallback, useState } from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import cx from "classnames";

import { ScreenProps } from "models";
import { GameQuizScreen } from "models";
import { AppState } from "store/store";

import { GameToolbar } from "../game-toolbar";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as GameQuizScreen,
  (viewScreen) => ({ viewScreen })
);

export const GameQuiz = ({ screenPreloadedFiles, toolbarRef }: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);
  const [finished, setFinished] = useState(false);
  const [marked, setMarked] = useState<number>();
  const { t } = useTranslation("screen");

  const onFinish = useCallback(() => {
    setFinished(true);
  }, []);

  const onReset = useCallback(() => {
    setFinished(false);
    setMarked(undefined);
  }, []);

  return (
    <div className="flex flex-col h-full w-full justify-center items-center p-4 md:p-8 lg:p-16">
      <span className="text-white font-bold text-2xl mb-8">
        {viewScreen.task}
      </span>
      <div className="flex flex-wrap gap-4 items-center pb-16">
        {viewScreen.answers?.map(({ text, correct }, index) => (
          <div
            key={index}
            className={cx(
              "h-full border-2 flex-1 flex flex-col justify-center items-center rounded bg-opacity-10 hover:cursor-pointer px-2",
              !finished && marked !== index && "border-transparent",
              marked === index && "border-primary bg-primary",
              finished && correct && "border-success bg-success",
              finished && !correct && "border-danger bg-danger"
            )}
            onClick={() => setMarked(index)}
          >
            <img
              src={screenPreloadedFiles.answers?.[index]?.image}
              className="flex-1 w-full object-contain"
              draggable={false}
            />
            <span className="block text-center text-white mt-2">{text}</span>
          </div>
        ))}
      </div>

      {toolbarRef.current &&
        ReactDOM.createPortal(
          <GameToolbar
            text={t("game-quiz.task")}
            onFinish={onFinish}
            onReset={onReset}
            finished={finished}
            screen={viewScreen}
          />,
          toolbarRef.current
        )}
    </div>
  );
};
