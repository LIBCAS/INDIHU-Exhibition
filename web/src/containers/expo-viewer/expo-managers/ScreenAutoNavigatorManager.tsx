import { FC, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useExpoNavigation } from "hooks/view-hooks/expo-navigation-hook";
import { useScreenDataByScreenId } from "hooks/view-hooks/useScreenDataByScreenId";

import { AppDispatch, AppState } from "store/store";

import { mapScreenTypeValuesToKeys } from "enums/screen-type";
import { automaticRouting } from "enums/screen-type";
import { setViewProgress } from "actions/expoActions/viewer-actions";
// - - -

const navigatorSelector = createSelector(
  ({ expo }: AppState) => expo.viewScreen,
  ({ expo }: AppState) => expo.viewProgress,
  (viewScreen, viewProgress) => ({
    viewScreen,
    viewProgress,
  })
);

// - - -

/**
 * All screens other than START, FINISH and Game screens are set with shouldRedirect = true.
 * That means, if time of the screen elapsed && shouldRedirect == true, then move to the next screen automatically.
 *
 * Also, the SIGNPOST screen has a special behavior, its next screen is set in the administration.
 */
const ScreenAutoNavigatorManager: FC = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { viewScreen, viewProgress } = useSelector(navigatorSelector);
  const { totalTime, timeElapsed, shouldRedirect } = viewProgress;

  const { navigateForward } = useExpoNavigation();

  const doesTimeRanOut = useMemo(
    () => timeElapsed >= totalTime,
    [timeElapsed, totalTime]
  );

  // - -

  // Handle settings of the viewProgress.shouldRedirect, based on current viewScreen type
  useEffect(() => {
    if (!viewScreen?.type) {
      return;
    }

    const shouldRedirect =
      !!automaticRouting[mapScreenTypeValuesToKeys[viewScreen.type]];

    dispatch(setViewProgress({ shouldRedirect }));
  }, [dispatch, viewScreen?.type]);

  // - -

  const history = useHistory();

  const signpostNavigate =
    viewScreen?.type === "SIGNPOST"
      ? viewScreen.nextScreenReference ?? null
      : null;

  const { screenReferenceUrl: signpostScreenReferenceUrl } =
    useScreenDataByScreenId(signpostNavigate) ?? {};

  // - -

  useEffect(() => {
    if (shouldRedirect && doesTimeRanOut) {
      if (signpostScreenReferenceUrl) {
        history.push(signpostScreenReferenceUrl);
      } else {
        navigateForward();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doesTimeRanOut, shouldRedirect, signpostScreenReferenceUrl]);

  return <>{children}</>;
};

export default ScreenAutoNavigatorManager;
