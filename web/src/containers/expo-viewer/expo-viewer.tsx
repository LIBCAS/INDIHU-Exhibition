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

import { FilePreloaderProvider } from "context/file-preloader/file-preloader-provider";
import { DrawerPanelProvider } from "context/drawer-panel-provider/drawer-panel-provider";
import { GlassMagnifierConfigProvider } from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";

import ViewWrap from "./view-wrap";
import { ViewSection } from "./view-section";
import { ViewLoading } from "containers/views/view-loading/view-loading";
import ViewInvalidUrl from "containers/views/view-invalid-url";
import ViewPrepared from "containers/views/view-prepared";
import ViewEnded from "containers/views/view-ended";

import { AppDispatch, AppState } from "store/store";

import { get } from "lodash";
import { loadExposition, loadScreen } from "actions/expoActions/viewer-actions";
import { haveAccessToExpo } from "utils";

// import react-tooltip custom designs
import "./tooltip-style.scss";

// - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  ({ expo }: AppState) => expo.viewScreen,
  ({ user }: AppState) => user.userName,
  ({ user }: AppState) => user.role,
  (viewExpo, viewScreen, userName, role) => ({
    viewExpo,
    viewScreen,
    userName,
    role,
  })
);

// - - -

export const ExpoViewer = () => {
  const { viewExpo, userName, role } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const match = useRouteMatch<{ name: string }>();
  const history = useHistory();
  const location = useLocation();

  const [viewExpoLoadedAt, setViewExpoLoadedAt] = useState<number | null>(null);
  const [viewScreenIsLoaded, setViewScreenIsLoaded] = useState<boolean>(false);

  // Function responsible for:
  // 1. Fetching the /api/exposition/u/{expoNameUrl}, retrieving back viewExpo body and setting it to the redux store.expo.viewExpo
  // Fetched viewExpo body can be also empty (in redux stays null)
  // Functions returns viewExpo body if not empty, true if viewExpo body is empty and status code === 200, false if empty body and error status code
  // 2. Responsible also for replacing URLs
  // First use case  -> /view/ReactNewExhibition2023-02-18T152236836Z TO /view/ReactNewExhibition (custom url set in settings)
  // Second use case -> /view/ReactNewExhibition TO /view/ReactNewExhibition/start  (appending start route)
  const handleViewExpoMount = useCallback(async () => {
    const wExpo = await dispatch(loadExposition(match.params.name)); // can be viewExpo object, true if 200 code or false

    // Response was empty body, true if 200 status code, otherwise false
    // As response was empty, nothing was set to redux store.viewExpo (is currently null)
    // Use case when invalid url was supplied
    if (wExpo === true || wExpo === false) {
      setViewExpoLoadedAt(new Date().getTime());
      return;
    }

    const isExpoNotOpened =
      wExpo.state === "ENDED" || wExpo.state === "PREPARE";

    // Use case when user is logged out and exposition is not null, but not in opened state
    if (!userName && isExpoNotOpened) {
      setViewExpoLoadedAt(new Date().getTime());
      return;
    }

    // Use case when user is logged in, exposition is not null, but not in opened state and user does not have access to the expo
    const userHasAccess = haveAccessToExpo(
      role,
      userName,
      wExpo?.author?.username,
      wExpo?.collaborators
    );
    if (userName && isExpoNotOpened && !userHasAccess) {
      setViewExpoLoadedAt(new Date().getTime());
      return;
    }

    // REPLACING URLS
    // Either go from /view/ReactNewExhibition2023-02-18T152236836Z TO /view/ReactNewExhibition AND TO /view/ReactNewExhibition/start
    // OR directly from /view/ReactNewExhibition TO /view/ReactNewExhibition/start
    // HOWEVER /view/ReactNewExhibition2023-02-18T152236836Z/start CAN also be valid!! if custom url in settings was not set!!
    // (custom default url which was set is in fetched wExpo.url, if custom url was not set.. it contains the default url with dates)
    const matchUrlWithoutView = match.url.replace(/^\/view\//, "");
    if (wExpo && wExpo.url && matchUrlWithoutView !== wExpo.url) {
      const newUrl = location.pathname.replace(
        new RegExp(
          `^${match.url.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1")}`,
          "g"
        ),
        `/view/${wExpo.url}`
      );

      history.replace(
        newUrl === `/view/${wExpo.url}` || newUrl === `/view/${wExpo.url}/`
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
  // Based on viewExpo and input section and screen args, it will set the redux store.expo.viewScreen (from viewExpo.structure)
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
    return <ViewInvalidUrl />;
  }

  if (!viewExpo) {
    return <ViewLoading />;
  }

  const userHasAccess = haveAccessToExpo(
    role,
    userName,
    viewExpo?.author?.username,
    viewExpo?.collaborators
  );

  if (viewExpo.state === "ENDED" && !userHasAccess) {
    return (
      <ViewEnded
        closedCaption={viewExpo.closedCaption}
        closedPicture={viewExpo.closedPicture}
        closedUrl={viewExpo.closedUrl}
      />
    );
  }

  if (viewExpo.state === "PREPARE" && !userHasAccess) {
    return <ViewPrepared />;
  }

  // Exposition which was successfully fetched and is not null
  // Exposition which is in OPENED state
  // Exposition which is in PREPARE or ENDED state, but user has access to it (author or collaborator)
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
                  expoId={viewExpo.id}
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
