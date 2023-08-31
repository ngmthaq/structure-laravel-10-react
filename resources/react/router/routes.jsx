import { createBrowserRouter } from "react-router-dom";
import PageUserHome from "../pages/User/Home";
import PageStaffLogin from "../pages/Staff/Login";

const userRoutes = {
    home: {
        path: "/",
        element: <PageUserHome />,
    },
};

const staffRoutes = {};

const adminRoutes = {};

const authRoutes = {
    staffLogin: {
        path: "/staff/login",
        element: <PageStaffLogin />,
    },
};

const router = createBrowserRouter([
    ...Object.values(userRoutes),
    ...Object.values(staffRoutes),
    ...Object.values(adminRoutes),
    ...Object.values(authRoutes),
]);

export { userRoutes, staffRoutes, adminRoutes, router };
