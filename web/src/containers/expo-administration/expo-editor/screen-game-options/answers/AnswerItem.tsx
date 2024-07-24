import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import EditableTextField from "components/editable-text-field/EditableTextField";

import TextField from "react-md/lib/TextFields";
import Radio from "react-md/lib/SelectionControls/Radio";
import Checkbox from "react-md/lib/SelectionControls/Checkbox";
import FontIcon from "react-md/lib/FontIcons";

import ImageBox from "components/editors/ImageBox";
import InfopointsTable from "components/editors/InfopointsTable";
import HelpIcon from "components/help-icon";

import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Models
import { File as IndihuFile, GameQuizAnswer, GameQuizScreen } from "models";
import { AppDispatch } from "store/store";

// Actions and utils
import { setDialog } from "actions/dialog-actions";
import { updateScreenData } from "actions/expoActions/screen-actions";
import { DialogType } from "components/dialogs/dialog-types";
import cx from "classnames";

const indexToVariantChar = ["A", "B", "C", "D", "E", "F", "G", "H"];

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
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.gameQuizScreen",
  });

  return (
    <Accordion
      sx={{
        "& .MuiAccordionSummary-content": { overflowX: "auto" },
      }}
    >
      <AccordionSummary
        id={`accordion-${currAnswerIndex}`}
        expandIcon={
          <Button>
            <Icon
              useMaterialUiIcon
              name="close"
              tooltip={{
                id: "answer-close-icon-tooltip",
                content: t("closeAnswerTooltip"),
                variant: "dark",
              }}
            />
          </Button>
        }
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper": {
            visibility: "hidden",
            "&.Mui-expanded": {
              visibility: "visible",
              transform: "none",
            },
          },
        }}
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

          <div className="mx-4 w-full flex justify-center items-center">
            <div>
              <EditableTextField
                id={`answer-${currAnswerIndex}-editable-textfield`}
                value={
                  currAnswer.customUserLabel ??
                  `${t("variant")} ${indexToVariantChar[currAnswerIndex]}`
                }
                onCommit={(newCustomLabel: string) =>
                  dispatch(
                    updateScreenData({
                      answers: activeScreen.answers?.map((ans, ansIdx) =>
                        ansIdx === currAnswerIndex
                          ? { ...ans, customUserLabel: newCustomLabel }
                          : ans
                      ),
                    })
                  )
                }
                textComponent="h2"
                textComponentClassName={cx(
                  "whitespace-nowrap text-center mb-0",
                  {
                    "font-bold": currAnswer.correct,
                    "font-thin": !currAnswer.correct,
                  }
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center">
              {activeScreen.answersType === "MULTIPLE_CHOICE" ? (
                <Checkbox
                  id={`screen-game-options-answer-${currAnswerIndex}`}
                  name={`checkboxStateGameOptions-${currAnswerIndex}`}
                  label={t("correctAnswer")}
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
                  label={t("correctAnswer")}
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
                label={t("correctAnswerTooltip")}
                id="editor-game-options-correct-answer"
                className="!flex"
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
              <Icon
                useMaterialUiIcon
                name="delete"
                iconStyle={{ fontSize: "24px" }}
                tooltip={{
                  id: "delete-answer-icon-tooltip",
                  content: t("deleteAnswerTooltip"),
                  variant: "dark",
                }}
              />
            </Button>
          </div>
        </div>
      </AccordionSummary>

      {/* Accordion Details */}
      <AccordionDetails>
        <div className="flex flex-col justify-center items-center gap-6 xl:flex-row xl:justify-evenly xl:items-start xl:gap-0">
          {/* Answer left administration */}
          <div className="max-w-full flex flex-col gap-4 mb-8">
            {activeScreen.quizType !== "ONLY_TEXT" && (
              <ImageBox
                title={t("answerImageLabel")}
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
                helpIconLabel={t("answerImageTooltip")}
                helpIconId="editor-game-options-answer-image"
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
                  label={t("answerTextLabel")}
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
                  label={t("answerTextTooltip")}
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
              onInfopointAdd={(dialogFormData) => {
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
              onInfopointEdit={(infopointIndexToEdit, dialogFormData) => {
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
              onInfopointAlwaysVisibleChange={(
                infopointIndexToEdit: number,
                newIsAlwaysVisibleValue: boolean
              ) => {
                dispatch(
                  updateScreenData({
                    answers: activeScreen.answers?.map((ans, ansIdx) =>
                      currAnswerIndex === ansIdx
                        ? {
                            ...ans,
                            infopoints: ans.infopoints?.map((ip, ipIndex) =>
                              ipIndex === infopointIndexToEdit
                                ? {
                                    ...ip,
                                    alwaysVisible: newIsAlwaysVisibleValue,
                                  }
                                : { ...ip }
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
