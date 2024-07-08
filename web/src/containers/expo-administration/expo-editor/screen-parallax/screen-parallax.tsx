import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import ScreenDescription from "components/editors/screen-description";
import Parallax from "./Parallax";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ConcreteScreenEditorProps,
  ParallaxScreeen,
  ScreenEditorProps,
} from "models";

// - -

export type ScreenEditorParallaxProps =
  ConcreteScreenEditorProps<ParallaxScreeen>;

const ScreenParallax = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const parallaxScreenProps = props as ScreenEditorParallaxProps;
  const { activeScreen, url } = parallaxScreenProps;

  const rowNum = match.params.position.match(/^(\d*)/)?.[0];
  const colNum = match.params.position.match(/(\d*)$/)?.[0];

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.parallaxTab"),
            link: `${match.url}/parallax`,
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
        path={`${match.url}/parallax`}
        render={() => <Parallax activeScreen={activeScreen} />}
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

export default ScreenParallax;
