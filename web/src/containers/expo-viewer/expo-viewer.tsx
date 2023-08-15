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

import ViewWrap from "./view-wrap";
import { FilePreloaderProvider } from "context/file-preloader/file-preloader-provider";
import { DrawerPanelProvider } from "context/drawer-panel-provider/drawer-panel-provider";
import { ViewSection } from "./view-section";

import { ViewLoading } from "containers/views/view-loading/view-loading";

import { get } from "lodash";
import { loadExposition, loadScreen } from "actions/expoActions/viewer-actions";

import { AppDispatch, AppState } from "store/store";
import ViewNotPublic from "containers/views/view-not-public";
import ViewPrepared from "containers/views/view-prepared";
import ViewEnded from "containers/views/view-ended";
import { CollaboratorObj } from "models";
import { GlassMagnifierConfigProvider } from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";

// - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  ({ expo }: AppState) => expo.viewScreen,
  ({ user }: AppState) => user.userName,
  (viewExpo, viewScreen, userName) => ({
    viewExpo,
    viewScreen,
    userName,
  })
);

// takes currently logged in userName and array of all collaborators (people with whom the expo is shared with) + author of the expo itself
// if currently logged in user with its userName has access to this exposition (either collaborator or author), then do not show error or prepared screen
const amExpoCreator = (
  userName: string, // logged in user
  authorUsername?: string,
  collaborators?: CollaboratorObj[]
): boolean => {
  if (authorUsername === userName) {
    return true;
  }

  if (!collaborators || collaborators.length === 0) {
    return false;
  }

  let isCollaborator = false;
  for (let i = 0; i < collaborators.length; i++) {
    const currCollaborator = collaborators[i];
    if (currCollaborator?.collaborator?.username === userName) {
      isCollaborator = true;
    }
  }

  return isCollaborator;
};

// - - -

export const ExpoViewer = () => {
  // Redux hooks
  const { viewExpo, userName } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  // Router, routing hooks
  const match = useRouteMatch<{ name: string }>();
  const history = useHistory();
  const location = useLocation();

  // Default react hooks
  const [viewExpoLoadedAt, setViewExpoLoadedAt] = useState<number | null>(null);
  const [viewScreenIsLoaded, setViewScreenIsLoaded] = useState<boolean>(false);

  // Function responsible for:
  // 1. Fetching the /api/exposition/u/{expoNameUrl}, retrieving back viewExpo body OR true OR false
  // In case when the the expo is in PREPARE or ENDED state and i do not have access (e.g log out user), the response is true if status code is 200, otherwise false
  // In case when the expo body is retrieved, it will set it into redux store.expo.viewExpo
  // 2. Replacing URL, e.g from /view/ReactNewExhibition2023-02-18T152236836Z/start to /view/ReactNewExhibition2023/start
  const handleViewExpoMount = useCallback(async () => {
    const viewExpo = await dispatch(loadExposition(match.params.name)); // can be viewExpo object, true if 200 code or false

    // When logged out user accessing ENDED or PREPARE exposition, url is not present
    // Prevent changing the url to /view/undefined/{section}/{screen}
    if (
      (viewExpo.state === "ENDED" || viewExpo.state === "PREPARE") &&
      !viewExpo.url
    ) {
      setViewExpoLoadedAt(new Date().getTime());
      return;
    }

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

    setViewExpoLoadedAt(new Date().getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, history]);

  // On mount, call the handleViewExpoMount and on unmount
  useEffect(() => {
    handleViewExpoMount();
  }, [handleViewExpoMount]);

  // Function which requires that viewExpo has already been mounted and set in redux store
  // Based on viewExpo and input section and screen args, it will set the redux store.expo.viewScreen
  // section can be "start" | "finish" | number, screen is just a number
  const handleViewScreen = useCallback(
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

  // viewExpo and viewExpoLoadedAt initialized both with falsy values, first viewExpo should be set and then loadedAt
  if ((!viewExpo && !viewExpoLoadedAt) || (viewExpo && !viewExpoLoadedAt)) {
    return <ViewLoading />;
  }

  // Invalid URL - viewExpo null
  if (viewExpoLoadedAt && !viewExpo) {
    return <ViewNotPublic />;
  }

  if (!viewExpo) {
    return <ViewLoading />;
  }

  const hasAccess = amExpoCreator(
    userName as string,
    viewExpo?.author?.username,
    viewExpo?.collaborators
  );

  if (viewExpo.state === "ENDED" && !hasAccess) {
    return (
      <ViewEnded
        closedCaption={viewExpo.closedCaption}
        closedPicture={viewExpo.closedPicture}
        closedUrl={viewExpo.closedUrl}
      />
    );
  }

  if (viewExpo.state === "PREPARE" && !hasAccess) {
    return <ViewPrepared />;
  }

  return (
    <ViewWrap
      title={get(viewExpo, "title")}
      organization={get(viewExpo, "organization")}
      organizationLink={get(viewExpo, "structure.start.organizationLink")}
      expoViewer={true}
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
              <GlassMagnifierConfigProvider>
                <ViewSection
                  name={match.params.name}
                  handleViewScreen={handleViewScreen}
                  setViewScreenIsLoaded={setViewScreenIsLoaded}
                />
              </GlassMagnifierConfigProvider>
            </DrawerPanelProvider>
          </FilePreloaderProvider>
        )}
      />
    </ViewWrap>
  );
};
