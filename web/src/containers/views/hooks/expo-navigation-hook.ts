import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { useDrawerPanel } from "context/drawer-panel-preloader/drawer-panel-provider";

import { AppState } from "store/store";
import { viewerRouter } from "utils";

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  (viewExpo) => ({
    viewExpo,
  })
);

export const useExpoNavigation = () => {
  const { viewExpo } = useSelector(stateSelector);
  const { name, section, screen } = useParams<{
    name: string;
    section: string;
    screen: string;
  }>();
  const { push } = useHistory();
  const {
    closeDrawerWithoutMarking,
    openDrawerWithoutMarking,
    getMarkStatusOfScreen,
  } = useDrawerPanel();

  // 1.) NavigateBack
  const navigateBack = useCallback(() => {
    const view = viewerRouter(name, viewExpo, section, screen, false);

    // If Drawer was previously open.. open otherwise keep closed
    const viewTokens = view.split("/");
    const l = viewTokens.length;
    if (viewTokens[l - 1] === "start" || viewTokens[l - 1] === "finish") {
      push(view);
      return;
    }

    const prevSection = viewTokens[l - 2];
    const prevScreen = viewTokens[l - 1];
    const status = getMarkStatusOfScreen(prevSection, prevScreen);
    if (status) {
      openDrawerWithoutMarking();
    } else {
      closeDrawerWithoutMarking();
    }

    push(view);
  }, [
    name,
    push,
    screen,
    section,
    viewExpo,
    getMarkStatusOfScreen,
    openDrawerWithoutMarking,
    closeDrawerWithoutMarking,
  ]);

  // 2.) NavigateForward
  const navigateForward = useCallback(() => {
    const view = viewerRouter(name, viewExpo, section, screen, true);

    // If Drawer was previously open.. open otherwise keep closed
    const viewTokens = view.split("/");
    const l = viewTokens.length;
    if (viewTokens[l - 1] === "start" || viewTokens[l - 1] === "finish") {
      push(view);
      return;
    }

    const nextSection = viewTokens[l - 2];
    const nextScreen = viewTokens[l - 1];
    const status = getMarkStatusOfScreen(nextSection, nextScreen);
    if (status) {
      openDrawerWithoutMarking();
    } else {
      closeDrawerWithoutMarking();
    }

    push(view);
  }, [
    name,
    push,
    screen,
    section,
    viewExpo,
    getMarkStatusOfScreen,
    openDrawerWithoutMarking,
    closeDrawerWithoutMarking,
  ]);

  // - - -

  return { navigateBack, navigateForward };
};
