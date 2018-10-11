import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter, Route } from "react-router-dom";

import TabMenu from "../../components/TabMenu";
import Description from "../../components/editors/start/Description";
import Authors from "../../components/editors/start/Authors";
import Documents from "../../components/editors/Documents";
import Footer from "../../components/editors/Footer";

import { updateScreenData } from "../../actions/expoActions";

const Screenstart = props => {
  const { match, activeScreen, history, url } = props;

  return (
    <div>
      <TabMenu
        tabs={[
          {
            label: "Název, popis, audio",
            link: `${match.url}/description`
          },
          {
            label: "Tiráž",
            link: `${match.url}/authors`
          },
          {
            label: "Dokumenty",
            link: `${match.url}/documents`
          }
        ]}
      />
      <Route
        path={`${match.url}/description`}
        render={() => <Description {...props} />}
      />
      <Route
        path={`${match.url}/authors`}
        render={() => <Authors {...props} />}
      />
      <Route
        path={`${match.url}/documents`}
        render={() => <Documents {...props} />}
      />
      <Footer
        activeExpo={props.activeExpo}
        activeScreen={activeScreen}
        history={history}
        url={url}
        type="start"
        noActions={
          isNaN(Number(activeScreen.expoTime)) ||
          Number(activeScreen.expoTime) > 1000000000
        }
        noActionTitle="Zadána neplatná hodnota"
        noActionText="U pole s délkou trvání výstavy byla zadána neplatná hodnota."
      />
    </div>
  );
};

export default compose(
  connect(({ expo: { activeScreen } }) => ({ activeScreen }), {
    updateScreenData
  }),
  withRouter
)(Screenstart);
