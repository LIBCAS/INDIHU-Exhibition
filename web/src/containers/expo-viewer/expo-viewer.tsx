import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  Route,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";

import { Helmet } from "react-helmet";

import ViewWrap from "components/views/view-wrap";
import { FilePreloaderProvider } from "context/file-preloader/file-preloader-provider";
import { DrawerPanelProvider } from "context/drawer-panel-preloader/drawer-panel-provider";
import { ViewSection } from "./view-section";

import { ViewLoading } from "containers/views/view-loading/view-loading";

import { get } from "lodash";
import {
  loadExposition,
  loadScreen,
  turnSoundOff,
} from "actions/expoActions/viewer-actions";

import { AppDispatch, AppState } from "store/store";

// - - -

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
  // Redux hooks
  const { viewExpo, viewInteractive } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  // Router, routing hooks
  const match = useRouteMatch<{ name: string }>();
  const history = useHistory();
  const location = useLocation();
  // Default react hooks
  const [loadedAt, setLoadedAt] = useState<number>();
  const [viewScreenIsLoaded, setViewScreenIsLoaded] = useState<boolean>(false);

  // HandleMount!
  const handleMount = useCallback(async () => {
    // GET at /api/exposition/u/:url==ReactNewExhibition2023, after fetch dispatch into viewExpo redux
    // Replacing http://localhost:3000/view/ReactNewExhibition2023-02-18T152236836Z/start to http://localhost:3000/view/ReactNewExhibition2023/start
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

  //
  useEffect(() => {
    handleMount();

    return () => {
      turnSoundOff(false);
    };
  }, [handleMount]);

  // handleScreen(section, screen), dispatch into viewScreen redux by looking into viewExpo
  // returns viewScreen which was set to the redux store or false
  //->> section: "start" | "finish" | number
  //->> screen: number
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
            <DrawerPanelProvider>
              <ViewSection
                name={match.params.name}
                handleScreen={handleScreen}
                setViewScreenIsLoaded={setViewScreenIsLoaded}
              />
            </DrawerPanelProvider>
          </FilePreloaderProvider>
        )}
      />
    </ViewWrap>
  );
};
