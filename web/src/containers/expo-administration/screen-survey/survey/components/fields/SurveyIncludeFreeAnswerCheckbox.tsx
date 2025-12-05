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

type SurveyIncludeFreeAnswerCheckboxProps = {
  activeScreen: SurveyScreen;
};

const SurveyIncludeFreeAnswerCheckbox = ({
  activeScreen,
}: SurveyIncludeFreeAnswerCheckboxProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  return (
    <div>
      <Checkbox
        id="survey-include-free-answer-checkbox"
        name="survey-include-free-answer-checkbox"
        label={t("surveyShouldIncludeFreeAnswerCheckboxLabel")}
        className="checkbox-shift-left-by-padding"
        checked={activeScreen.shouldIncludeFreeAnswer ?? false}
        onChange={(newValue: boolean) => {
          dispatch(updateScreenData({ shouldIncludeFreeAnswer: newValue }));
        }}
      />
    </div>
  );
};

export default SurveyIncludeFreeAnswerCheckbox;
