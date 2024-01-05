import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation } from "react-i18next";

import {
  useRouteMatch,
  useLocation,
  Route,
  useHistory,
} from "react-router-dom";
import { Helmet } from "react-helmet";

// Components
import AppHeader from "components/app-header/AppHeader";
import TabMenu from "components/tab-menu";
import LoaderScreen from "components/loaders/loader-screen";

import Structure from "./expo-structure";
import Files from "./expo-files";
import ExpoSettings from "./expo-settings/expo-settings";
import ExpoRating from "./expo-rating/expo-rating";
import ExpoTheme from "./expo-theme/expo-theme";
import Editor from "./expo-editor/ExpoEditor";

// Models
import { ActiveExpo } from "models";
import { AppState } from "store/store";
import { AppDispatch } from "store/store";

// Utils and actions
import { getCurrentUser } from "actions/user-actions";
import { loadExpo, clearActiveExpo } from "actions/expoActions";
import { showLoader } from "actions/app-actions";
import { isEmpty } from "lodash";
import { InformationDialog } from "components/dialogs/information-dialog/information-dialog";

const expoStateSelector = createSelector(
  ({ expo }: AppState) => expo.activeExpo as ActiveExpo,
  (activeExpo) => ({ activeExpo })
);

// - -

const Expo = () => {
  const { t } = useTranslation("expo");
  const { activeExpo } = useSelector(expoStateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const history = useHistory<{ id: string }>();
  const match = useRouteMatch<{ id: string }>();
  const location = useLocation();
  const screenEditor = /^.*\/screen.*$/.test(location.pathname);

  //
  const [expoFetchResult, setExpoFetchResult] = useState<
    "unauthorized" | "not-found" | null
  >(null);

  useEffect(() => {
    const handleExpoMount = async () => {
      dispatch(showLoader(true));
      dispatch(getCurrentUser());
      const respStatus = await dispatch(loadExpo(match.params.id));

      if (typeof respStatus === "number") {
        setExpoFetchResult(
          respStatus === 403
            ? "unauthorized"
            : respStatus === 404
            ? "not-found"
            : null
        );
      }

      dispatch(showLoader(false));
    };
    handleExpoMount();

    return () => {
      const handleUnMount = async () => dispatch(clearActiveExpo());
      handleUnMount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (expoFetchResult === "not-found" || expoFetchResult === "unauthorized") {
    return (
      <InformationDialog
        closeThisDialog={() => history.replace("/exhibitions")}
        title={
          expoFetchResult === "not-found"
            ? t("expoNotFoundTitle")
            : t("expoUnauthorizedAccessTitle")
        }
        content={
          expoFetchResult === "not-found"
            ? t("expoNotFoundText")
            : t("expoUnauthorizedAccessText")
        }
        big
      />
    );
  }

  if (isEmpty(activeExpo) || !activeExpo) {
    return <LoaderScreen />;
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
              label: t("structure.tab"),
              link: `/expo/${activeExpo.id}/structure`,
            },
            { label: t("files.tab"), link: `/expo/${activeExpo.id}/files` },
            {
              label: t("settingsAndSharing.tab"),
              link: `/expo/${activeExpo.id}/settings`,
            },
            {
              label: t("rating.tab"),
              link: `/expo/${activeExpo.id}/rating`,
            },
            { label: t("theming.tab"), link: `/expo/${activeExpo.id}/theme` },
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
        render={() => <ExpoSettings activeExpo={activeExpo} />}
      />
      <Route
        path={`${match.url}/rating`}
        render={() => <ExpoRating activeExpo={activeExpo} />}
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
