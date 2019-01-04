import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withHandlers, withState } from "recompose";
import { withRouter } from "react-router-dom";
import { forEach } from "lodash";

import GameMenu from "../../components/views/GameMenu";

import { setTimeoutId } from "../../actions/appActions";

const ViewGameOptions = ({
  viewScreen,
  getNextUrlPart,
  onAnswerChoose,
  setAnswerSelected,
  passButton,
  setPassButton
}) =>
  <div className="game">
    <div id="game-wrap" className="game-wrap">
      <div id="game-options" className="game-options">
        <div id="game-options-top" className="game-options-top" />
        <p className="game-options-title">
          {viewScreen.task}
        </p>
        <div
          id="game-options-bottom"
          className="game-options-bottom cursor-pointer"
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
  </div>;

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

      if (viewScreen.image) {
        const imageNode = screenFiles["image"];

        imageNode.id = "game-options-image";
        document.getElementById("game-options-top").appendChild(imageNode);
      }

      forEach(viewScreen.answers, (answer, i) => {
        const divNode = document.createElement("div");
        divNode.id = `game-options-answer${i}`;
        divNode.className = "game-options-answer with-mark";

        if (answer.image) {
          const imageNode = screenFiles[`answers[${i}].image`];
          imageNode.id = `game-options-answer${i}-image`;
          const innerDivNode = document.createElement("div");
          innerDivNode.className = "game-options-answer-inner";
          innerDivNode.append(imageNode);
          divNode.append(innerDivNode);
        }

        const textNode = document.createElement("div");
        textNode.id = `game-options-answer${i}-text`;
        textNode.className = "game-options-answer-text";
        forEach(answer.text.split("\n"), item => {
          textNode.appendChild(document.createTextNode(item));
          textNode.appendChild(document.createElement("br"));
        });
        divNode.append(textNode);

        document.getElementById("game-options-bottom").append(divNode);
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
