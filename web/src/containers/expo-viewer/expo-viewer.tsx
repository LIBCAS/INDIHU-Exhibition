import { useCallback, useEffect, useState } from "react";
import { createSelector } from "reselect";
import { get } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  Route,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";

import { AppDispatch, AppState } from "store/store";
import {
  loadExposition,
  loadScreen,
  turnSoundOff,
} from "actions/expoActions/viewer-actions";
import ViewWrap from "components/views/view-wrap";
import { FilePreloaderProvider } from "context/file-preloader/file-preloader-provider";
import { ViewLoading } from "containers/views/view-loading/view-loading";

import { ViewSection } from "./view-section";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.viewInteractive,
  (viewExpo, viewScreen, viewInteractive) => ({
    viewExpo,
    viewScreen,
    viewInteractive,
  })
);

export const ExpoViewer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const match = useRouteMatch<{ name: string }>();
  const history = useHistory();
  const location = useLocation();
  const { viewExpo, viewInteractive } = useSelector(stateSelector);
  const [loadedAt, setLoadedAt] = useState<number>();
  const [viewScreenIsLoaded, setViewScreenIsLoaded] = useState(false);

  const handleMount = useCallback(async () => {
    const viewExpo = await dispatch(loadExposition(match.params.name));

    if (viewExpo && match.url.replace(/^\/view\//, "") !== viewExpo.url) {
      const newUrl = location.pathname.replace(
        new RegExp(
          `^${match.url.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1")}`,
          "g"
        ),
        `/view/${viewExpo.url}`
      );

      history.replace(
        newUrl === `/view/${viewExpo.url}` ||
          newUrl === `/view/${viewExpo.url}/`
          ? `${newUrl.replace(/\/$/g, "")}/start`
          : newUrl
      );
    } else if (match.url === location.pathname) {
      history.replace(`${match.url.replace(/\/$/g, "")}/start`);
    }

    setLoadedAt(new Date().getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, history]);

  useEffect(() => {
    handleMount();

    return () => {
      turnSoundOff(false);
    };
  }, [handleMount]);

  const handleScreen = useCallback(
    async ({ section, screen }) => {
      const viewScreen = await dispatch(loadScreen(section, screen));

      if (!viewScreen) {
        history.push(`${match.url}/error`);
        return null;
      }
      return viewScreen;
    },
    [dispatch, history, match.url]
  );

  if (!loadedAt && viewExpo) return <ViewLoading />;

  if (!viewExpo) return <ViewLoading />;

  return (
    <ViewWrap
      title={get(viewExpo, "title")}
      organization={get(viewExpo, "organization")}
      organizationLink={get(viewExpo, "structure.start.organizationLink")}
      expoViewer={true}
      viewInteractive={viewInteractive}
      progressEnabled={viewScreenIsLoaded}
    >
      <Helmet>
        <title>{viewExpo.title}</title>
        <meta
          name="description"
          content={get(viewExpo, "structure.start.perex")}
        />
      </Helmet>
      <Route
        path={`${match.path}/:section/:screen?`}
        render={() => (
          <FilePreloaderProvider>
            <ViewSection
              name={match.params.name}
              handleScreen={handleScreen}
              setViewScreenIsLoaded={setViewScreenIsLoaded}
            />
          </FilePreloaderProvider>
        )}
      />
    </ViewWrap>
  );
};
