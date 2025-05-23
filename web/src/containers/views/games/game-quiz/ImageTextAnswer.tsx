import { Dispatch, SetStateAction, useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import useResizeObserver from "hooks/use-resize-observer";

import { Checkbox, Radio } from "@mui/material";
import AnchorInfopoint from "components/infopoint/components/anchor-infopoint";
import TooltipInfoPoint from "components/infopoint/components/tooltip-infopoint/TooltipInfopoint";

import {
  GameQuizAnswer,
  GameQuizAnswerDisplayType,
  GameQuizType,
  Size,
} from "models";
import { InfopointStatusObject } from "components/infopoint/useTooltipInfopoint";

import cx from "classnames";
import { calculateObjectFit } from "utils/object-fit";
import {
  getAnswerCheckboxCheckedIcon,
  getAnswerCheckboxUncheckedIcon,
  getAnswerRadioCheckedIcon,
  getAnswerRadioUncheckedIcon,
} from "./utils";
import { calculateInfopointPositionByImageBoxSize } from "utils/infopoint-utils";
import { useMediaDevice } from "context/media-device-provider/media-device-provider";

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

  const [imageContainerRef, imageContainerSize] =
    useResizeObserver<HTMLImageElement>();

  const answerImageOrigData = useMemo(
    () => answer.imageOrigData ?? { width: 0, height: 0 },
    [answer.imageOrigData]
  );

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
    <div
      key={answerIndex}
      className={cx(
        "flex flex-col gap-4 self-stretch p-4 md:p-10 border-4 border-solid border-transparent rounded-md bg-transparent hover:bg-light-gray/10 cursor-pointer relative",
        {
          "w-[380px]": !isSm && isMobileLandscape,
          "w-[260px]": isSm || isMobileLandscape,
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
      onClick={() => {
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
      }}
    >
      {/* CONTAINED IMAGE + ITS INFOPOINTS */}
      {(quizType === "TEXT_IMAGES" || quizType === "ONLY_IMAGES") && (
        <div
          className={cx("w-full relative", {
            "h-[300px]": !isSm && !isMobileLandscape,
            "h-[200px]": isSm || isMobileLandscape,
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

      {/* TEXT + CHECKBOX / RADIO */}
      {(quizType === "ONLY_TEXT" || quizType === "TEXT_IMAGES") && (
        <div className="w-full flex gap-2 items-center text-white text-start">
          {isMultipleChoice && (
            <Checkbox
              color="primary"
              size="small"
              checked={markedAnswers[answerIndex]}
              sx={{ color: "white" }}
              // icon when unchecked
              icon={getAnswerCheckboxUncheckedIcon(
                isGameFinished,
                answer.correct
              )}
              // icon when checked
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
              // icon when unchecked
              icon={getAnswerRadioUncheckedIcon(isGameFinished, answer.correct)}
              // icon when checked
              checkedIcon={getAnswerRadioCheckedIcon(
                isGameFinished,
                answer.correct
              )}
            />
          )}

          {/* TEXT */}
          {quizType === "TEXT_IMAGES" &&
          !isGameFinished &&
          answersTextDisplayType === "QUIZ_TEXT_AFTER_EVALUATION" ? (
            <div className="italic">
              {t("game-quiz.answerTextWhenDisplayNotAllowed")}
            </div>
          ) : (
            <div>{answer.text}</div>
          )}
        </div>
      )}

      {/* Icon badges, top right corner */}
      {(quizType === "ONLY_IMAGES" || quizType === "ONLY_TEXT") &&
        isGameFinished && (
          <div className="absolute top-0 right-0 flex translate-x-1/2 -translate-y-1/2">
            {getAnswerRadioUncheckedIcon(isGameFinished, answer.correct, {
              fontSize: "24px",
            })}
          </div>
        )}
    </div>
  );
};

export default ImageTextAnswer;
