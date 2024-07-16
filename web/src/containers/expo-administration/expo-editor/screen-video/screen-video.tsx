import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import Description from "./Description";
import Video from "./Video";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  VideoScreen,
} from "models";

// - -

export type ScreenEditorVideoProps = ConcreteScreenEditorProps<VideoScreen>;

const ScreenVideo = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const rowNum = match.params.position.match(/^(\d*)/)?.[0];
  const colNum = match.params.position.match(/(\d*)$/)?.[0];

  const videoScreenProps = props as ScreenEditorVideoProps;
  const { activeScreen, url } = videoScreenProps;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab4"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.videoTab"),
            link: `${match.url}/video`,
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
          <Description
            activeScreen={activeScreen}
            rowNum={rowNum}
            colNum={colNum}
          />
        )}
      />
      <Route
        path={`${match.url}/video`}
        render={() => <Video activeScreen={activeScreen} />}
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

export default ScreenVideo;
