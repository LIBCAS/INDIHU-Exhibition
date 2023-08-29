import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useRouteMatch, useLocation, Route } from "react-router-dom";
import { Helmet } from "react-helmet";

import AppHeader from "components/app-header";
import TabMenu from "components/tab-menu";

import Structure from "./expo-structure";
import Files from "./expo-files";
import Settings from "./expo-settings";
import Sharing from "./expo-sharing";
import ExpoTheme from "./expo-theme/expo-theme";
import Editor from "./expo-editor/ExpoEditor";
// import Editor from "./expo-editor";

import { ActiveExpo } from "models";
import { AppState } from "store/store";
import { AppDispatch } from "store/store";

import { getCurrentUser } from "actions/user-actions";
import { loadExpo } from "actions/expoActions";
import { isEmpty } from "lodash";

const expoStateSelector = createSelector(
  ({ expo }: AppState) => expo.activeExpo as ActiveExpo,
  (activeExpo) => ({ activeExpo })
);

// - -

const Expo = () => {
  const { activeExpo } = useSelector(expoStateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const match = useRouteMatch<{ id: string }>();
  const location = useLocation();
  const screenEditor = /^.*\/screen.*$/.test(location.pathname);

  useEffect(() => {
    const handleExpoMount = async () => {
      dispatch(getCurrentUser());
      await dispatch(loadExpo(match.params.id));
    };

    handleExpoMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeExpo || isEmpty(activeExpo)) {
    return null;
  }

  return (
    <div>
      <Helmet>
        <title>
          {`INDIHU Exhibition${
            activeExpo?.title ? ` - ${activeExpo.title}` : ""
          }`}
        </title>
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
        render={() => <Structure activeExpo={activeExpo} />}
      />
      <Route
        path={`${match.url}/files`}
        render={() => <Files activeExpo={activeExpo} />}
      />
      <Route
        path={`${match.url}/settings`}
        render={() => <Settings activeExpo={activeExpo} />}
      />
      <Route
        path={`${match.url}/sharing`}
        render={() => <Sharing activeExpo={activeExpo} />}
      />
      <Route
        path={`${match.url}/theme`}
        render={() => <ExpoTheme activeExpo={activeExpo} />}
      />
      <Route
        path={`${match.url}/screen`}
        render={() => <Editor activeExpo={activeExpo} />}
      />
    </div>
  );
};

export default Expo;
