// Components
import SurveyTypeSelect from "./components/fields/SurveyTypeSelect";
import SurveyIncludeFreeAnswerCheckbox from "./components/fields/SurveyIncludeFreeAnswerCheckbox";
import SurveyAnswerDisplayCheckbox from "./components/fields/SurveyAnswerDisplayCheckbox";
import SurveyAnswers from "./components/survey-answers/SurveyAnswers";
import AddSurveyAnswerButton from "./components/survey-answers/AddSurveyAnswerButton";
import SurveyLockButton from "./components/survey-answers/SurveyLockButton";

// Types
import { SurveyScreen } from "models";

// - - - - - -

type SurveyProps = {
  activeExpoId: string;
  activeScreen: SurveyScreen;
  rowNum: string | undefined;
  colNum: string | undefined;
};

const Survey = ({
  activeExpoId,
  activeScreen,
  rowNum,
  colNum,
}: SurveyProps) => {
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

        <div>
          <AddSurveyAnswerButton activeScreen={activeScreen} />
          <SurveyLockButton
            activeExpoId={activeExpoId}
            activeScreen={activeScreen}
            rowNum={rowNum}
            colNum={colNum}
          />
        </div>
      </div>
    </div>
  );
};

export default Survey;
