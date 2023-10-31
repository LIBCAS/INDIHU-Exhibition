import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import Description from "./Description";
import Answers from "./answers/Answers";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  GameQuizScreen,
} from "models";

// - -

export type ScreenEditorGameQuizProps =
  ConcreteScreenEditorProps<GameQuizScreen>;

const ScreenGameOptions = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const gameQuizProps = props as ScreenEditorGameQuizProps;
  const { activeScreen, url } = gameQuizProps;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.gameTab"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.answersTab"),
            link: `${match.url}/answers`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <Description activeScreen={activeScreen} />}
      />
      <Route
        path={`${match.url}/answers`}
        render={() => <Answers activeScreen={activeScreen} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        rowNum={match.params.position.match(/^(\d*)/)?.[0]}
        colNum={match.params.position.match(/(\d*)$/)?.[0]}
        // noActions={
        //   activeScreen.resultTime === 0 ||
        //   (resultTime && (resultTime < 1 || resultTime > 1000000))
        // }
        noActionTitle="Špatně zadaná doba zobrazení výsledku"
        noActionText="Před uložením opravte dobu zobrazení výsledku!"
        history={history}
        url={url}
      />
    </div>
  );
};

export default ScreenGameOptions;
