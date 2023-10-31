import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import ScreenDescription from "components/editors/screen-description";
import LinkReferences from "./LinkReferences";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  SignpostScreen,
} from "models";

// - -

export type ScreenEditorSignpostProps =
  ConcreteScreenEditorProps<SignpostScreen>;

const ScreenSignpost = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const signpostProps = props as ScreenEditorSignpostProps;
  const { activeScreen, url } = signpostProps;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab3"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.referencesTab"),
            link: `${match.url}/references`,
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
        path={`${match.url}/references`}
        render={() => <LinkReferences activeScreen={activeScreen} />}
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

export default ScreenSignpost;
