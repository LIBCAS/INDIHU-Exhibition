// Hooks
import { useTranslation } from "react-i18next";
import { useMediaDevice } from "context/media-device-provider/media-device-provider";

//  Components
import { Grid } from "@mui/material";

// Models
import { SurveyAnswer, SurveyType } from "models";

// Utils
import cx from "classnames";

// - - - - - -

type SurveyViewAnswerProps = {
  answer: SurveyAnswer;
  answerIdx: number;
  preloadedImgSrc: string | undefined;
  isGameFinished: boolean;
  surveyType: SurveyType;
  isAnswerMarked: boolean;
  handleMarkThisAnswer: (answerIdx: number) => void;
};

const SurveyAnswerItem = ({
  answer,
  answerIdx,
  preloadedImgSrc,
  isGameFinished,
  surveyType,
  isAnswerMarked,
  handleMarkThisAnswer,
}: SurveyViewAnswerProps) => {
  const { isSm, isMobileLandscape } = useMediaDevice();
  const { t } = useTranslation("view-screen", { keyPrefix: "surveyScreen" });

  // - - - GUI - - -

  return (
    <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleMarkThisAnswer(answerIdx);
        }}
        className={cx(
          "relative h-full flex flex-col gap-4 self-stretch p-4 md:p-10 border-4 border-solid border-transparent rounded-md bg-transparent hover:bg-light-gray/10 cursor-pointer",
          {
            "!p-2": surveyType === "ONLY_IMAGES",
            "!p-3": surveyType === "ONLY_TEXT",
            "border-gray": !isAnswerMarked && !isGameFinished,
            "border-blue !bg-[#3d7eca4d]": isAnswerMarked && !isGameFinished,
          }
        )}
      >
        {/* A) Render contained image (when allowed) */}
        {(surveyType === "TEXT_IMAGES" || surveyType === "ONLY_IMAGES") && (
          <div
            className={cx("w-full relative", {
              "h-[200px]": isSm || isMobileLandscape,
              "h-[300px]": !isSm && !isMobileLandscape,
            })}
          >
            <img
              src={preloadedImgSrc}
              alt="quiz-image"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* B) Render text (when allowed) */}
        {(surveyType === "TEXT_IMAGES" || surveyType === "ONLY_TEXT") && (
          <div
            style={{ flex: 1 }}
            className="w-full flex justify-center items-center text-white"
          >
            {answer.text === "" ? (
              <div className="italic pl-2 pr-4 text-start">
                {t("missingAnswerText")}
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

export default SurveyAnswerItem;
