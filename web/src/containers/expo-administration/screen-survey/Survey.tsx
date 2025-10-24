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

type SurveyProps = {
  activeScreen: SurveyScreen;
};

const Survey = ({ activeScreen }: SurveyProps) => {
  console.log();
  console.log("*** Survey ***");
  console.log("activeScreen: ", activeScreen);

  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div>TODO1</div>
      </div>
    </div>
  );
};

export default Survey;
