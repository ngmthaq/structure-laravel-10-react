import React, { Fragment } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes";

const App = () => {
    return (
        <Fragment>
            <RouterProvider router={router} />
        </Fragment>
    );
};

export default App;
