import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import ScreenDescription from "components/editors/screen-description";
import ImageAnimation from "./animation-tab/ImageAnimation";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  ImageAnimationScreen,
} from "models";

// - - - - - -

// Models
export type ScreenEditorImageAnimationProps =
  ConcreteScreenEditorProps<ImageAnimationScreen>;

const ScreenImageAnimation = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const imageAnimationProps = props as ScreenEditorImageAnimationProps;
  const { activeScreen, url } = imageAnimationProps;

  const rowNum = match.params.position.match(/^(\d*)/)?.[0];
  const colNum = match.params.position.match(/(\d*)$/)?.[0];

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab3"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.imageAnimationTab"),
            link: `${match.url}/animation`,
          },
          {
            label: t("tabs.documentsTab"),
            link: `${match.url}/documents`,
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
        path={`${match.url}/animation`}
        render={() => <ImageAnimation activeScreen={activeScreen} />}
      />
      <Route
        path={`${match.url}/documents`}
        render={() => <Documents activeScreen={activeScreen} />}
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

export default ScreenImageAnimation;
