import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory } from "react-router-dom";

import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import ScreenDescription from "components/editors/screen-description";
import Images from "./images";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  ImageChangeScreen,
} from "models";

// - -

export type ScreenEditorImageChangeProps =
  ConcreteScreenEditorProps<ImageChangeScreen>;

const ScreenImageChange = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const imageChangeProps = props as ScreenEditorImageChangeProps;
  const { activeScreen } = imageChangeProps;

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
            label: t("tabs.imagesTab"),
            link: `${match.url}/images`,
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
        path={`${match.url}/images`}
        render={() => <Images activeScreen={activeScreen} />}
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
        url={imageChangeProps.url}
      />
    </div>
  );
};

export default ScreenImageChange;
