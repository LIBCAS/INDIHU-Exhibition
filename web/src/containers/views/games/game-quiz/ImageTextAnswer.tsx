import { Dispatch, SetStateAction, useMemo, Fragment } from "react";
import useElementSize from "hooks/element-size-hook";

import { Checkbox, Radio } from "@mui/material";
import ScreenAnchorInfopoint from "components/infopoint/ScreenAnchorInfopoint";
import TooltipInfoPoint from "components/infopoint/TooltipInfopoint";

import {
  GameQuizAnswer,
  GameQuizAnswerDisplayType,
  GameQuizType,
  Size,
} from "models";
import { InfopointStatusObject } from "components/infopoint/useTooltipInfopoint";

import cx from "classnames";
import { calculateObjectFit } from "utils/object-fit";
import { getAnswerCheckboxIcon, getAnswerRadioIcon } from "./utils";
import { calculateInfopointPositionByImageBoxSize } from "utils/infopoint-utils";
import { useMediaDevice } from "context/media-device-provider/media-device-provider";

type ImageTextAnswerProps = {
  answer: GameQuizAnswer;
  answerIndex: number;
  answerImageOrigData?: Size;
  preloadedImgSrc: string;
  isFinished: boolean;
  isMultipleChoice: boolean;
  markedAnswers: boolean[];
  setMarkedAnswers: Dispatch<SetStateAction<boolean[]>>;
  quizType: GameQuizType;
  answersTextDisplayType: GameQuizAnswerDisplayType;

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
  answersTextDisplayType,
  infopointOpenStatusMap,
  setInfopointOpenStatusMap,
}: ImageTextAnswerProps) => {
  const { isSm, isMobileLandscape } = useMediaDevice();

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
        "flex flex-col gap-4 self-stretch p-4 md:p-10 border-4 border-solid border-transparent rounded-md bg-transparent hover:bg-light-gray/10 cursor-pointer relative",
        {
          "w-[380px]": !isSm && isMobileLandscape,
          "w-[260px]": isSm || isMobileLandscape,
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
                <ScreenAnchorInfopoint
                  id={`quiz-infopoint-${answerIndex}-${infopointIndex}`}
                  left={adjustedLeft}
                  top={adjustedTop}
                  infopoint={infopoint}
                />
                <TooltipInfoPoint
                  key={`quiz-infopoint-tooltip-${answerIndex}-${infopointIndex}`}
                  id={`quiz-infopoint-${answerIndex}-${infopointIndex}`}
                  infopoint={infopoint}
                  infopointOpenStatusMap={infopointOpenStatusMap}
                  setInfopointOpenStatusMap={setInfopointOpenStatusMap}
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

          {/* TEXT */}
          {quizType === "TEXT_IMAGES" &&
          !isFinished &&
          answersTextDisplayType === "QUIZ_TEXT_AFTER_EVALUATION" ? (
            <div className="italic">Kliknutím zvolíte túto možnosť</div>
          ) : (
            <div>{answer.text}</div>
          )}
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
