import React from "react";
import { RouterProvider } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { router } from "./router/routes";
import { theme } from "./plugins/material.plugin";
import { store } from "./plugins/redux.plugin";
import { EvenBusContext, eventBus } from "./plugins/bus.plugin";
import { PrimaryNotificationComponent } from "./components/PrimaryNotification";
import { LinearLoadingComponent } from "./components/LinearLoading";

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <ReduxProvider store={store}>
          <EvenBusContext.Provider value={eventBus}>
            <CssBaseline />
            <RouterProvider router={router} />
            <PrimaryNotificationComponent />
            <LinearLoadingComponent />
          </EvenBusContext.Provider>
        </ReduxProvider>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};
