import React from "react";
import { RouterProvider } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { Provider as ReduxProvider } from "react-redux";
import { router } from "./router/routes";
import { theme } from "./plugins/material.plugin";
import { store } from "./plugins/redux.plugin";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <StyledEngineProvider injectFirst>
                <ReduxProvider store={store}>
                    <CssBaseline />
                    <RouterProvider router={router} />
                </ReduxProvider>
            </StyledEngineProvider>
        </ThemeProvider>
    );
};

export default App;
