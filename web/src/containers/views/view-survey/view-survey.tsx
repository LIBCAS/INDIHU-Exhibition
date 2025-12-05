import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Components
import SurveyVariantAnswerView from "./variant-answers/SurveyVariantAnswerView";

// Types
import { AppState } from "store/store";
import { ScreenProps, SurveyScreen } from "models";

// Utils
import { DEFAULT_SURVEY_TYPE } from "containers/expo-administration/screen-survey/default-values";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen as SurveyScreen,
  (viewScreen) => ({ viewScreen })
);

export const ViewSurvey = ({
  screenPreloadedFiles,
  infoPanelRef,
  actionsPanelRef,
  isMobileOverlay,
}: ScreenProps) => {
  const { viewScreen } = useSelector(stateSelector);

  // - - - Data about Survey from administration - - -

  const surveyType = useMemo(
    () => viewScreen.surveyType ?? DEFAULT_SURVEY_TYPE,
    [viewScreen.surveyType]
  );

  // - - - GUI - - -

  return (
    <SurveyVariantAnswerView
      viewScreen={viewScreen}
      infoPanelRef={infoPanelRef}
      actionsPanelRef={actionsPanelRef}
      isMobileOverlay={isMobileOverlay}
      screenPreloadedFiles={screenPreloadedFiles}
      surveyType={surveyType}
    />
  );
};
