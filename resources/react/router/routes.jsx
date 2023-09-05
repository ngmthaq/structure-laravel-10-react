import { createBrowserRouter } from "react-router-dom";
import { PageUserHome } from "../pages/User/Home";
import { PageStaffLogin } from "../pages/Staff/Login";

export const userRoutes = {
    home: {
        path: "/",
        element: <PageUserHome />,
    },
};

export const staffRoutes = {};

export const adminRoutes = {};

export const authRoutes = {
    staffLogin: {
        path: "/staff/login",
        element: <PageStaffLogin />,
    },
};

export const router = createBrowserRouter([
    ...Object.values(userRoutes),
    ...Object.values(staffRoutes),
    ...Object.values(adminRoutes),
    ...Object.values(authRoutes),
]);
