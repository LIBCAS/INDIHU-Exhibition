import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import Description from "./Description";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  FinishScreen,
} from "models";

// - -

export type ScreenEditorFinishProps = ConcreteScreenEditorProps<FinishScreen>;

const ScreenFinish = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const finishScreenProps = props as ScreenEditorFinishProps;
  const { activeScreen, url } = finishScreenProps;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.settingsTab"),
            link: `${match.url}/description`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <Description activeScreen={activeScreen} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        history={history}
        url={url}
        type="finish"
      />
    </div>
  );
};

export default ScreenFinish;
