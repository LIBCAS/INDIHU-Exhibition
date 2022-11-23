import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter, Route } from "react-router-dom";

import TabMenu from "../../components/tab-menu";
import Description from "../../components/editors/screen-description";
import ExternalData from "../../components/editors/external/external-data";
import Documents from "../../components/editors/documents";
import Footer from "../../components/editors/footer";

import { updateScreenData } from "../../actions/expoActions";

const ScreenExternal = (props) => {
  const { match, activeScreen, history, url } = props;
  const { position } = match.params;
  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: "Název, popis, audio",
            link: `${match.url}/description`,
          },
          {
            label: "Externí data",
            link: `${match.url}/externalData`,
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
        path={`${match.url}/externalData`}
        render={() => <ExternalData {...props} />}
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
)(ScreenExternal);
