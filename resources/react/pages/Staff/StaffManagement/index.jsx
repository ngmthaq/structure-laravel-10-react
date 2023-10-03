import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  capitalize,
} from "@mui/material";
import { Edit, LockReset, Visibility } from "@mui/icons-material";
import { camelizeKeys } from "humps";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { DataTable } from "../../../components/DataTable";
import { __ } from "../../../plugins/i18n.plugin";
import { commonActions } from "../../../reducers/common.reducer";
import { PrimaryNotificationModel } from "../../../models/primary.notification.model";
import { staffAsyncActions } from "../../../reducers/staff.reducer";
import { ROLES } from "../../../const/app.const";
import { StaffModel } from "../../../models/staff.model";
import { isObjDeepEqual } from "../../../helpers/reference.helper";

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
        widthPercent: 12.5,
      },
      {
        title: capitalize(__("custom.role")),
        sortable: false,
        sortCol: "customRole",
        widthPercent: 5,
      },
      {
        title: "Email",
        sortable: true,
        sortCol: "email",
        widthPercent: 12.5,
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

  const actions = useMemo(
    () => [
      {
        title: __("custom.show-staff-info"),
        icon: <Visibility fontSize="small" />,
        handler: (data) => {
          setStaffEditDialog((state) => ({ ...state, isEdit: false, data: { ...data }, originalData: { ...data } }));
        },
      },
      {
        title: __("custom.edit-staff-info"),
        icon: <Edit fontSize="small" />,
        handler: (data) => {
          setStaffEditDialog((state) => ({ ...state, isEdit: true, data: { ...data }, originalData: { ...data } }));
        },
      },
      {
        title: __("custom.reset-staff-password"),
        icon: <LockReset fontSize="small" />,
        handler: (data) => {
          if (confirm(__("custom.admin-reset-password-msg"))) {
            //
          }
        },
      },
    ],
    [],
  );

  const staffs = useSelector((state) => state.staff.staffs);

  const [processedStaffs, setProcessedStaffs] = useState([]);

  const [staffEditDialog, setStaffEditDialog] = useState({ isEdit: false, data: null, originalData: null });

  const onCloseStaffEditDialog = () => {
    if (isObjDeepEqual(staffEditDialog.data, staffEditDialog.originalData)) {
      setStaffEditDialog({ isEdit: false, data: null, originalData: null });
    } else if (confirm(__("custom.confirm-lost-changed"))) {
      setStaffEditDialog({ isEdit: false, data: null, originalData: null });
    }
  };

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

  const onChangeStaffProfile = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setStaffEditDialog((state) => ({ ...state, data: { ...state.data, [key]: value } }));
  };

  const onUpdateStaffProfile = async (e) => {
    try {
      e.preventDefault();
      dispatch(commonActions.openLinearLoading());
      await dispatch(staffAsyncActions.adminUpdateStaff(staffEditDialog.data)).unwrap();
      dispatch(commonActions.closeLinearLoading());
      alert(__("custom.admin-update-staff-success-msg"));
      location.reload();
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
        staff = StaffModel(
          staff.id,
          staff.name,
          staff.email,
          staff.phone,
          staff.address,
          staff.dateOfBirth,
          staff.role,
          staff.createdAt,
        );

        const isDeleted = staff.deletedAt;

        return {
          ...staff,
          customRole: staff.isAdmin ? __("custom.admin-role") : __("custom.staff-role"),
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
        <Dialog open={Boolean(staffEditDialog.data)} onClose={onCloseStaffEditDialog}>
          <DialogTitle>{__("custom.show-staff-info")}</DialogTitle>
          <DialogContent sx={{ paddingTop: "16px !important" }}>
            <Box component="form" onSubmit={onUpdateStaffProfile}>
              <TextField
                fullWidth
                disabled
                label="ID"
                value={staffEditDialog?.data?.id || ""}
                sx={{
                  marginBottom: "16px",
                  textTransform: "capitalize",
                }}
              />
              <TextField
                fullWidth
                disabled
                label={__("custom.email")}
                value={staffEditDialog?.data?.email || ""}
                sx={{
                  marginBottom: "16px",
                  textTransform: "capitalize",
                }}
              />
              <TextField
                fullWidth
                label={__("custom.name")}
                disabled={!staffEditDialog.isEdit}
                value={staffEditDialog?.data?.name || ""}
                name="name"
                onChange={onChangeStaffProfile}
                autoComplete="off"
                sx={{
                  marginBottom: "16px",
                  textTransform: "capitalize",
                }}
              />
              <FormControl fullWidth>
                <InputLabel id="role-select-label">{__("custom.role")}</InputLabel>
                <Select
                  fullWidth
                  labelId="role-select-label"
                  disabled={!staffEditDialog.isEdit}
                  value={staffEditDialog?.data?.role || ""}
                  label={__("custom.role")}
                  name="role"
                  onChange={onChangeStaffProfile}
                  sx={{
                    marginBottom: "16px",
                    textTransform: "capitalize",
                  }}
                >
                  <MenuItem value={ROLES.admin}>{__("custom.admin-role")}</MenuItem>
                  <MenuItem value={ROLES.staff}>{__("custom.staff-role")}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                disabled={!staffEditDialog.isEdit}
                type="tel"
                name="phone"
                onChange={onChangeStaffProfile}
                label={__("custom.phone-number")}
                value={staffEditDialog?.data?.phone || ""}
                sx={{
                  marginBottom: "16px",
                  textTransform: "capitalize",
                }}
              />
              <TextField
                fullWidth
                disabled={!staffEditDialog.isEdit}
                label={__("custom.date-of-birth")}
                value={staffEditDialog?.data?.dateOfBirth || ""}
                name="dateOfBirth"
                onChange={onChangeStaffProfile}
                sx={{
                  marginBottom: "16px",
                  textTransform: "capitalize",
                }}
                type="date"
              />
              <TextField
                fullWidth
                disabled={!staffEditDialog.isEdit}
                label={__("custom.address")}
                value={staffEditDialog?.data?.address || ""}
                name="address"
                onChange={onChangeStaffProfile}
                sx={{
                  marginBottom: "16px",
                  textTransform: "capitalize",
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: "16px" }}>
            {staffEditDialog.isEdit ? (
              <Button
                fullWidth
                variant="contained"
                onClick={onUpdateStaffProfile}
                disabled={isObjDeepEqual(staffEditDialog.data, staffEditDialog.originalData)}
              >
                {__("custom.update")}
              </Button>
            ) : (
              <Fragment />
            )}
            <Button onClick={onCloseStaffEditDialog} variant="text" fullWidth>
              {__("custom.close")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};
