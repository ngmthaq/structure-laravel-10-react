import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Switch, Typography, capitalize } from "@mui/material";
import { camelizeKeys } from "humps";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { DataTable } from "../../../components/DataTable";
import { __ } from "../../../plugins/i18n.plugin";
import { userAsyncActions } from "../../../reducers/user.reducer";
import { commonActions } from "../../../reducers/common.reducer";
import { PrimaryNotificationModel } from "../../../models/primary.notification.model";

export const UserManagement = () => {
  const dispatch = useDispatch();

  const header = useMemo(
    () => [
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
        widthPercent: 10,
      },
      {
        title: capitalize(__("custom.active")),
        sortable: false,
        sortCol: "active",
        widthPercent: 2,
      },
    ],
    [],
  );

  const actions = useMemo(() => [], []);

  const users = useSelector((state) => state.user.users);

  const [processedUsers, setProcessedUsers] = useState([]);

  const onChange = (data) => {
    dispatch(userAsyncActions.getAllUsers(data));
  };

  const onChangeSwitch = async (userId, isActive) => {
    try {
      dispatch(commonActions.openLinearLoading());
      let response;
      if (isActive) {
        if (confirm(__("custom.active-confirm-message"))) {
          response = await dispatch(userAsyncActions.adminUnBlockUser({ userId })).unwrap();
        }
      } else {
        if (confirm(__("custom.block-confirm-message"))) {
          response = await dispatch(userAsyncActions.adminBlockUser({ userId })).unwrap();
        }
      }
      if (response) {
        response = camelizeKeys(response);
        setProcessedUsers((state) =>
          state.map((user) => {
            if (user.id !== response.id) return user;
            const isDeleted = response.deletedAt;

            return {
              ...user,
              active: <Switch checked={!isDeleted} onChange={(e) => onChangeSwitch(user.id, e.target.checked)} />,
            };
          }),
        );
      }
      dispatch(commonActions.closeLinearLoading());
    } catch (error) {
      dispatch(commonActions.closeLinearLoading());
      dispatch(
        commonActions.appendPrimaryNotification(PrimaryNotificationModel("error", __("custom.something-wrong"))),
      );
    }
  };

  useEffect(() => {
    if (users && users.data) {
      const userData = users.data.map((user) => {
        const isDeleted = user.deletedAt;

        return {
          ...user,
          active: <Switch checked={!isDeleted} onChange={(e) => onChangeSwitch(user.id, e.target.checked)} />,
        };
      });

      setProcessedUsers(userData);
    }
  }, [users]);

  return (
    <AdminLayout>
      <Box sx={{ padding: "16px" }}>
        <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
          {__("custom.admin.manage.users.title")}
        </Typography>
        <DataTable
          fullWidth
          header={header}
          body={processedUsers}
          total={users.total}
          actions={actions}
          onChange={onChange}
        />
      </Box>
    </AdminLayout>
  );
};
