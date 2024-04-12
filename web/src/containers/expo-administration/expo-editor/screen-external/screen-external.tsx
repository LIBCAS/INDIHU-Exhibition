import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import ScreenDescription from "components/editors/screen-description";
import ExternalData2 from "./external-data";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  ExternalScreen,
} from "models";

// - -

export type ScreenEditorExternalProps =
  ConcreteScreenEditorProps<ExternalScreen>;

const ScreenExternal = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const externalScreenProps = props as ScreenEditorExternalProps;
  const { activeScreen, url } = externalScreenProps;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.externalTab"),
            link: `${match.url}/externalData`,
          },
          {
            label: t("tabs.documentsTab"),
            link: `${match.url}/documents`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <ScreenDescription activeScreen={activeScreen} />}
      />
      <Route
        path={`${match.url}/externalData`}
        render={() => <ExternalData2 activeScreen={activeScreen} />}
      />
      <Route
        path={`${match.url}/documents`}
        render={() => <Documents activeScreen={activeScreen} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        rowNum={match.params.position.match(/^(\d*)/)?.[0]}
        colNum={match.params.position.match(/(\d*)$/)?.[0]}
        history={history}
        url={url}
      />
    </div>
  );
};

export default ScreenExternal;
