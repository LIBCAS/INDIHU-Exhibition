import { useTranslation } from "react-i18next";
import { useRouteMatch, useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import Description from "./Description";
import Image from "./Image";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  IntroScreen,
} from "models";

// - -

export type ScreenEditorIntroProps = ConcreteScreenEditorProps<IntroScreen>;

const ScreenChapterStart = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const introScreenProps = props as ScreenEditorIntroProps;
  const { activeScreen, url } = introScreenProps;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab2"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.backgroundImageTab"),
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
        render={() => <Description activeScreen={activeScreen} />}
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
        history={history}
        url={url}
        noActions={
          isNaN(Number(activeScreen.time)) ||
          Number(activeScreen.time) > 1000000
        }
        noActionTitle="Zadána neplatná hodnota"
        noActionText="U pole s celkovou dobou zobrazení obrazovky byla zadána neplatná hodnota."
      />
    </div>
  );
};

export default ScreenChapterStart;
