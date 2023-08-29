import React, { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const app = document.getElementById("app");

const Container = () => {
    return import.meta.env.DEV ? (
        <Fragment>
            <App />
        </Fragment>
    ) : (
        <StrictMode>
            <App />
        </StrictMode>
    );
};

if (app) {
    createRoot(app).render(<Container />);
}
