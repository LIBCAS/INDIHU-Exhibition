// Components
import SurveyTypeSelect from "./components/fields/SurveyTypeSelect";
import SurveyAnswerDisplayCheckbox from "./components/fields/SurveyAnswerDisplayCheckbox";

// Types
import { SurveyScreen } from "models";
import SurveyAnswers from "./components/survey-answers/SurveyAnswers";

// - - - - - -

type SurveyProps = {
  activeScreen: SurveyScreen;
};

const Survey = ({ activeScreen }: SurveyProps) => {
  return (
    <div className="container-big container-tabMenu">
      <div className="screen">
        <div className="w-fit m-auto mb-16 flex flex-col gap-2 justify-start items-start xl:flex-row xl:w-auto xl:justify-center xl:gap-8">
          <SurveyTypeSelect activeScreen={activeScreen} />
          <SurveyAnswerDisplayCheckbox activeScreen={activeScreen} />
        </div>

        <SurveyAnswers activeScreen={activeScreen} />
      </div>
    </div>
  );
};

export default Survey;
