import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import Description from "./Description";
import Authors from "./Authors";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  StartScreen,
} from "models";

// - -

export type ScreenEditorStartProps = ConcreteScreenEditorProps<StartScreen>;

const ScreenStart = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const startScreenProps = props as ScreenEditorStartProps;
  const { activeScreen, activeExpo, url } = startScreenProps;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.imprintTab"),
            link: `${match.url}/authors`,
          },
          {
            label: t("tabs.startScreenDocumentsTab"),
            link: `${match.url}/documents`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => (
          <Description activeExpo={activeExpo} activeScreen={activeScreen} />
        )}
      />
      <Route
        path={`${match.url}/authors`}
        render={() => <Authors activeScreen={activeScreen} />}
      />
      <Route
        path={`${match.url}/documents`}
        render={() => <Documents activeScreen={activeScreen} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        history={history}
        url={url}
        type="start"
        noActions={
          isNaN(Number(activeScreen.expoTime)) ||
          Number(activeScreen.expoTime) > 1000000 * 60
        }
        noActionTitle="Zadána neplatná hodnota"
        noActionText="U pole s délkou trvání výstavy byla zadána neplatná hodnota."
      />
    </div>
  );
};

export default ScreenStart;
