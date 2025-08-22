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
  Size,
} from "models";
import { InfopointStatusObject } from "components/infopoint/useTooltipInfopoint";

// Utils
import cx from "classnames";
import { calculateObjectFit } from "utils/object-fit";
import {
  getAnswerCheckboxCheckedIcon,
  getAnswerCheckboxUncheckedIcon,
  getAnswerRadioCheckedIcon,
  getAnswerRadioUncheckedIcon,
} from "./utils";
import { calculateInfopointPositionByImageBoxSize } from "utils/infopoint-utils";

// - - - - - -

type ImageTextAnswerProps = {
  answer: GameQuizAnswer;
  answerIndex: number;
  answerImageOrigData?: Size;
  preloadedImgSrc: string;
  isGameFinished: boolean;
  isMultipleChoice: boolean;
  markedAnswers: boolean[];
  setMarkedAnswers: Dispatch<SetStateAction<boolean[]>>;
  quizType: GameQuizType;
  answersTextDisplayType: GameQuizAnswerDisplayType;

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
  markedAnswers,
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

  const handleChooseAnswer = useCallback(() => {
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
    <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
      <div
        className={cx(
          "flex flex-col gap-4 self-stretch p-4 md:p-10 border-4 border-solid border-transparent rounded-md bg-transparent hover:bg-light-gray/10 cursor-pointer relative",
          {
            "!p-2": quizType === "ONLY_IMAGES",
            "!p-3": quizType === "ONLY_TEXT",
            "border-blue !bg-[#3d7eca4d]":
              !isGameFinished && markedAnswers[answerIndex],
            "border-danger !bg-[#e33d514d]":
              isGameFinished && markedAnswers[answerIndex] && !answer.correct,
            "border-success !bg-[#3dca864d]":
              isGameFinished && markedAnswers[answerIndex] && answer.correct,
          }
        )}
        onClick={handleChooseAnswer}
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
        {(quizType === "ONLY_TEXT" || quizType === "TEXT_IMAGES") && (
          <div className="w-full flex justify-center items-center text-white">
            {isMultipleChoice && (
              <Checkbox
                color="primary"
                size="small"
                checked={markedAnswers[answerIndex]}
                sx={{ color: "white" }}
                // NOTE: Icon when unchecked
                icon={getAnswerCheckboxUncheckedIcon(
                  isGameFinished,
                  answer.correct
                )}
                // NOTE: Icon when checked
                checkedIcon={getAnswerCheckboxCheckedIcon(
                  isGameFinished,
                  answer.correct
                )}
              />
            )}

            {!isMultipleChoice && (
              <Radio
                color="primary"
                size="small"
                checked={markedAnswers[answerIndex]}
                sx={{ color: "white" }}
                // NOTE: Icon when unchecked
                icon={getAnswerRadioUncheckedIcon(
                  isGameFinished,
                  answer.correct
                )}
                // NOTE: Icon when checked
                checkedIcon={getAnswerRadioCheckedIcon(
                  isGameFinished,
                  answer.correct
                )}
              />
            )}

            {/* B1) Text itself */}
            {quizType === "TEXT_IMAGES" &&
            !isGameFinished &&
            answersTextDisplayType === "QUIZ_TEXT_AFTER_EVALUATION" ? (
              <div className="italic pl-2 pr-4 text-start">
                {t("game-quiz.answerTextWhenDisplayNotAllowed")}
              </div>
            ) : (
              <div className="pl-2 pr-4 text-start">{answer.text}</div>
            )}
          </div>
        )}
      </div>
    </Grid>
  );
};

export default ImageTextAnswer;
