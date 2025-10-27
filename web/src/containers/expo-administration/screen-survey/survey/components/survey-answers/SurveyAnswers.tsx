import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import SurveyAnswerItem from "./SurveyAnswerItem";
import AddSurveyAnswerButton from "./AddSurveyAnswerButton";

// Models
import { AppDispatch } from "store/store";
import { SurveyScreen, File as IndihuFile } from "models";

// Utils
import { updateScreenData } from "actions/expoActions";
import { getFileById } from "actions/file-actions-typed";
import { DEFAULT_SURVEY_TYPE } from "containers/expo-administration/screen-survey/default-values";

// - - - - - -

type SurveyAnswersProps = {
  activeScreen: SurveyScreen;
};

const SurveyAnswers = ({ activeScreen }: SurveyAnswersProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  const surveyType = useMemo(
    () => activeScreen.surveyType ?? DEFAULT_SURVEY_TYPE,
    [activeScreen.surveyType]
  );

  if (surveyType === "FREE_ANSWER") {
    return (
      <div className="max-w-full flex justify-center items-center">
        <p className="italic text-lg text-center">
          {t("freeAnswerInformation")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-full flex flex-col gap-2">
      {activeScreen.surveyAnswers?.map((currAnswer, currAnswerIdx) => {
        const currAnswerImageId = currAnswer?.image ?? null;
        const currAnswerImageFile = dispatch(getFileById(currAnswerImageId));

        const setCurrAnswerImageFile = (imageFile: IndihuFile) => {
          dispatch(
            updateScreenData({
              surveyAnswers: activeScreen?.surveyAnswers?.map(
                (currAns, currAnsIdx) =>
                  currAnswerIdx === currAnsIdx
                    ? { ...currAns, image: imageFile.id }
                    : currAns
              ),
            })
          );
        };

        return (
          <SurveyAnswerItem
            key={currAnswerIdx}
            currAnswer={currAnswer}
            currAnswerIdx={currAnswerIdx}
            activeScreen={activeScreen}
            currAnswerImageFile={currAnswerImageFile}
            setCurrAnswerImageFile={setCurrAnswerImageFile}
          />
        );
      })}

      <AddSurveyAnswerButton activeScreen={activeScreen} />
    </div>
  );
};

export default SurveyAnswers;
