import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import { Button } from "components/button/button";
import { Icon } from "components/icon/icon";

// Models
import { AppDispatch } from "store/store";
import { SurveyAnswer, SurveyScreen } from "models";

// Utils
import { updateScreenData } from "actions/expoActions";

// - - - - - -

type AddSurveyAnswerButtonProps = {
  activeScreen: SurveyScreen;
};

const AddSurveyAnswerButton = ({
  activeScreen,
}: AddSurveyAnswerButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  const areAnswersFull = useMemo(() => {
    const length = activeScreen.surveyAnswers?.length;
    const isFull = length !== undefined && length >= 8;
    return isFull;
  }, [activeScreen.surveyAnswers?.length]);

  if (areAnswersFull) {
    return null;
  }

  return (
    <div className="w-full flex justify-center items-center mt-6">
      <Button
        color="secondary"
        iconBefore={<Icon name="add" />}
        onClick={() => {
          const newAnswer: SurveyAnswer = { text: "", image: null };
          dispatch(
            updateScreenData({
              surveyAnswers: [...(activeScreen.surveyAnswers ?? []), newAnswer],
            })
          );
        }}
      >
        {t("addNewAnswer")}
      </Button>
    </div>
  );
};

export default AddSurveyAnswerButton;
