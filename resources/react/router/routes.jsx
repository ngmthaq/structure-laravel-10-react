import { createBrowserRouter } from "react-router-dom";
import PageUserHome from "../pages/User/Home";

const userRoutes = {
    home: {
        path: "/",
        element: <PageUserHome />,
    },
};

const staffRoutes = {};

const adminRoutes = {};

const router = createBrowserRouter(
    Object.values(Object.assign({}, userRoutes, staffRoutes, adminRoutes))
);

export { userRoutes, staffRoutes, adminRoutes, router };
