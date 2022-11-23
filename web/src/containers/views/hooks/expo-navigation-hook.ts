import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

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

  const navigateBack = useCallback(() => {
    const view = viewerRouter(name, viewExpo, section, screen, false);
    push(view);
  }, [name, push, screen, section, viewExpo]);

  const navigateForward = useCallback(() => {
    const view = viewerRouter(name, viewExpo, section, screen, true);
    push(view);
  }, [name, push, screen, section, viewExpo]);

  return { navigateBack, navigateForward };
};
