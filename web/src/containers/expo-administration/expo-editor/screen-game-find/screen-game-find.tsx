import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import GameDescription from "components/editors/game-description";
import Images from "./Images";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  GameFindScreen,
} from "models";

// - -

export type ScreenEditorGameFindProps =
  ConcreteScreenEditorProps<GameFindScreen>;

const ScreenGameFind = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const gameFindScreenProps = props as ScreenEditorGameFindProps;
  const { activeExpo, activeScreen, url } = gameFindScreenProps;
  const resultTime = activeScreen.resultTime;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.gameTab"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.imagesTab"),
            link: `${match.url}/images`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => (
          <GameDescription
            activeScreen={activeScreen}
            taskHelpIconLabel={t("descFields.gameFindScreen.taskTooltip")}
          />
        )}
      />
      <Route
        path={`${match.url}/images`}
        render={() => <Images activeScreen={activeScreen} />}
      />
      <Footer
        activeExpo={activeExpo}
        activeScreen={activeScreen}
        rowNum={match.params.position.match(/^(\d*)/)?.[0]}
        colNum={match.params.position.match(/(\d*)$/)?.[0]}
        noActions={
          resultTime === 0 ||
          (resultTime && (resultTime < 1 || resultTime > 1000000))
        }
        noActionTitle="Špatně zadaná doba zobrazení výsledku"
        noActionText="Před uložením opravte dobu zobrazení výsledku!"
        history={history}
        url={url}
      />
    </div>
  );
};

export default ScreenGameFind;