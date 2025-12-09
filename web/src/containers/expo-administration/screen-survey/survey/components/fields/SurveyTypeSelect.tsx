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
import { DEFAULT_SURVEY_TYPE } from "containers/expo-administration/screen-survey/default-values";

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
        ]}
        itemLabel={"label"}
        itemValue={"value"}
        label={t("surveyTypeLabel")}
        position="below"
        id="survey-selectfield-type"
        name="survey-selectfield-type"
        defaultValue={activeScreen.surveyType ?? DEFAULT_SURVEY_TYPE}
        onChange={(newValue: SurveyType) => {
          dispatch(updateScreenData({ surveyType: newValue }));
        }}
        fullWidth
        disabled={activeScreen.isSurveyScreenLocked ?? false}
      />
    </div>
  );
};

export default SurveyTypeSelect;
