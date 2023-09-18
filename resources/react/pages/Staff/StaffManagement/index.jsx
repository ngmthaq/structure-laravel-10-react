import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Switch, Typography, capitalize } from "@mui/material";
import { camelizeKeys } from "humps";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { DataTable } from "../../../components/DataTable";
import { __ } from "../../../plugins/i18n.plugin";
import { commonActions } from "../../../reducers/common.reducer";
import { PrimaryNotificationModel } from "../../../models/primary.notification.model";
import { staffAsyncActions } from "../../../reducers/staff.reducer";

export const StaffManagement = () => {
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

  const staffs = useSelector((state) => state.staff.staffs);

  const [processedStaffs, setProcessedStaffs] = useState([]);

  const onChange = (data) => {
    dispatch(staffAsyncActions.getAllStaffs(data));
  };

  const onChangeSwitch = async (staffId, isActive) => {
    try {
      dispatch(commonActions.openLinearLoading());
      let response;
      if (isActive) {
        if (confirm(__("custom.active-confirm-message"))) {
          response = await dispatch(staffAsyncActions.adminUnBlockStaff({ staffId })).unwrap();
        }
      } else {
        if (confirm(__("custom.block-confirm-message"))) {
          response = await dispatch(staffAsyncActions.adminBlockStaff({ staffId })).unwrap();
        }
      }
      if (response) {
        response = camelizeKeys(response);
        setProcessedStaffs((state) =>
          state.map((staff) => {
            if (staff.id !== response.id) return staff;
            const isDeleted = response.deletedAt;

            return {
              ...staff,
              active: <Switch checked={!isDeleted} onChange={(e) => onChangeSwitch(staff.id, e.target.checked)} />,
            };
          }),
        );
      }
      dispatch(commonActions.closeLinearLoading());
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

  useEffect(() => {
    if (staffs && staffs.data) {
      const staffData = staffs.data.map((staff) => {
        const isDeleted = staff.deletedAt;

        return {
          ...staff,
          active: <Switch checked={!isDeleted} onChange={(e) => onChangeSwitch(staff.id, e.target.checked)} />,
        };
      });

      setProcessedStaffs(staffData);
    }
  }, [staffs]);

  return (
    <AdminLayout>
      <Box sx={{ padding: "16px" }}>
        <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
          {__("custom.admin.manage.staffs.title")}
        </Typography>
        <DataTable
          fullWidth
          header={header}
          body={processedStaffs}
          total={staffs.total}
          actions={actions}
          onChange={onChange}
        />
      </Box>
    </AdminLayout>
  );
};
