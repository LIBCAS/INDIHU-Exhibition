import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Components
import { Route } from "react-router-dom";
import TabMenu from "components/tab-menu";
import ScreenDescription from "components/editors/screen-description";
import Sequence from "./Sequence";
import Documents from "components/editors/documents";
import Footer from "components/editors/footer";

// Models
import {
  ScreenEditorProps,
  ConcreteScreenEditorProps,
  ZoomScreen,
} from "models";

import { find } from "lodash";
import { calculateTotalSequencesTime } from "containers/views/view-zoom/useZoomPhase";
import { ZOOM_SCREEN_DEFAULT_SEQ_DELAY_TIME } from "constants/screen";

// - -

export type ScreenEditorZoomInProps = ConcreteScreenEditorProps<ZoomScreen>;

const ScreenZoomIn = (props: ScreenEditorProps) => {
  const { t } = useTranslation("expo-editor");
  const match = useRouteMatch<{ position: string }>();
  const history = useHistory();

  const rowNum = match.params.position.match(/^(\d*)/)?.[0];
  const colNum = match.params.position.match(/(\d*)$/)?.[0];

  const zoomInProps = props as ScreenEditorZoomInProps;
  const { activeScreen, url } = zoomInProps;

  //
  const totalZoomScreenTime = calculateTotalSequencesTime(
    activeScreen.sequences ?? [],
    (activeScreen.seqDelayTime ?? ZOOM_SCREEN_DEFAULT_SEQ_DELAY_TIME) * 1000
  );

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: t("tabs.descTab3"),
            link: `${match.url}/description`,
          },
          {
            label: t("tabs.sequencesTab"),
            link: `${match.url}/sequence`,
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
            totalZoomScreenTime={totalZoomScreenTime}
            rowNum={rowNum}
            colNum={colNum}
          />
        )}
      />
      <Route
        path={`${match.url}/sequence`}
        render={() => (
          <Sequence
            activeScreen={activeScreen}
            totalZoomScreenTime={totalZoomScreenTime}
          />
        )}
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
        noActions={
          !!find(activeScreen.sequences, (item) => item.edit || item.timeError)
        }
        history={history}
        url={url}
      />
    </div>
  );
};

export default ScreenZoomIn;
