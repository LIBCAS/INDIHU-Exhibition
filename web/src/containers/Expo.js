import React from "react";
import { withRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { Helmet } from 'react-helmet';

import AppHeader from "../components/AppHeader";
import TabMenu from "../components/TabMenu";
import Structure from "../components/expo/structure";
import Files from "../components/expo/files";
import Settings from "../components/expo/settings";
import Sharing from "../components/expo/sharing";
import Editor from "./ExpoEditor";

import { loadExpo } from "../actions/expoActions";
import { getCurrentUser } from "../actions/userActions";

const Expo = props => {
  const { activeExpo, match, location } = props;
  const screenEditor = /^.*\/screen.*$/.test(location.pathname);
  return (
    <div>
      <Helmet>
        <title>{`INDIHU - ${activeExpo.title}`}</title>
        <meta name="description" content="Editace výstavy" />
      </Helmet>
      <AppHeader expoStyle={!screenEditor} screenStyle={screenEditor} />
      {!screenEditor &&
        <TabMenu
          tabs={[
            {
              label: "Struktura výstavy",
              link: `/expo/${activeExpo.id}/structure`
            },
            { label: "Soubory", link: `/expo/${activeExpo.id}/files` },
            { label: "Nastavení", link: `/expo/${activeExpo.id}/settings` },
            { label: "Sdílení", link: `/expo/${activeExpo.id}/sharing` }
          ]}
        />}
      <Route
        path={`${match.url}/structure`}
        render={() => <Structure {...props} />}
      />
      <Route path={`${match.url}/files`} render={() => <Files {...props} />} />
      <Route
        path={`${match.url}/settings`}
        render={() => <Settings {...props} />}
      />
      <Route
        path={`${match.url}/sharing`}
        render={() => <Sharing {...props} />}
      />
      <Route
        path={`${match.url}/screen`}
        render={() => <Editor {...props} />}
      />
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    ({ expo: { activeExpo } }) => ({
      activeExpo
    }),
    { loadExpo, getCurrentUser }
  ),
  lifecycle({
    componentWillMount() {
      const { getCurrentUser } = this.props;

      getCurrentUser();
    },
    async componentDidMount() {
      const { match, loadExpo } = this.props;
      await loadExpo(match.params.id);
    }
  })
)(Expo);
