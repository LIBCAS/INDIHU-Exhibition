// Components
import SurveyTypeSelect from "./components/fields/SurveyTypeSelect";
import SurveyIncludeFreeAnswerCheckbox from "./components/fields/SurveyIncludeFreeAnswerCheckbox";
import SurveyAnswerDisplayCheckbox from "./components/fields/SurveyAnswerDisplayCheckbox";
import SurveyAnswers from "./components/survey-answers/SurveyAnswers";

// Types
import { SurveyScreen } from "models";

// - - - - - -

type SurveyProps = {
  activeScreen: SurveyScreen;
};

const Survey = ({ activeScreen }: SurveyProps) => {
  return (
    <div className="container-big container-tabMenu">
      <div className="screen">
        <div className="w-fit m-auto mb-16 flex flex-col gap-2 justify-start items-start xl:flex-row xl:w-auto xl:justify-center xl:items-center xl:gap-8">
          <div>
            <SurveyTypeSelect activeScreen={activeScreen} />
          </div>

          <div>
            <SurveyIncludeFreeAnswerCheckbox activeScreen={activeScreen} />
            <SurveyAnswerDisplayCheckbox activeScreen={activeScreen} />
          </div>
        </div>

        <SurveyAnswers activeScreen={activeScreen} />
      </div>
    </div>
  );
};

export default Survey;
