import React, { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

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
