import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withHandlers, withState } from "recompose";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { forEach, find } from "lodash";

import GameMenu from "../../components/views/GameMenu";

import { setTimeoutId } from "../../actions/appActions";

const ViewGameOptions = ({
  viewScreen,
  getNextUrlPart,
  onAnswerChoose,
  setAnswerSelected,
  passButton,
  setPassButton
}) => (
  <div className="game">
    <div id="game-wrap" className="game-wrap">
      <div id="game-options" className="game-options">
        <div
          className={classNames("game-options-title", {
            fill: !find(viewScreen.answers, ({ image }) => image)
          })}
        >
          <p>{viewScreen.task}</p>
        </div>
        <div
          id="game-options-bottom"
          className={classNames("game-options-bottom cursor-pointer", {
            fill: !find(viewScreen.answers, ({ image }) => image)
          })}
          onClick={() => onAnswerChoose()}
        />
      </div>
    </div>
    <GameMenu
      {...{
        passButton,
        task: viewScreen.task,
        getNextUrlPart,
        onClick: () => {
          setAnswerSelected(true);

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

          setPassButton(false);
        }
      }}
    />
  </div>
);

export default compose(
  withRouter,
  connect(
    ({ app: { timeout }, expo: { viewScreen } }) => ({
      timeout,
      viewScreen
    }),
    { setTimeoutId }
  ),
  withState("passButton", "setPassButton", true),
  withState("timeouts", "setTimeouts", []),
  withState("answerSelected", "setAnswerSelected", false),
  lifecycle({
    componentDidMount() {
      const { viewScreen, screenFiles } = this.props;

      forEach(viewScreen.answers, (answer, i) => {
        const divNode = document.createElement("div");
        divNode.id = `game-options-answer${i}`;
        divNode.className = "game-options-answer with-mark";

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
          fill: !answer.image
        });
        const p = document.createElement("p");
        p.className = "text";
        forEach(answer.text.split("\n"), item => {
          p.appendChild(document.createTextNode(item));
          p.appendChild(document.createElement("br"));
        });
        textContainer.appendChild(p);
        divNode.appendChild(textContainer);

        document.getElementById("game-options-bottom").appendChild(divNode);
      });
    },
    componentWillUnmount() {
      const { timeout, setTimeoutId, timeouts } = this.props;
      if (timeout) {
        clearTimeout(timeout);
        setTimeoutId(null);
      }
      forEach(timeouts, t => clearTimeout(t));
    }
  }),
  withHandlers({
    onAnswerChoose: ({
      viewScreen,
      getNextUrlPart,
      history,
      setTimeoutId,
      timeouts,
      setTimeouts,
      answerSelected,
      setAnswerSelected,
      setPassButton
    }) => () => {
      if (!answerSelected) {
        setAnswerSelected(true);
        setPassButton(false);

        const animationTime = 1250;

        forEach(viewScreen.answers, (answer, i) => {
          if (!answer.correct) {
            setTimeouts([
              ...timeouts,
              setTimeout(() => {
                document.getElementById(`game-options-answer${i}`).className =
                  "game-options-answer transparent";
              }, animationTime)
            ]);

            document.getElementById(`game-options-answer${i}`).className +=
              "game-options-answer animation-fade-out";
          } else {
            document.getElementById(`game-options-answer${i}`).className =
              "game-options-answer";
          }
        });

        document.getElementById("game-options-bottom").className =
          "game-options-bottom";

        setTimeoutId(
          setTimeout(async () => {
            if (getNextUrlPart) history.push(getNextUrlPart());
          }, 5000 + animationTime)
        );
      }
    }
  })
)(ViewGameOptions);
