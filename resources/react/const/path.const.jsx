import { PageUserHome } from "../pages/User/Home";
import { PageStaffLogin } from "../pages/Staff/Login";
import { UserManagement } from "../pages/Staff/UserManagement";
import { StaffManagement } from "../pages/Staff/StaffManagement";
import { TableManagement } from "../pages/Staff/TableManagement";
import { BillManagement } from "../pages/Staff/BillManagement";
import { Dashboard } from "../pages/Staff/Dashboard";
import { StaffOrder } from "../pages/Staff/StaffOrder";
import { EditTableMap } from "../pages/Staff/EditTableMap";
import { PageError } from "../pages/Error";
import { Configurations } from "../pages/Staff/Configurations";
import { notStaffLoader } from "../router/not.staff.loader";
import { staffLoader } from "../router/staff.loader";
import { adminLoader } from "../router/admin.loader";
import { userLoader } from "../router/user.loader";

export const userRoutes = {
  home: {
    path: "/",
    element: <PageUserHome />,
    errorElement: <PageError />,
    loader: userLoader,
  },
};

export const staffRoutes = {
  tableManagement: {
    path: "/staff/manage/tables",
    element: <TableManagement />,
    errorElement: <PageError />,
    loader: staffLoader,
  },
  billManagement: {
    path: "/staff/manage/bills",
    element: <BillManagement />,
    errorElement: <PageError />,
    loader: staffLoader,
  },
  order: {
    path: "/staff/orders/create",
    element: <StaffOrder />,
    errorElement: <PageError />,
    loader: staffLoader,
  },
};

export const adminRoutes = {
  userManagement: {
    path: "/admin/manage/users",
    element: <UserManagement />,
    errorElement: <PageError />,
    loader: adminLoader,
  },
  staffManagement: {
    path: "/admin/manage/staffs",
    element: <StaffManagement />,
    errorElement: <PageError />,
    loader: adminLoader,
  },
  dashboard: {
    path: "/admin/dashboard",
    element: <Dashboard />,
    errorElement: <PageError />,
    loader: adminLoader,
  },
  editTableMap: {
    path: "/admin/tables/edit",
    element: <EditTableMap />,
    errorElement: <PageError />,
    loader: adminLoader,
  },
  configurations: {
    path: "/admin/configurations",
    element: <Configurations />,
    errorElement: <PageError />,
    loader: adminLoader,
  },
};

export const authRoutes = {
  staffLogin: {
    path: "/staff/login",
    element: <PageStaffLogin />,
    errorElement: <PageError />,
    loader: notStaffLoader,
  },
};
