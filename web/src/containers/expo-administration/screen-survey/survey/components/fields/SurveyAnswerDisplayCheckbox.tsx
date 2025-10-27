import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import Checkbox from "react-md/lib/SelectionControls/Checkbox";

// Types
import { AppDispatch } from "store/store";
import { SurveyScreen } from "models";

// Utils
import { updateScreenData } from "actions/expoActions";

// - - - - - -

type SurveyAnswerDisplayCheckboxProps = {
  activeScreen: SurveyScreen;
};

const SurveyAnswerDisplayCheckbox = ({
  activeScreen,
}: SurveyAnswerDisplayCheckboxProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  return (
    <div className="row self-end">
      <Checkbox
        id="survey-answer-display-checkbox"
        name="survey-answer-display-checkbox"
        label={t("surveyShouldDisplayAnswerFeedbackCheckboxLabel")}
        className="checkbox-shift-left-by-padding"
        checked={activeScreen.shouldShowAnswerFeedback ?? false}
        onChange={(newValue: boolean) =>
          dispatch(updateScreenData({ shouldShowAnswerFeedback: newValue }))
        }
      />
    </div>
  );
};

export default SurveyAnswerDisplayCheckbox;
