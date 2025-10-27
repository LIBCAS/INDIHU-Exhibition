import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import ScreenDescription from "components/editors/screen-description";
import Survey from "./Survey";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  SurveyScreen,
} from "models";
import SurveyResults from "./SurveyResults";

// - - - - - -

export type ScreenEditorSurveyProps = ConcreteScreenEditorProps<SurveyScreen>;

const ScreenSurvey = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const surveyProps = props as ScreenEditorSurveyProps;
  const { activeScreen, url } = surveyProps;

  const rowNum = match.params.position.match(/^(\d*)/)?.[0];
  const colNum = match.params.position.match(/(\d*)$/)?.[0];

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.surveyDescTab"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.surveyOptionsTab"),
            link: `${match.url}/survey`,
          },
          {
            label: t("tabs.surveyResultsTab"),
            link: `${match.url}/results`,
          },
        ]}
      />

      <Route
        path={`${match.url}/description`}
        render={() => (
          <ScreenDescription
            activeScreen={activeScreen}
            rowNum={rowNum}
            colNum={colNum}
          />
        )}
      />

      <Route
        path={`${match.url}/survey`}
        render={() => <Survey activeScreen={activeScreen} />}
      />

      <Route
        path={`${match.url}/results`}
        render={() => <SurveyResults activeScreen={activeScreen} />}
      />

      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        rowNum={rowNum}
        colNum={colNum}
        history={history}
        url={url}
      />
    </div>
  );
};

export default ScreenSurvey;
