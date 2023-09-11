import React, { useEffect } from "react";
import { capitalize } from "@mui/material";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { DataTable } from "../../../components/DataTable";
import { __ } from "../../../plugins/i18n.plugin";
import { useDispatch, useSelector } from "react-redux";
import { userAsyncActions } from "../../../reducers/user.reducer";

export const UserManagement = () => {
    const dispatch = useDispatch();

    const header = [
        {
            title: "ID",
            sortable: true,
            sortCol: "id",
            widthPercent: 5,
        },
        {
            title: capitalize(__("custom.name")),
            sortable: true,
            sortCol: "name",
            widthPercent: 15,
        },
        {
            title: "Email",
            sortable: true,
            sortCol: "email",
            widthPercent: 15,
        },
        {
            title: capitalize(__("custom.phone-number")),
            sortable: true,
            sortCol: "phone",
            widthPercent: 10,
        },
        {
            title: capitalize(__("custom.address")),
            sortable: true,
            sortCol: "address",
            widthPercent: 23,
        },
        {
            title: capitalize(__("custom.date-of-birth")),
            sortable: true,
            sortCol: "dateOfBirth",
            widthPercent: 10,
        },
        {
            title: capitalize(__("custom.created-at")),
            sortable: true,
            sortCol: "createdAt",
            widthPercent: 12,
        },
    ];

    const users = useSelector((state) => state.user.users);

    const onFilter = (data) => {
        console.log(data);
    };

    const onChangeLimit = (data) => {
        console.log(data);
    };

    const onChangePage = (data) => {
        console.log(data);
    };

    const onChangeSortOrder = (data) => {
        console.log(data);
    };

    useEffect(() => {
        dispatch(userAsyncActions.getAllUsers());
    }, []);

    return (
        <AdminLayout>
            <DataTable
                fullWidth
                header={header}
                body={users.data}
                total={users.total}
                onFilter={onFilter}
                onChangeLimit={onChangeLimit}
                onChangePage={onChangePage}
                onChangeSortOrder={onChangeSortOrder}
            />
        </AdminLayout>
    );
};
