import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Types
import { AppState } from "store/store";
import { ThemeFormDataProcessed } from "containers/expo-administration/expo-theme/models";

// Utils
import { palette } from "palette";

// - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.viewExpo,
  ({ expo }: AppState) => expo.activeExpo,
  (viewExpo, activeExpo) => ({ viewExpo, activeExpo })
);

// - - - - - -

export const useExpoDesignData = () => {
  // NOTE: activeExpo is present inside administration screens, viewExpo is present inside view screens
  const { viewExpo, activeExpo } = useSelector(stateSelector);

  /**
   * Returns the exposition design data for the current exposition,
   * whether the user is in the administration section or viewing screens.
   */
  const expositionDesignData = useMemo<ThemeFormDataProcessed | undefined>(
    () => viewExpo?.expositionDesignData ?? activeExpo?.expositionDesignData,
    [activeExpo?.expositionDesignData, viewExpo?.expositionDesignData]
  );

  /**
   * In administration screens, light mode is always forced (viewExpo is null).
   * In view screens, light mode is used only if it is explicitly configured.
   */
  const isLightMode = useMemo<boolean>(() => {
    const isAdministrationScreen = viewExpo === null;
    if (isAdministrationScreen) {
      return true;
    }

    if (expositionDesignData === undefined) {
      return true;
    }

    return expositionDesignData.theme === "LIGHT";
  }, [viewExpo, expositionDesignData]);

  // - - - Applying tailwind classes, based on the currently active theme - - -

  const bgTheming = {
    "bg-light-mode-b": isLightMode,
    "bg-dark-mode-b": !isLightMode,
  };

  const fgTheming = {
    "text-light-mode-f": isLightMode,
    "text-dark-mode-f": !isLightMode,
  };

  const bgFgTheming = { ...bgTheming, ...fgTheming };

  // - - - Applying tailwind classes, only if additional constraint is true - - -

  const bgThemingIf = (constraint: boolean) => {
    if (constraint) {
      return bgTheming;
    }
    return {};
  };

  const fgThemingIf = (constraint: boolean) => {
    if (constraint) {
      return fgTheming;
    }
    return {};
  };

  const bfFgThemingIf = (constraint: boolean) => {
    if (constraint) {
      return { ...bgThemingIf(constraint), ...fgThemingIf(constraint) };
    }
    return {};
  };

  // - - - Return value - - -

  return {
    expoDesignData: expositionDesignData,
    isLightMode,
    bgTheming,
    fgTheming,
    bgFgTheming,
    bgThemingIf,
    fgThemingIf,
    bfFgThemingIf,
    palette,
  };
};
