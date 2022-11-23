import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter, Route } from "react-router-dom";
import { find } from "lodash";

import TabMenu from "../../components/tab-menu";
import Description from "../../components/editors/screen-description";
import Sequence from "../../components/editors/zoomIn/sequence";
import Documents from "../../components/editors/documents";
import Footer from "../../components/editors/footer";

import { updateScreenData } from "../../actions/expoActions";

const ScreenZoomIn = (props) => {
  const { match, activeScreen, history, url } = props;
  const { position } = match.params;
  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: "Název, text, audio",
            link: `${match.url}/description`,
          },
          {
            label: "Sekvence",
            link: `${match.url}/sequence`,
          },
          {
            label: "Dokumenty",
            link: `${match.url}/documents`,
          },
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <Description {...props} />}
      />
      <Route
        path={`${match.url}/sequence`}
        render={() => <Sequence {...props} />}
      />
      <Route
        path={`${match.url}/documents`}
        render={() => <Documents {...props} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        rowNum={position.match(/^(\d*)/)[0]}
        colNum={position.match(/(\d*)$/)[0]}
        noActions={
          !!find(activeScreen.sequences, (item) => item.edit || item.timeError)
        }
        history={history}
        url={url}
      />
    </div>
  );
};

export default compose(
  connect(({ expo: { activeScreen } }) => ({ activeScreen }), {
    updateScreenData,
  }),
  withRouter
)(ScreenZoomIn);
