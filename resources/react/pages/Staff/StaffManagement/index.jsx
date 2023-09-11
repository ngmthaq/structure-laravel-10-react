import React from "react";
import { AdminLayout } from "../../../layouts/AdminLayout";
import {TableManagerComponent} from "../../../components/TableManager/index.jsx";

export const StaffManagement = () => {
    return <AdminLayout>
        <TableManagerComponent/>
    </AdminLayout>;
};
