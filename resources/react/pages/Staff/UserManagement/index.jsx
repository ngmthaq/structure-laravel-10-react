import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Switch, Typography, capitalize } from "@mui/material";
import { AdminPanelSettings, KeyboardArrowRight } from "@mui/icons-material";
import { camelizeKeys } from "humps";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { DataTable } from "../../../components/DataTable";
import { __ } from "../../../plugins/i18n.plugin";
import { userAsyncActions } from "../../../reducers/user.reducer";
import { commonActions } from "../../../reducers/common.reducer";
import { PrimaryNotificationModel } from "../../../models/primary.notification.model";
import { theme } from "../../../plugins/material.plugin";
import { CreateUserDialog } from "./CreateUserDialog";
import { useEventBus } from "../../../plugins/bus.plugin";
import { EVENT_BUS } from "../../../const/event.const";

export const CLEAR_FORM = "ADMIN_USER_MANAGEMENT_CLEAR_FORM";

export const UserManagement = () => {
  const dispatch = useDispatch();

  const eventBus = useEventBus();

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

  const [isOpenCreateUserDialog, setIsOpenCreateUserDialog] = useState(false);

  const onCreateNewUser = async (payload) => {
    try {
      dispatch(commonActions.openLinearLoading());
      await dispatch(userAsyncActions.adminCreateUser(payload)).unwrap();
      dispatch(commonActions.closeLinearLoading());
      alert(__("custom.admin-create-user-success-msg"));
      onCloseCreateUserDialog();
      eventBus.emit(EVENT_BUS.refreshDataTable);
      eventBus.emit(CLEAR_FORM);
    } catch (error) {
      dispatch(commonActions.closeLinearLoading());
      if (error.status && error.status === 422) {
        const notifications = Object.values(error.data.errors).map((e) => PrimaryNotificationModel("error", e[0]));
        dispatch(commonActions.appendPrimaryNotification(JSON.stringify(notifications)));
      } else {
        dispatch(
          commonActions.appendPrimaryNotification(PrimaryNotificationModel("error", __("custom.something-wrong"))),
        );
      }
    }
  };

  const onCloseCreateUserDialog = () => {
    setIsOpenCreateUserDialog(false);
  };

  const onOpenCreateUserDialog = () => {
    setIsOpenCreateUserDialog(true);
  };

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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" sx={{ textTransform: "capitalize", marginBottom: "4px" }}>
              {__("custom.admin-manage-users-title")}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                textTransform: "capitalize",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: theme.palette.grey[600],
                "& span:last-child": {
                  color: theme.palette.grey[400],
                },
              }}
            >
              <AdminPanelSettings fontSize="small" />
              <KeyboardArrowRight fontSize="small" />
              <Box component="span">{__("custom.admin-role")}</Box>
              <KeyboardArrowRight fontSize="small" />
              <Box component="span">{__("custom.admin-manage-users-title")}</Box>
            </Typography>
          </Box>
          <Button variant="contained" onClick={onOpenCreateUserDialog}>
            {__("custom.create-new-user")}
          </Button>
        </Box>
        <DataTable
          fullWidth
          header={header}
          body={processedUsers}
          total={users.total}
          actions={actions}
          onChange={onChange}
        />
        <CreateUserDialog open={isOpenCreateUserDialog} onClose={onCloseCreateUserDialog} onSubmit={onCreateNewUser} />
      </Box>
    </AdminLayout>
  );
};
