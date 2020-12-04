import React from "react";
import { connect } from "react-redux";
import {
  compose,
  lifecycle,
  withHandlers,
  withState,
  withProps,
} from "recompose";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { forEach, find } from "lodash";

import GameMenu from "../../components/views/GameMenu";

const animationTime = 1;

const ViewGameOptions = ({
  viewScreen,
  getNextUrlPart,
  onReset,
  onDone,
  done,
  setDone,
  resultTime,
}) => (
  <div className="game">
    <div id="game-wrap" className="game-wrap">
      <div id="game-options" className="game-options">
        <div
          className={classNames("game-options-title", {
            fill: !find(viewScreen.answers, ({ image }) => image),
          })}
        >
          <p>{viewScreen.task}</p>
        </div>
        <div
          id="game-options-bottom"
          className={classNames("game-options-bottom", {
            fill: !find(viewScreen.answers, ({ image }) => image),
          })}
        />
      </div>
    </div>
    <GameMenu
      {...{
        doneButton: !done,
        passButton: !done,
        resetButton: !done,
        task: viewScreen.task,
        resultTime,
        getNextUrlPart,
        onDone,
        onReset,
        onClick: () => {
          setDone(true);

          forEach(viewScreen.answers, (answer, i) => {
            if (!answer.correct) {
              document.getElementById(`game-options-answer${i}`).className =
                "game-options-answer transparent";
            } else {
              document.getElementById(`game-options-answer${i}`).className =
                "game-options-answer";
            }
          });

          document.getElementById("game-options-bottom").className =
            "game-options-bottom";
        },
      }}
    />
  </div>
);

export default compose(
  withRouter,
  connect(({ expo: { viewScreen } }) => ({
    viewScreen,
  })),
  withState("done", "setDone", false),
  withState("timeouts", "setTimeouts", []),
  withProps(({ viewScreen }) => {
    const { resultTime } = viewScreen;
    return {
      resultTime:
        (resultTime && resultTime > 0 ? resultTime : 5) + animationTime,
    };
  }),
  withHandlers({
    onReset: ({ viewScreen }) => () => {
      forEach(viewScreen.answers, (_, i) => {
        document.getElementById(`game-options-answer${i}`).className =
          "game-options-answer with-hover";
      });
    },
    onAnswerChoose: ({ viewScreen, done }) => (selected) => {
      if (!done) {
        forEach(viewScreen.answers, (_, i) => {
          if (selected === i) {
            document.getElementById(`game-options-answer${i}`).className =
              "game-options-answer with-hover selected";
          } else {
            document.getElementById(`game-options-answer${i}`).className =
              "game-options-answer with-hover";
          }
        });
      }
    },
    onDone: ({ viewScreen, timeouts, setTimeouts, done, setDone }) => () => {
      if (!done) {
        setDone(true);

        forEach(viewScreen.answers, (answer, i) => {
          if (!answer.correct) {
            setTimeouts([
              ...timeouts,
              setTimeout(() => {
                document.getElementById(`game-options-answer${i}`).className =
                  "game-options-answer transparent";
              }, animationTime * 1000),
            ]);

            document.getElementById(`game-options-answer${i}`).className =
              "game-options-answer animation-fade-out";
          } else {
            document.getElementById(`game-options-answer${i}`).className =
              "game-options-answer";
          }
        });

        document.getElementById("game-options-bottom").className =
          "game-options-bottom";
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      const { viewScreen, screenFiles, onAnswerChoose } = this.props;

      forEach(viewScreen.answers, (answer, i) => {
        const divNode = document.createElement("div");
        divNode.id = `game-options-answer${i}`;
        divNode.className = "game-options-answer with-hover";
        divNode.onclick = () => onAnswerChoose(i);

        const answerOption = document.createElement("p");
        answerOption.className = "answer-option";
        answerOption.appendChild(
          document.createTextNode(i === 0 ? "A" : i === 1 ? "B" : "C")
        );
        divNode.appendChild(answerOption);
        if (answer.image) {
          const imageNode = screenFiles[`answers[${i}].image`];
          imageNode.id = `game-options-answer${i}-image`;
          const innerDivNode = document.createElement("div");
          innerDivNode.className = "game-options-answer-inner";
          innerDivNode.appendChild(imageNode);
          divNode.appendChild(innerDivNode);
        }

        const textContainer = document.createElement("div");
        textContainer.id = `game-options-answer${i}-text`;
        textContainer.className = classNames("game-options-answer-text", {
          fill: !answer.image,
        });
        const p = document.createElement("p");
        p.className = "text";
        forEach(answer.text.split("\n"), (item) => {
          p.appendChild(document.createTextNode(item));
          p.appendChild(document.createElement("br"));
        });
        textContainer.appendChild(p);
        divNode.appendChild(textContainer);

        document.getElementById("game-options-bottom").appendChild(divNode);
      });
    },
    componentWillUnmount() {
      const { timeouts } = this.props;
      forEach(timeouts, (t) => clearTimeout(t));
    },
  })
)(ViewGameOptions);
