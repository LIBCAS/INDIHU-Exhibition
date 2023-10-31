import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import ScreenDescription from "components/editors/screen-description";
import Text from "./text";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  TextScreen,
} from "models";

// - -

export type ScreenEditorTextProps = ConcreteScreenEditorProps<TextScreen>;

const ScreenText = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const textProps = props as ScreenEditorTextProps;

  return (
    <div>
      <TabMenu
        tabs={[
          { label: t("tabs.descTab3"), link: `${match.url}/description` },
          { label: t("tabs.textTab"), link: `${match.url}/text` },
          { label: t("tabs.documentsTab"), link: `${match.url}/documents` },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => (
          <ScreenDescription activeScreen={textProps.activeScreen} />
        )}
      />
      <Route
        path={`${match.url}/text`}
        render={() => <Text activeScreen={textProps.activeScreen} />}
      />
      <Route
        path={`${match.url}/documents`}
        render={() => <Documents activeScreen={textProps.activeScreen} />}
      />

      <Footer
        activeExpo={props.activeExpo}
        activeScreen={props.activeScreen}
        rowNum={match.params.position.match(/^(\d*)/)?.[0]}
        colNum={match.params.position.match(/(\d*)$/)?.[0]}
        history={history}
        url={props.url}
      />
    </div>
  );
};

export default ScreenText;
