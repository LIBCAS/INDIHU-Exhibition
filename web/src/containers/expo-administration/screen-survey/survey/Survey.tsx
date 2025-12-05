import { useMemo } from "react";

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
  activeScreen: SurveyScreen;
};

const Survey = ({ activeScreen }: SurveyProps) => {
  const isSurveyScreenLocked = useMemo<boolean>(
    () => activeScreen.isSurveyScreenLocked ?? false,
    [activeScreen.isSurveyScreenLocked]
  );

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
          <SurveyLockButton isScreenLocked={isSurveyScreenLocked} />
        </div>
      </div>
    </div>
  );
};

export default Survey;
