import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

import TextField from "react-md/lib/TextFields";
import FontIcon from "react-md/lib/FontIcons";

import ImageBox from "components/editors/ImageBox";
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";
import HelpIcon from "components/help-icon";
import EditableTextField from "components/editable-text-field/EditableTextField";

// Models
import { AppDispatch } from "store/store";
import { SurveyAnswer, SurveyScreen, File as IndihuFile } from "models";

// Actions and utils
import cx from "classnames";
import { updateScreenData } from "actions/expoActions";
import { setDialog } from "actions/dialog-actions";
import { DialogType } from "components/dialogs/dialog-types";

// - - - - - -

const indexToVariantChar = ["A", "B", "C", "D", "E", "F", "G", "H"];

// - - - - - -

type SurveyAnswerItemProps = {
  currAnswer: SurveyAnswer;
  currAnswerIdx: number;
  activeScreen: SurveyScreen;
  currAnswerImageFile: IndihuFile | null;
  setCurrAnswerImageFile: (imgFile: IndihuFile) => void;
};

const SurveyAnswerItem = ({
  currAnswer,
  currAnswerIdx,
  activeScreen,
  currAnswerImageFile,
  setCurrAnswerImageFile,
}: SurveyAnswerItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  // - - - Derived variables - - -

  const surveyAnswers = useMemo(
    () => activeScreen.surveyAnswers ?? [],
    [activeScreen.surveyAnswers]
  );

  // - - - GUI - - -

  // NOTE: Should not happen
  if (surveyAnswers === undefined || surveyAnswers === null) {
    const errMsg = "Survey answers field is not defined, as its expected!";
    console.error(errMsg);
    return null;
  }

  return (
    <Accordion
      sx={{
        "& .MuiAccordionSummary-content": { overflowX: "auto" },
      }}
    >
      <AccordionSummary
        id={`accordion-summary-${currAnswerIdx}`}
        expandIcon={<CloseButton />}
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
            <MoveUpButton
              surveyAnswers={surveyAnswers}
              currAnswerIdx={currAnswerIdx}
              isSurveyScreenLocked={activeScreen.isSurveyScreenLocked ?? false}
            />
            <MoveDownButton
              surveyAnswers={surveyAnswers}
              currAnswerIdx={currAnswerIdx}
              isSurveyScreenLocked={activeScreen.isSurveyScreenLocked ?? false}
            />
          </div>

          <div className="mx-4 w-full flex justify-center items-center">
            <AnswerLabelTextField
              surveyAnswers={surveyAnswers}
              currAnswer={currAnswer}
              currAnswerIdx={currAnswerIdx}
            />
          </div>

          <div className="flex items-center gap-6">
            <DeleteButton
              surveyAnswers={surveyAnswers}
              currAnswerIdx={currAnswerIdx}
              isSurveyScreenLocked={activeScreen.isSurveyScreenLocked ?? false}
            />
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails className="flex flex-col justify-center items-center gap-6 xl:flex-row xl:justify-evenly xl:items-start xl:gap-0">
        <div className="max-w-full flex flex-col gap-4 mb-8">
          {activeScreen.surveyType !== "ONLY_TEXT" && (
            <ImageBox
              title={t("answerImageLabel")}
              image={currAnswerImageFile}
              setImage={setCurrAnswerImageFile}
              onDelete={() =>
                dispatch(
                  updateScreenData({
                    surveyAnswers: surveyAnswers.map((ans, ansIdx) =>
                      ansIdx === currAnswerIdx
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
                    surveyAnswers: surveyAnswers.map((ans, ansIdx) =>
                      ansIdx === currAnswerIdx
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
              helpIconId={`survey-answer-item-${currAnswerIdx}-img-help`}
              shouldHideSettingsPanelRightPart={
                activeScreen.isSurveyScreenLocked ?? false
              }
            />
          )}

          {activeScreen.surveyType !== "ONLY_IMAGES" && (
            <div
              className={cx("flex", {
                "w-[450px] max-w-full overflow-auto":
                  activeScreen.surveyType === "ONLY_TEXT",
              })}
            >
              <TextField
                id={`survey-answer-${currAnswerIdx}-textfield`}
                label={t("answerTextLabel")}
                rows={3}
                defaultValue={currAnswer.text}
                onChange={(newText: string) =>
                  dispatch(
                    updateScreenData({
                      surveyAnswers: surveyAnswers.map((ans, ansIdx) =>
                        ansIdx === currAnswerIdx
                          ? { ...ans, text: newText }
                          : ans
                      ),
                    })
                  )
                }
                disabled={activeScreen.isSurveyScreenLocked ?? false}
              />
              <HelpIcon
                label={t("answerTextTooltip")}
                id={`survey-answer-${currAnswerIdx}-text-help`}
              />
            </div>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default SurveyAnswerItem;

// - - - - - -

const CloseButton = () => {
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  return (
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
  );
};

// - - - - -

type MoveUpButtonProps = {
  surveyAnswers: SurveyAnswer[];
  currAnswerIdx: number;
  isSurveyScreenLocked: boolean;
};

const MoveUpButton = ({
  surveyAnswers,
  currAnswerIdx,
  isSurveyScreenLocked,
}: MoveUpButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const shouldHide = useMemo(() => currAnswerIdx === 0, [currAnswerIdx]);

  const isDisabled = useMemo(
    () => isSurveyScreenLocked,
    [isSurveyScreenLocked]
  );

  return (
    <Button
      className={shouldHide ? "invisible" : undefined}
      disabled={isDisabled}
      onClick={(e) => {
        e.stopPropagation();
        if (shouldHide || isDisabled) {
          return;
        }

        const prevAnswerIdx = currAnswerIdx - 1;

        dispatch(
          updateScreenData({
            surveyAnswers: surveyAnswers.map((ans, ansIdx) =>
              ansIdx === prevAnswerIdx
                ? surveyAnswers[currAnswerIdx]
                : ansIdx === currAnswerIdx
                ? surveyAnswers[prevAnswerIdx]
                : ans
            ),
          })
        );
      }}
    >
      <Icon useMaterialUiIcon name="keyboard_arrow_up" />
    </Button>
  );
};

// - - - - - -

type MoveDownButtonProps = {
  surveyAnswers: SurveyAnswer[];
  currAnswerIdx: number;
  isSurveyScreenLocked: boolean;
};

const MoveDownButton = ({
  surveyAnswers,
  currAnswerIdx,
  isSurveyScreenLocked,
}: MoveDownButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const shouldHide = useMemo(
    () => currAnswerIdx === surveyAnswers.length - 1,
    [currAnswerIdx, surveyAnswers.length]
  );

  const isDisabled = useMemo(
    () => isSurveyScreenLocked,
    [isSurveyScreenLocked]
  );

  return (
    <Button
      className={shouldHide ? "invisible" : undefined}
      disabled={isDisabled}
      onClick={(e) => {
        e.stopPropagation();
        if (shouldHide || isDisabled) {
          return;
        }

        const nextAnswerIdx = currAnswerIdx + 1;

        dispatch(
          updateScreenData({
            surveyAnswers: surveyAnswers.map((ans, ansIdx) =>
              ansIdx === currAnswerIdx
                ? surveyAnswers[nextAnswerIdx]
                : ansIdx === nextAnswerIdx
                ? surveyAnswers[currAnswerIdx]
                : ans
            ),
          })
        );
      }}
    >
      <Icon useMaterialUiIcon name="keyboard_arrow_down" />
    </Button>
  );
};

// - - - - - -

type AnswerLabelTextFieldProps = {
  surveyAnswers: SurveyAnswer[];
  currAnswer: SurveyAnswer;
  currAnswerIdx: number;
};

const AnswerLabelTextField = ({
  surveyAnswers,
  currAnswer,
  currAnswerIdx,
}: AnswerLabelTextFieldProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  const actualValue = useMemo(() => {
    const backup = `${t("variant")} ${indexToVariantChar[currAnswerIdx]}`;
    return currAnswer.customUserLabel ?? backup;
  }, [currAnswer.customUserLabel, currAnswerIdx, t]);

  return (
    <EditableTextField
      id={`survey-answer-${currAnswerIdx}-editable-textfield`}
      value={actualValue}
      onCommit={(newCustomLabel: string) => {
        dispatch(
          updateScreenData({
            surveyAnswers: surveyAnswers.map((ans, ansIdx) =>
              ansIdx === currAnswerIdx
                ? { ...ans, customUserLabel: newCustomLabel }
                : ans
            ),
          })
        );
      }}
      textComponent="h2"
      textComponentClassName={cx(
        "whitespace-nowrap text-center mb-0 font-normal"
      )}
    />
  );
};

// - - - - - -

type DeleteButtonProps = {
  surveyAnswers: SurveyAnswer[];
  currAnswerIdx: number;
  isSurveyScreenLocked: boolean;
};

const DeleteButton = ({
  surveyAnswers,
  currAnswerIdx,
  isSurveyScreenLocked,
}: DeleteButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  const isDisabled = useMemo(
    () => isSurveyScreenLocked,
    [isSurveyScreenLocked]
  );

  return (
    <Button
      disabled={isDisabled}
      onClick={(e) => {
        e.stopPropagation();

        const answersLength = surveyAnswers.length;

        if (answersLength <= 3) {
          const dialogErrTitle = t(
            "deleteAnswerDialog.titleErrorLessThanThree"
          );

          dispatch(
            setDialog(DialogType.InfoDialog, {
              noStornoButton: false,
              title: dialogErrTitle,
              content: (
                <div>
                  <p>{t("deleteAnswerDialog.textErrorLessThanThree")}</p>
                </div>
              ),
            })
          );

          return;
        }

        dispatch(
          setDialog(DialogType.ConfirmDialog, {
            title: <FontIcon className="color-black">delete</FontIcon>,
            text: t("deleteAnswerDialog.textConfirm"),
            onSubmit: () => {
              dispatch(
                updateScreenData({
                  surveyAnswers: surveyAnswers.filter(
                    (_, ansIdx) => ansIdx !== currAnswerIdx
                  ),
                })
              );
            },
          })
        );
      }}
    >
      <Icon
        useMaterialUiIcon
        name="delete"
        iconStyle={{ fontSize: "24px" }}
        tooltip={{
          id: "delete-survey-answer-icon-tooltip",
          content: t("deleteAnswerTooltip"),
          variant: "dark",
        }}
      />
    </Button>
  );
};
