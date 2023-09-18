import { Suspense } from "react";
import { Provider } from "react-redux";

import { ThemeProvider } from "@emotion/react";
import theme from "./mui-theme";

import { DialogRefProvider } from "context/dialog-ref-provider/dialog-ref-provider";
import { DrawerPanelProvider } from "context/drawer-panel-provider/drawer-panel-provider";
import { GlassMagnifierConfigProvider } from "context/glass-magnifier-config-provider/glass-magnifier-config-provider";

import { App } from "app";
import { ViewLoading } from "containers/views/view-loading/view-loading";

interface AppProvidersProps {
  store: any;
}

export const AppProviders = ({ store }: AppProvidersProps) => {
  return (
    <Suspense fallback={<ViewLoading />}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DialogRefProvider>
            <DrawerPanelProvider>
              <GlassMagnifierConfigProvider>
                <App />
              </GlassMagnifierConfigProvider>
            </DrawerPanelProvider>
          </DialogRefProvider>
        </ThemeProvider>
      </Provider>
    </Suspense>
  );
};
