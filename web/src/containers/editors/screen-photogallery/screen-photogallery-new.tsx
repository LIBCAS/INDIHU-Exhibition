import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import Description from "containers/editors/screen-photogallery/Description";
import Photogallery from "./Photogallery";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import { ActiveExpo } from "models";
import { PhotogalleryScreen } from "models";

// - -

export type ScreenPhotoGalleryProps = {
  activeExpo: ActiveExpo;
  activeScreen: PhotogalleryScreen;
  getCurrentUser: any;
  history: any;
  loadExpo: any;
  loadScreen: any;
  location: any;
  match: any;
  staticContext: any;
  updateScreenData: any;
  url: string;
};

const ScreenPhotogallery = (props: ScreenPhotoGalleryProps) => {
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  return (
    <div>
      <TabMenu
        tabs={[
          { label: "Název, text", link: `${match.url}/description` },
          { label: "Fotogalerie", link: `${match.url}/photogallery` },
          { label: "Dokumenty", link: `${match.url}/documents` },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <Description {...props} />}
      />
      <Route
        path={`${match.url}/photogallery`}
        render={() => <Photogallery {...props} />}
      />
      <Route
        path={`${match.url}/documents`}
        render={() => <Documents isStartScreen={false} {...props} />}
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
