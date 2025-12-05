import { useDispatch } from "react-redux";

// Components
import SurveyAnswerItem from "./SurveyAnswerItem";
import AddSurveyAnswerButton from "./AddSurveyAnswerButton";

// Models
import { AppDispatch } from "store/store";
import { SurveyScreen, File as IndihuFile } from "models";

// Utils
import { updateScreenData } from "actions/expoActions";
import { getFileById } from "actions/file-actions-typed";

// - - - - - -

type SurveyAnswersProps = {
  activeScreen: SurveyScreen;
};

const SurveyAnswers = ({ activeScreen }: SurveyAnswersProps) => {
  const dispatch = useDispatch<AppDispatch>();

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
