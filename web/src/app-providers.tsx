import { Suspense, useMemo } from "react";
import { ViewLoading } from "containers/views/view-loading/view-loading";
import { Provider } from "react-redux";

import { ThemeProvider } from "@emotion/react";
import { getMuiTheme } from "mui-theme";
import { createTheme } from "@mui/material";

import { DialogRefProvider } from "context/dialog-ref-provider/dialog-ref-provider";

import { App } from "app";
import { useExpoDesignData } from "hooks/view-hooks/expo-design-data-hook";
import { BrowserRouter } from "react-router-dom";
import { MediaDeviceProvider } from "context/media-device-provider/media-device-provider";
import { ActiveExpoAccessProvider } from "context/active-expo-access-provider/active-expo-access-provider";

// - - -

interface AppProvidersProps {
  store: any;
}

export const AppProviders = ({ store }: AppProvidersProps) => {
  return (
    <Suspense fallback={<ViewLoading />}>
      <Provider store={store}>
        <AppProviders2 />
      </Provider>
    </Suspense>
  );
};

// - - -

// Helper component in order to access redux store, so need to be wrapped inside <Provider>
// Redux store needs to be accessed for current lightMode property to set correctly MUI Theming
const AppProviders2 = () => {
  const { isLightMode } = useExpoDesignData();

  const theme = useMemo(
    () => createTheme(getMuiTheme(isLightMode)),
    [isLightMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <DialogRefProvider>
        <MediaDeviceProvider>
          <ActiveExpoAccessProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ActiveExpoAccessProvider>
        </MediaDeviceProvider>
      </DialogRefProvider>
    </ThemeProvider>
  );
};
