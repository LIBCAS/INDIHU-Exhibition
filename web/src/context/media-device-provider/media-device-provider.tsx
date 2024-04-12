import { useContext, createContext, ReactNode } from "react";

import { useMediaQuery } from "@mui/material";
import { breakpoints } from "hooks/media-query-hook/breakpoints";
import { orientation } from "hooks/media-query-hook/orientation";
// - - -

type MediaDeviceProviderContextType = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;
  isLandscape: boolean;
  isMobileLandscape: boolean;
};

const MediaDeviceProviderContext =
  createContext<MediaDeviceProviderContextType>(undefined as never);

// - - -

type MediaDeviceProviderProps = {
  children: ReactNode;
};

export const MediaDeviceProvider = ({ children }: MediaDeviceProviderProps) => {
  const isSm = useMediaQuery(breakpoints.down("sm"));
  const isMd = useMediaQuery(breakpoints.down("md"));
  const isLg = useMediaQuery(breakpoints.down("lg"));
  const isXl = useMediaQuery(breakpoints.down("xl"));
  const is2Xl = useMediaQuery(breakpoints.down("2xl"));

  // true when the width is bigger than height
  const isLandscape = useMediaQuery(orientation.isLandscape());

  const isMobile = isSm;
  const isTablet = isLg && !isSm;
  const isDesktop = !isLg;

  const isMobileLandscape = useMediaQuery(
    "(orientation: landscape) and (max-height: 500px)"
  );

  return (
    <MediaDeviceProviderContext.Provider
      value={{
        isMobile,
        isTablet,
        isDesktop,
        isSm,
        isMd,
        isLg,
        isXl,
        is2Xl,
        isLandscape,
        isMobileLandscape,
      }}
    >
      {children}
    </MediaDeviceProviderContext.Provider>
  );
};

// - - -

export const useMediaDevice = () => useContext(MediaDeviceProviderContext);
