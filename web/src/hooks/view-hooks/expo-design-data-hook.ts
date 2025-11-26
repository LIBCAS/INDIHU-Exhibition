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
  const { viewExpo, activeExpo } = useSelector(stateSelector);

  const expositionDesignData = useMemo<ThemeFormDataProcessed | undefined>(
    () => viewExpo?.expositionDesignData ?? activeExpo?.expositionDesignData,
    [activeExpo?.expositionDesignData, viewExpo?.expositionDesignData]
  );

  const isLightMode = useMemo(
    () => !expositionDesignData || expositionDesignData.theme === "LIGHT",
    [expositionDesignData]
  );

  // Applying tailwind classes based on selected theme
  const bgTheming = {
    "bg-light-mode-b": isLightMode,
    "bg-dark-mode-b": !isLightMode,
  };

  const fgTheming = {
    "text-light-mode-f": isLightMode,
    "text-dark-mode-f": !isLightMode,
  };

  const bgFgTheming = { ...bgTheming, ...fgTheming };

  // Applying theme tailwind classes  only if additional constraint is true
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
