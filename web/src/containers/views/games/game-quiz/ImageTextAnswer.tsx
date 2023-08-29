import { Dispatch, SetStateAction, useMemo } from "react";
import useElementSize from "hooks/element-size-hook";

import { Checkbox, Radio } from "@mui/material";
import ScreenAnchorInfopoint from "components/infopoint/ScreenAnchorInfopoint";
import TooltipInfoPoint from "components/infopoint/TooltipInfopoint";

import { GameQuizAnswer } from "models";
import { InfopointStatusObject } from "components/infopoint/parseScreenMaps";

import cx from "classnames";
import { calculateObjectFit } from "utils/object-fit";
import { getAnswerCheckboxIcon, getAnswerRadioIcon } from "./utils";

type ImageTextAnswerProps = {
  answer: GameQuizAnswer;
  answerIndex: number;
  preloadedImgSrc: string;
  isFinished: boolean;
  isMultipleChoice: boolean;
  markedAnswers: boolean[];
  setMarkedAnswers: Dispatch<SetStateAction<boolean[]>>;
  quizType: "ONLY_TEXT" | "ONLY_IMAGES" | "TEXT_IMAGES";

  // Infopoint stuff
  infopointOpenStatusMap: Record<string, InfopointStatusObject>;
  setInfopointOpenStatusMap: Dispatch<
    SetStateAction<Record<string, InfopointStatusObject>>
  >;
};

const ImageTextAnswer = ({
  answer,
  answerIndex,
  preloadedImgSrc,
  isFinished,
  isMultipleChoice,
  markedAnswers,
  setMarkedAnswers,
  quizType,
  infopointOpenStatusMap,
  setInfopointOpenStatusMap,
}: ImageTextAnswerProps) => {
  const [imageContainerRef, imageContainerSize] =
    useElementSize<HTMLImageElement>();

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
        "w-[380px] flex flex-col gap-4 self-stretch p-4 md:p-10 border-4 border-solid border-transparent rounded-md bg-transparent hover:bg-light-gray/10 cursor-pointer relative",
        {
          "!p-2": quizType === "ONLY_IMAGES",
          "!p-3": quizType === "ONLY_TEXT",
          "border-blue !bg-[#3d7eca4d]":
            !isFinished && markedAnswers[answerIndex],
          "border-danger !bg-[#e33d514d]":
            isFinished && markedAnswers[answerIndex] && !answer.correct,
          "border-success !bg-[#3dca864d]":
            isFinished && markedAnswers[answerIndex] && answer.correct,
        }
      )}
      onClick={() => {
        if (isFinished) {
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
        <div className="w-full h-[300px] relative">
          <img
            ref={imageContainerRef}
            src={preloadedImgSrc}
            alt="quiz-image"
            className="w-full h-full object-contain"
          />

          {/* Infopoints */}
          {answer.infopoints?.map((infopoint, infopointIndex) => {
            // Percentage when choosing infopoints in administrative
            const origLeftPercentage =
              infopoint.left / (answerImageOrigData.width / 100);
            const origTopPercentage =
              infopoint.top / (answerImageOrigData.height / 100);

            const leftPosition =
              fromLeftWidth + (containedImageWidth / 100) * origLeftPercentage;
            const topPosition =
              fromTopHeight + (containedImageHeight / 100) * origTopPercentage;

            return (
              <ScreenAnchorInfopoint
                key={`quiz-infopoint-anchor-${answerIndex}-${infopointIndex}`}
                id={`quiz-infopoint-${answerIndex}-${infopointIndex}`}
                top={topPosition}
                left={leftPosition}
                infopoint={infopoint}
              />
            );
          })}

          {answer.infopoints?.map((infopoint, infopointIndex) => {
            return (
              <TooltipInfoPoint
                key={`quiz-infopoint-tooltip-${answerIndex}-${infopointIndex}`}
                id={`quiz-infopoint-${answerIndex}-${infopointIndex}`}
                infopoint={infopoint}
                infopointOpenStatusMap={infopointOpenStatusMap}
                setInfopointOpenStatusMap={setInfopointOpenStatusMap}
                primaryKey={answerIndex.toString()}
                secondaryKey={infopointIndex.toString()}
              />
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
              checkedIcon={getAnswerCheckboxIcon(
                isFinished,
                markedAnswers[answerIndex],
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
              checkedIcon={getAnswerRadioIcon(
                isFinished,
                markedAnswers[answerIndex],
                answer.correct
              )}
            />
          )}

          <div>{answer.text}</div>
        </div>
      )}

      {/* Icon badges, top right corner */}
      {(quizType === "ONLY_IMAGES" || quizType === "ONLY_TEXT") &&
        isFinished && (
          <div className="absolute top-0 right-0 flex translate-x-1/2 -translate-y-1/2">
            {getAnswerRadioIcon(
              isFinished,
              markedAnswers[answerIndex],
              answer.correct,
              { fontSize: "24px" }
            )}
          </div>
        )}
    </div>
  );
};

export default ImageTextAnswer;
