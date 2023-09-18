import { useDispatch } from "react-redux";

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

import TextField from "react-md/lib/TextFields";
import Radio from "react-md/lib/SelectionControls/Radio";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import FontIcon from "react-md/lib/FontIcons";

import ImageBox from "components/editors/ImageBox";
import InfopointsTable from "components/editors/InfopointsTable";
import HelpIcon from "components/help-icon";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

import { File as IndihuFile, GameQuizAnswer, GameQuizScreen } from "models";
import { AppDispatch } from "store/store";

import { setDialog } from "actions/dialog-actions";
import { updateScreenData } from "actions/expoActions/screen-actions-typed";
import { helpIconText } from "enums/text";
import { DialogType } from "components/dialogs/dialog-types";
import cx from "classnames";

const titles = [
  "Varianta A",
  "Varianta B",
  "Varianta C",
  "Varianta D",
  "Varianta E",
  "Varianta F",
  "Varianta G",
  "Varianta H",
];

// - - -

type AnswerItemProps = {
  currAnswer: GameQuizAnswer;
  currAnswerIndex: number;
  activeScreen: GameQuizScreen;
  currAnswerImage: IndihuFile | null;
  setCurrAnswerImage: (image: IndihuFile) => void;
};

const AnswerItem = ({
  currAnswer,
  currAnswerIndex,
  activeScreen,
  currAnswerImage,
  setCurrAnswerImage,
}: AnswerItemProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Accordion
      sx={{
        "& .MuiAccordionSummary-content": { overflowX: "auto" },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Button>
            <Icon useMaterialUiIcon name="expand_more" />
          </Button>
        }
        id={`accordion-${currAnswerIndex}`}
      >
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col">
            <Button
              className={currAnswerIndex === 0 ? "invisible" : undefined}
              onClick={(e) => {
                e.stopPropagation();
                if (currAnswerIndex === 0) {
                  return;
                }

                const prevAnswerIndex = currAnswerIndex - 1;
                dispatch(
                  updateScreenData({
                    answers: activeScreen.answers.map((ans, idx) =>
                      idx === prevAnswerIndex
                        ? activeScreen.answers[currAnswerIndex]
                        : idx === currAnswerIndex
                        ? activeScreen.answers[prevAnswerIndex]
                        : ans
                    ),
                  })
                );
              }}
            >
              <Icon useMaterialUiIcon name="keyboard_arrow_up" />
            </Button>

            <Button
              className={
                currAnswerIndex === activeScreen.answers.length - 1
                  ? "invisible"
                  : undefined
              }
              onClick={(e) => {
                e.stopPropagation();
                if (currAnswerIndex === activeScreen.answers.length - 1) {
                  return;
                }

                const nextAnswerIndex = currAnswerIndex + 1;
                dispatch(
                  updateScreenData({
                    answers: activeScreen.answers.map((ans, idx) =>
                      idx === currAnswerIndex
                        ? activeScreen.answers[nextAnswerIndex]
                        : idx === nextAnswerIndex
                        ? activeScreen.answers[currAnswerIndex]
                        : ans
                    ),
                  })
                );
              }}
            >
              <Icon useMaterialUiIcon name="keyboard_arrow_down" />
            </Button>
          </div>

          <div className="w-full flex justify-center items-center">
            <h2
              className={cx("text-center mb-0", {
                "font-bold": currAnswer.correct,
                "font-thin": !currAnswer.correct,
              })}
            >
              {titles[currAnswerIndex]}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center">
              {activeScreen.answersType === "MULTIPLE_CHOICE" ? (
                <Checkbox
                  id={`screen-game-options-answer-${currAnswerIndex}`}
                  name={`checkboxStateGameOptions-${currAnswerIndex}`}
                  label="správná odpověd"
                  checked={!!activeScreen.answers[currAnswerIndex]?.correct}
                  onChange={(newValue: boolean) =>
                    dispatch(
                      updateScreenData({
                        answers: activeScreen.answers.map((ans, idx) =>
                          currAnswerIndex === idx
                            ? { ...ans, correct: newValue }
                            : ans
                        ),
                      })
                    )
                  }
                />
              ) : (
                <Radio
                  id={`screen-game-options-answer-${currAnswerIndex}`}
                  name={`radioStateGameOptions-${currAnswerIndex}`}
                  className="radio-option"
                  label="správná odpověd"
                  value={currAnswerIndex}
                  checked={currAnswer.correct}
                  onClick={() =>
                    dispatch(
                      updateScreenData({
                        answers: activeScreen?.answers?.map((ans, idx) =>
                          currAnswerIndex === idx
                            ? { ...ans, correct: true }
                            : { ...ans, correct: false }
                        ),
                      })
                    )
                  }
                />
              )}

              <HelpIcon
                label={helpIconText.EDITOR_GAME_OPTIONS_CORRECT_ANSWER}
                id="editor-game-options-correct-answer"
              />
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                const answersLength = activeScreen.answers.length;
                if (answersLength <= 3) {
                  dispatch(
                    setDialog(DialogType.InfoDialog, {
                      noStornoButton: false,
                      title: "Nelze smazat více možností!",
                      content: (
                        <div>
                          <p>
                            Bol dosiahnutý minimálny počet povolených odpovedí a
                            to tri.
                          </p>
                        </div>
                      ),
                    })
                  );
                  return;
                }

                dispatch(
                  setDialog(DialogType.ConfirmDialog, {
                    title: <FontIcon className="color-black">delete</FontIcon>,
                    text: "Opravdu chcete odstránit túto možnosť? Akcia je nevratná!",
                    onSubmit: () =>
                      dispatch(
                        updateScreenData({
                          answers: activeScreen.answers.filter(
                            (ans, idx) => currAnswerIndex !== idx
                          ),
                        })
                      ),
                  })
                );
              }}
            >
              <Icon useMaterialUiIcon name="close" />
            </Button>
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <div className="flex flex-col justify-center items-center gap-6 xl:flex-row xl:justify-evenly xl:items-start xl:gap-0">
          {/* Answer left administration */}
          <div className="max-w-full flex flex-col gap-4 mb-8">
            {activeScreen.quizType !== "ONLY_TEXT" && (
              <ImageBox
                title="Doprovodný obrázek"
                image={currAnswerImage}
                setImage={setCurrAnswerImage}
                onDelete={() =>
                  dispatch(
                    updateScreenData({
                      answers: activeScreen.answers?.map((ans, idx) =>
                        currAnswerIndex === idx
                          ? {
                              ...ans,
                              image: null,
                              imageOrigData: null,
                            }
                          : ans
                      ),
                    })
                  )
                }
                onLoad={(width: number, height: number) =>
                  dispatch(
                    updateScreenData({
                      answers: activeScreen.answers?.map((ans, idx) =>
                        currAnswerIndex === idx
                          ? {
                              ...ans,
                              imageOrigData: { width, height },
                            }
                          : ans
                      ),
                    })
                  )
                }
                helpIconLabel={helpIconText.EDITOR_GAME_OPTIONS_ANSWER_IMAGE}
                helpIconId="editor-game-options-answer-image"
                // TODO - add support for infopoints
                infopoints={
                  activeScreen.answers[currAnswerIndex]?.infopoints ?? []
                }
                onInfopointMove={(
                  movedInfopointIndex,
                  newLeftPosition,
                  newTopPosition
                ) => {
                  dispatch(
                    updateScreenData({
                      answers: activeScreen.answers.map((ans, ansIndex) =>
                        currAnswerIndex === ansIndex
                          ? {
                              ...ans,
                              infopoints: ans.infopoints?.map((inf, infIndex) =>
                                movedInfopointIndex === infIndex
                                  ? {
                                      ...inf,
                                      left: newLeftPosition,
                                      top: newTopPosition,
                                    }
                                  : inf
                              ),
                            }
                          : ans
                      ),
                    })
                  );
                }}
              />
            )}

            {activeScreen.quizType !== "ONLY_IMAGES" && (
              <div
                className={cx("flex", {
                  "w-[450px] max-w-full overflow-auto":
                    activeScreen.quizType === "ONLY_TEXT",
                })}
              >
                <TextField
                  id={`game-options-textfield-text-${currAnswerIndex}`}
                  label="Text odpovědi"
                  rows={3}
                  defaultValue={currAnswer.text}
                  onChange={(newText: string) =>
                    dispatch(
                      updateScreenData({
                        answers: activeScreen.answers?.map((ans, idx) =>
                          currAnswerIndex === idx
                            ? { ...ans, text: newText }
                            : ans
                        ),
                      })
                    )
                  }
                />
                <HelpIcon
                  label={helpIconText.EDITOR_GAME_OPTIONS_TEXT}
                  id="editor-game-options-text"
                />
              </div>
            )}
          </div>

          {/* Answer infopoints */}
          {!currAnswer.image && (
            <div className="hidden xl:block mt-4 min-w-[50%] h-1" />
          )}

          {currAnswer.image && activeScreen.quizType !== "ONLY_TEXT" && (
            <InfopointsTable
              key={`answers-infopoint-table-${currAnswerIndex}`}
              infopoints={
                activeScreen.answers[currAnswerIndex].infopoints ?? []
              }
              onInfopointAdd={async (dialogFormData) => {
                dispatch(
                  updateScreenData({
                    answers: activeScreen.answers.map((ans, idx) =>
                      currAnswerIndex === idx
                        ? {
                            ...ans,
                            infopoints: [
                              ...(ans.infopoints ?? []),
                              // Add new infopoint
                              {
                                ...dialogFormData,
                                top: 17,
                                left: 17,
                              },
                            ],
                          }
                        : ans
                    ),
                  })
                );
              }}
              onInfopointEdit={async (infopointIndexToEdit, dialogFormData) => {
                dispatch(
                  updateScreenData({
                    answers: activeScreen.answers.map((ans, idx) =>
                      currAnswerIndex === idx
                        ? {
                            ...ans,
                            infopoints: ans.infopoints?.map((inf, infIndex) =>
                              infIndex === infopointIndexToEdit
                                ? { ...inf, ...dialogFormData }
                                : { ...inf }
                            ),
                          }
                        : ans
                    ),
                  })
                );
              }}
              onInfopointDelete={(infopointIndexToDelete) => {
                dispatch(
                  updateScreenData({
                    answers: activeScreen.answers.map((ans, idx) =>
                      currAnswerIndex === idx
                        ? {
                            ...ans,
                            infopoints: ans.infopoints?.filter(
                              (inf, infIndex) =>
                                infopointIndexToDelete !== infIndex
                            ),
                          }
                        : ans
                    ),
                  })
                );
              }}
            />
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default AnswerItem;
