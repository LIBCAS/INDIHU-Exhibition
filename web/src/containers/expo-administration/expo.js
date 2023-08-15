import { withRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import { get } from "lodash";
import { compose, lifecycle } from "recompose";
import { Helmet } from "react-helmet";

import AppHeader from "../../components/app-header";
import TabMenu from "../../components/tab-menu";
import Structure from "./expo-structure";
import Files from "./expo-files";
import Settings from "./expo-settings";
import Sharing from "./expo-sharing";
import Editor from "../expo-editor";

import { loadExpo } from "../../actions/expoActions";
import { getCurrentUser } from "../../actions/user-actions";
import ExpoTheme from "containers/expo-administration/expo-theme/expo-theme";

const Expo = (props) => {
  const { activeExpo, match, location } = props;
  const screenEditor = /^.*\/screen.*$/.test(location.pathname);
  return (
    <div>
      <Helmet>
        <title>{`INDIHU Exhibition${
          get(activeExpo, "title") ? ` - ${get(activeExpo, "title")}` : ""
        }`}</title>
        <meta name="description" content="Editace výstavy" />
      </Helmet>
      <AppHeader expoStyle={!screenEditor} screenStyle={screenEditor} />
      {!screenEditor && (
        <TabMenu
          tabs={[
            {
              label: "Struktura výstavy",
              link: `/expo/${activeExpo.id}/structure`,
            },
            { label: "Soubory", link: `/expo/${activeExpo.id}/files` },
            { label: "Nastavení", link: `/expo/${activeExpo.id}/settings` },
            { label: "Sdílení", link: `/expo/${activeExpo.id}/sharing` },
            { label: "Motív", link: `/expo/${activeExpo.id}/theme` },
          ]}
        />
      )}
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
        path={`${match.url}/theme`}
        render={() => <ExpoTheme {...props} />}
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
      activeExpo,
    }),
    { loadExpo, getCurrentUser }
  ),
  lifecycle({
    UNSAFE_componentWillMount() {
      const { getCurrentUser } = this.props;

      getCurrentUser();
    },
    async componentDidMount() {
      const { match, loadExpo } = this.props;
      await loadExpo(match.params.id);
    },
  })
)(Expo);
