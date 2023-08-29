import React, { Fragment } from "react";
import { RouterProvider } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { router } from "./router/routes";
import { theme } from "./plugins/material.plugin";

const App = () => {
    return (
        <Fragment>
            <ThemeProvider theme={theme}>
                <StyledEngineProvider injectFirst>
                    <CssBaseline />
                    <RouterProvider router={router} />
                </StyledEngineProvider>
            </ThemeProvider>
        </Fragment>
    );
};

export default App;
