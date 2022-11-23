import { connect } from "react-redux";
import { compose } from "recompose";
import classNames from "classnames";
import TextField from "react-md/lib/TextFields";
import Radio from "react-md/lib/SelectionControls/Radio";
import { map } from "lodash";

import Image from "../image";
import HelpIcon from "../../help-icon";

import { setDialog } from "../../../actions/dialog-actions";
import { getFileById } from "../../../actions/file-actions";
import { updateScreenData } from "../../../actions/expoActions";

import { helpIconText } from "../../../enums/text";

const titles = ["Varianta A", "Varianta B", "Varianta C"];

const Answers = ({ activeScreen, getFileById, updateScreenData }) => {
  const image1 = activeScreen.answers[0].image
    ? getFileById(activeScreen.answers[0].image)
    : null;
  const image2 = activeScreen.answers[1].image
    ? getFileById(activeScreen.answers[1].image)
    : null;
  const image3 = activeScreen.answers[2].image
    ? getFileById(activeScreen.answers[2].image)
    : null;

  const setImage1 = (image) => {
    updateScreenData({
      answers: map(activeScreen.answers, (a, i) =>
        i === 0 ? { ...a, image: image.id } : a
      ),
    });
  };
  const setImage2 = (image) => {
    updateScreenData({
      answers: map(activeScreen.answers, (a, i) =>
        i === 1 ? { ...a, image: image.id } : a
      ),
    });
  };
  const setImage3 = (image) => {
    updateScreenData({
      answers: map(activeScreen.answers, (a, i) =>
        i === 2 ? { ...a, image: image.id } : a
      ),
    });
  };

  return (
    <div className="container-big container-tabMenu">
      <div className="screen">
        <div className="game-options-answers">
          {map(activeScreen.answers, (answer, i) => (
            <div key={i} className="answer">
              <div className="flex-row flex-centered">
                <h2
                  className={classNames({
                    "text-bold": answer.correct,
                    "text-thin": !answer.correct,
                  })}
                >
                  {titles[i]}
                </h2>
              </div>
              <div className="flex-row-nowrap flex-centered">
                <Radio
                  id={`screen-game-options-answer-${i}`}
                  name={`radioStateGameOptions-${i}`}
                  className="radio-option"
                  label="správná odpověd"
                  value={i}
                  checked={answer.correct}
                  onClick={() =>
                    updateScreenData({
                      answers: map(activeScreen.answers, (a, j) =>
                        i === j
                          ? { ...a, correct: true }
                          : { ...a, correct: false }
                      ),
                    })
                  }
                />
                <HelpIcon
                  {...{
                    label: helpIconText.EDITOR_GAME_OPTIONS_CORRECT_ANSWER,
                    id: "editor-game-options-correct-answer",
                  }}
                />
              </div>
              <Image
                title="Doprovodný obrázek"
                image={i === 0 ? image1 : i === 1 ? image2 : image3}
                setImage={i === 0 ? setImage1 : i === 1 ? setImage2 : setImage3}
                onDelete={() =>
                  updateScreenData({
                    answers: map(activeScreen.answers, (a, j) =>
                      i === j ? { ...a, image: null, imageOrigData: null } : a
                    ),
                  })
                }
                onLoad={(width, height) =>
                  updateScreenData({
                    answers: map(activeScreen.answers, (a, j) =>
                      i === j
                        ? {
                            ...a,
                            imageOrigData: {
                              width,
                              height,
                            },
                          }
                        : a
                    ),
                  })
                }
                helpIconLabel={helpIconText.EDITOR_GAME_OPTIONS_ANSWER_IMAGE}
                id="editor-game-options-answer-image"
              />
              <div className="flex-row-nowrap margin-top">
                <TextField
                  id={`game-options-textfield-text-${i}`}
                  label="Text odpovědi"
                  defaultValue={answer.text}
                  onChange={(value) =>
                    updateScreenData({
                      answers: map(activeScreen.answers, (a, j) =>
                        i === j ? { ...a, text: value } : a
                      ),
                    })
                  }
                  rows={3}
                />
                <HelpIcon
                  {...{
                    label: helpIconText.EDITOR_GAME_OPTIONS_TEXT,
                    id: "editor-game-options-text",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default compose(
  connect(null, {
    setDialog,
    getFileById,
    updateScreenData,
  })
)(Answers);
