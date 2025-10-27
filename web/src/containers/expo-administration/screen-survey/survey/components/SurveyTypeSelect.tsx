import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Components
import SelectField from "react-md/lib/SelectFields";

// Types
import { AppDispatch } from "store/store";
import { SurveyScreen } from "models";
import { SurveyTypeEnum } from "enums/administration-screens/screen-survey";
import { SurveyType } from "models";

// Utils
import { updateScreenData } from "actions/expoActions";

// - - - - - -

type SurveyTypeSelectProps = {
  activeScreen: SurveyScreen;
};

const SurveyTypeSelect = ({ activeScreen }: SurveyTypeSelectProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  return (
    <div className="w-full xl:w-fit">
      <SelectField
        menuItems={[
          {
            label: t("surveyTypeOnlyTextOption"),
            value: SurveyTypeEnum.ONLY_TEXT,
          },
          {
            label: t("surveyTypeOnlyImageOption"),
            value: SurveyTypeEnum.ONLY_IMAGES,
          },
          {
            label: t("surveyTypeImageTextOption"),
            value: SurveyTypeEnum.TEXT_IMAGES,
          },
          {
            label: t("surveyTypeFreeAnswerOption"),
            value: SurveyTypeEnum.FREE_ANSWER,
          },
        ]}
        itemLabel={"label"}
        itemValue={"value"}
        label={t("surveyTypeLabel")}
        position="below"
        id="survey-selectfield-type"
        name="survey-selectfield-type"
        defaultValue={activeScreen.surveyType ?? "TEXT_IMAGES"}
        onChange={(newValue: SurveyType) => {
          dispatch(updateScreenData({ surveyType: newValue }));
        }}
        fullWidth
      />
    </div>
  );
};

export default SurveyTypeSelect;
