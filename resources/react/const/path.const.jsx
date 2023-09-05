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

export const userRoutes = {
    home: {
        path: "/",
        element: <PageUserHome />,
    },
};

export const staffRoutes = {
    tableManagement: {
        path: "/staff/manage/tables",
        element: <TableManagement />,
    },
    billManagement: {
        path: "/staff/manage/bills",
        element: <BillManagement />,
    },
    order: {
        path: "/staff/order",
        element: <StaffOrder />,
    },
    orderHistory: {
        path: "/staff/order/history",
        element: <StaffOrderHistory />,
    },
};

export const adminRoutes = {
    userManagement: {
        path: "/admin/manage/users",
        element: <UserManagement />,
    },
    staffManagement: {
        path: "/admin/manage/staffs",
        element: <StaffManagement />,
    },
    dashboard: {
        path: "/admin/dashboard",
        element: <Dashboard />,
    },
    editTableMap: {
        path: "/admin/tables/edit",
        element: <EditTableMap />,
    },
    createNewTable: {
        path: "/admin/tables/create",
        element: <CreateNewTable />,
    },
};

export const authRoutes = {
    staffLogin: {
        path: "/staff/login",
        element: <PageStaffLogin />,
    },
};
