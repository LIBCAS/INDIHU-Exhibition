import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import ScreenDescription from "components/editors/screen-description";
import Image from "./image";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  ImageScreen,
} from "models";

import { find } from "lodash";

// - -

export type ScreenEditorImageProps = ConcreteScreenEditorProps<ImageScreen>;

const ScreenImage = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const imageScreenProps = props as ScreenEditorImageProps;
  const { activeScreen, url } = imageScreenProps;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab3"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.imageTab"),
            link: `${match.url}/image`,
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
        path={`${match.url}/image`}
        render={() => <Image activeScreen={activeScreen} />}
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
        noActions={!!find(activeScreen.infopoints, (item) => item.edit)}
        history={history}
        url={url}
      />
    </div>
  );
};

export default ScreenImage;
