import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components

// Types
import { AppDispatch } from "store/store";
import { SurveyScreen } from "models";

// Actions
import { updateScreenData } from "actions/expoActions";

// - - - - - -

type SurveyResultsProps = {
  activeScreen: SurveyScreen;
};

const SurveyResults = ({ activeScreen }: SurveyResultsProps) => {
  console.log();
  console.log("*** SurveyResults ***");
  console.log("activeScreen: ", activeScreen);

  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div>TODO2</div>
      </div>
    </div>
  );
};

export default SurveyResults;
