import {
  Dispatch,
  SetStateAction,
  useMemo,
  Fragment,
  useCallback,
} from "react";
import { Checkbox, Radio } from "@mui/material";

// Hooks
import { useTranslation } from "react-i18next";
import { useMediaDevice } from "context/media-device-provider/media-device-provider";
import useResizeObserver from "hooks/use-resize-observer";

// Components
import { Grid } from "@mui/material";
import AnchorInfopoint from "components/infopoint/components/anchor-infopoint";
import TooltipInfoPoint from "components/infopoint/components/tooltip-infopoint/TooltipInfopoint";

// Types
import {
  GameQuizAnswer,
  GameQuizAnswerDisplayType,
  GameQuizType,
} from "models";
import { InfopointStatusObject } from "components/infopoint/useTooltipInfopoint";

// Utils
import cx from "classnames";
import { calculateObjectFit } from "utils/object-fit";
import {
  getCheckboxUnmarkedIcon,
  getCheckboxMarkedIcon,
  getRadioUnmarkedIcon,
  getRadioMarkedIcon,
} from "./utils";
import { calculateInfopointPositionByImageBoxSize } from "utils/infopoint-utils";

// - - - - - -

type ImageTextAnswerProps = {
  answer: GameQuizAnswer;
  answerIndex: number;
  preloadedImgSrc: string | undefined;
  isGameFinished: boolean;
  isMultipleChoice: boolean;
  quizType: GameQuizType;
  answersTextDisplayType: GameQuizAnswerDisplayType;

  isAnswerMarked: boolean;
  setMarkedAnswers: Dispatch<SetStateAction<boolean[]>>;

  // Infopoint stuff
  infopointStatusMap: Record<string, InfopointStatusObject>;
  setInfopointStatusMap: Dispatch<
    SetStateAction<Record<string, InfopointStatusObject>>
  >;
};

const ImageTextAnswer = ({
  answer,
  answerIndex,
  preloadedImgSrc,
  isGameFinished,
  isMultipleChoice,
  isAnswerMarked,
  setMarkedAnswers,
  quizType,
  answersTextDisplayType,
  infopointStatusMap,
  setInfopointStatusMap,
}: ImageTextAnswerProps) => {
  const { t } = useTranslation("view-screen");
  const { isSm, isMobileLandscape } = useMediaDevice();

  // - - - Data derived from props

  const answerImageOrigData = useMemo(
    () => answer.imageOrigData ?? { width: 0, height: 0 },
    [answer.imageOrigData]
  );

  // - - - Callbacks - - -

  const handleMarkAnswer = useCallback(() => {
    if (isGameFinished) {
      return;
    }

    if (isMultipleChoice) {
      setMarkedAnswers((prevMarks) =>
        prevMarks.map((mark, markIndex) =>
          markIndex === answerIndex ? !mark : mark
        )
      );
    }

    if (!isMultipleChoice) {
      setMarkedAnswers((prevMarks) =>
        prevMarks.map((mark, markIndex) =>
          markIndex === answerIndex ? !mark : false
        )
      );
    }
  }, [answerIndex, isGameFinished, isMultipleChoice, setMarkedAnswers]);

  // - - - Infopoints stuff - - -

  const [imageContainerRef, imageContainerSize] =
    useResizeObserver<HTMLImageElement>();

  const {
    width: containedImageWidth,
    height: containedImageHeight,
    left: fromLeftWidth,
    top: fromTopHeight,
  } = useMemo(
    () =>
      calculateObjectFit({
        type: "contain",
        parent: imageContainerSize,
        child: answerImageOrigData,
      }),
    [answerImageOrigData, imageContainerSize]
  );

  return (
    <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
      <div
        className={cx(
          "relative h-full flex flex-col gap-4 self-stretch p-4 md:p-10 border-4 border-solid border-transparent rounded-md bg-transparent hover:bg-light-gray/10 cursor-pointer",
          {
            "!p-2": quizType === "ONLY_IMAGES",
            "!p-3": quizType === "ONLY_TEXT",
            "border-gray": !isAnswerMarked && !isGameFinished,
            "border-blue !bg-[#3d7eca4d]": isAnswerMarked && !isGameFinished,
            "border-success":
              !isAnswerMarked && isGameFinished && answer.correct,
            "border-success !bg-[#3dca864d]":
              isAnswerMarked && isGameFinished && answer.correct,
            "border-danger":
              !isAnswerMarked && isGameFinished && !answer.correct,
            "border-danger !bg-[#e33d514d]":
              isAnswerMarked && isGameFinished && !answer.correct,
          }
        )}
        onClick={handleMarkAnswer}
      >
        {/* A) Render contained image + its infopoints (when allowed) */}
        {(quizType === "TEXT_IMAGES" || quizType === "ONLY_IMAGES") && (
          <div
            className={cx("w-full relative", {
              "h-[200px]": isSm || isMobileLandscape,
              "h-[300px]": !isSm && !isMobileLandscape,
            })}
          >
            <img
              ref={imageContainerRef}
              src={preloadedImgSrc}
              alt="quiz-image"
              className="w-full h-full object-contain"
            />

            {/* Infopoints */}
            {answer.infopoints?.map((infopoint, infopointIndex) => {
              const infopointPosition = {
                left: infopoint.left,
                top: infopoint.top,
              };
              const imgBoxSize = {
                width: answerImageOrigData.width,
                height: answerImageOrigData.height,
              };
              const imgViewSize = {
                width: containedImageWidth,
                height: containedImageHeight,
              };

              const { left, top } = calculateInfopointPositionByImageBoxSize(
                infopointPosition,
                imgBoxSize,
                imgViewSize
              );

              const adjustedLeft = fromLeftWidth + left;
              const adjustedTop = fromTopHeight + top;

              return (
                <Fragment
                  key={`quiz-infopoint-anchor-${answerIndex}-${infopointIndex}`}
                >
                  <AnchorInfopoint
                    id={`quiz-infopoint-${answerIndex}-${infopointIndex}`}
                    left={adjustedLeft}
                    top={adjustedTop}
                    infopoint={infopoint}
                  />
                  <TooltipInfoPoint
                    key={`quiz-infopoint-tooltip-${answerIndex}-${infopointIndex}`}
                    id={`quiz-infopoint-${answerIndex}-${infopointIndex}`}
                    infopoint={infopoint}
                    infopointStatusMap={infopointStatusMap}
                    setInfopointStatusMap={setInfopointStatusMap}
                    primaryKey={answerIndex.toString()}
                    secondaryKey={infopointIndex.toString()}
                  />
                </Fragment>
              );
            })}
          </div>
        )}

        {/* B) Render answer row - text with checkbox / radio */}
        {(quizType === "TEXT_IMAGES" || quizType === "ONLY_TEXT") && (
          <div
            style={{ flex: 1 }}
            className="w-full flex justify-center items-center text-white"
          >
            {isMultipleChoice && (
              <Checkbox
                color="primary"
                size="small"
                checked={isAnswerMarked}
                sx={{ color: "white" }}
                // NOTE: Icon when unchecked
                icon={getCheckboxUnmarkedIcon(isGameFinished, answer.correct)}
                // NOTE: Icon when checked
                checkedIcon={getCheckboxMarkedIcon(
                  isGameFinished,
                  answer.correct
                )}
              />
            )}

            {!isMultipleChoice && (
              <Radio
                color="primary"
                size="small"
                checked={isAnswerMarked}
                sx={{ color: "white" }}
                // NOTE: Icon when unchecked
                icon={getRadioUnmarkedIcon(isGameFinished, answer.correct)}
                // NOTE: Icon when checked
                checkedIcon={getRadioMarkedIcon(isGameFinished, answer.correct)}
              />
            )}

            {/* B1) Text itself */}
            {!isGameFinished &&
            answersTextDisplayType === "QUIZ_TEXT_AFTER_EVALUATION" &&
            quizType === "TEXT_IMAGES" ? (
              <div className="italic pl-2 pr-4 text-start">
                {t("game-quiz.answerTextWhenDisplayNotAllowed")}
              </div>
            ) : answer.text === "" ? (
              <div className="italic pl-2 pr-4 text-start">
                {t("game-quiz.missingAnswerText")}
              </div>
            ) : (
              <div className="pl-2 pr-4 text-start">{answer.text}</div>
            )}
          </div>
        )}

        {/* Icon badges, top right corner */}
        {quizType === "ONLY_IMAGES" && isGameFinished && (
          <div className="absolute top-0 right-0 flex translate-x-1/2 -translate-y-1/2">
            {getRadioUnmarkedIcon(isGameFinished, answer.correct, {
              fontSize: "24px",
            })}
          </div>
        )}
      </div>
    </Grid>
  );
};

export default ImageTextAnswer;
