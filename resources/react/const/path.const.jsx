import { PageUserHome } from "../pages/User/Home";
import { PageStaffLogin } from "../pages/Staff/Login";
import { UserManagement } from "../pages/Staff/UserManagement";
import { StaffManagement } from "../pages/Staff/StaffManagement";
import { TableManagement } from "../pages/Staff/TableManagement";
import { BillManagement } from "../pages/Staff/BillManagement";
import { Dashboard } from "../pages/Staff/Dashboard";
import { StaffOrder } from "../pages/Staff/StaffOrder";
import { StaffOrderHistory } from "../pages/Staff/StaffOrderHistory";
import { EditTableMap } from "../pages/Staff/EditTableMap";
import { CreateNewTable } from "../pages/Staff/CreateNewTable";
import { PageError } from "../pages/Error";

export const userRoutes = {
    home: {
        path: "/",
        element: <PageUserHome />,
        errorElement: <PageError />,
    },
};

export const staffRoutes = {
    tableManagement: {
        path: "/staff/manage/tables",
        element: <TableManagement />,
        errorElement: <PageError />,
    },
    billManagement: {
        path: "/staff/manage/bills",
        element: <BillManagement />,
        errorElement: <PageError />,
    },
    order: {
        path: "/staff/order",
        element: <StaffOrder />,
        errorElement: <PageError />,
    },
    orderHistory: {
        path: "/staff/order/history",
        element: <StaffOrderHistory />,
        errorElement: <PageError />,
    },
};

export const adminRoutes = {
    userManagement: {
        path: "/admin/manage/users",
        element: <UserManagement />,
        errorElement: <PageError />,
    },
    staffManagement: {
        path: "/admin/manage/staffs",
        element: <StaffManagement />,
        errorElement: <PageError />,
    },
    dashboard: {
        path: "/admin/dashboard",
        element: <Dashboard />,
        errorElement: <PageError />,
    },
    editTableMap: {
        path: "/admin/tables/edit",
        element: <EditTableMap />,
        errorElement: <PageError />,
    },
    createNewTable: {
        path: "/admin/tables/create",
        element: <CreateNewTable />,
        errorElement: <PageError />,
    },
};

export const authRoutes = {
    staffLogin: {
        path: "/staff/login",
        element: <PageStaffLogin />,
        errorElement: <PageError />,
    },
};
