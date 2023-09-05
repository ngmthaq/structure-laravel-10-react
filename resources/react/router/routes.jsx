import { createBrowserRouter } from "react-router-dom";
import { PageUserHome } from "../pages/User/Home";
import { PageStaffLogin } from "../pages/Staff/Login";
import { UserManagement } from "../pages/Staff/UserManagement";

export const userRoutes = {
    home: {
        path: "/",
        element: <PageUserHome />,
    },
};

export const staffRoutes = {};

export const adminRoutes = {
    userManagement: {
        path: "/admin/manage/users",
        element: <UserManagement />,
    },
};

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
