import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import Description from "./Description";
import Photogallery from "./Photogallery";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  PhotogalleryScreen,
} from "models";

// - -

export type ScreenEditorPhotogalleryProps =
  ConcreteScreenEditorProps<PhotogalleryScreen>;

const ScreenPhotogallery = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const photogalleryProps = props as ScreenEditorPhotogalleryProps;

  return (
    <div>
      <TabMenu
        tabs={[
          { label: t("tabs.descTab4"), link: `${match.url}/description` },
          {
            label: t("tabs.photogalleryTab"),
            link: `${match.url}/photogallery`,
          },
          { label: t("tabs.documentsTab"), link: `${match.url}/documents` },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <Description {...photogalleryProps} />}
      />
      <Route
        path={`${match.url}/photogallery`}
        render={() => <Photogallery {...photogalleryProps} />}
      />
      <Route
        path={`${match.url}/documents`}
        render={() => (
          <Documents activeScreen={photogalleryProps.activeScreen} />
        )}
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

export default ScreenPhotogallery;
