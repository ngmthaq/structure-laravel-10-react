import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Switch,
  Typography,
  capitalize,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardHeader,
  Avatar,
  CardActions,
  CardContent,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  OutlinedInput,
} from "@mui/material";
import { TableBar, AdminPanelSettings, Bookmark, KeyboardArrowRight, PeopleAlt } from "@mui/icons-material";
import { camelizeKeys } from "humps";
import dayjs from "dayjs";
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
import { getStatusOfBill } from "../BillManagement/BillCard";

export const CLEAR_FORM = "ADMIN_USER_MANAGEMENT_CLEAR_FORM";

export const UserManagement = () => {
  const dispatch = useDispatch();

  const eventBus = useEventBus();

  const users = useSelector((state) => state.user.users);

  const [processedUsers, setProcessedUsers] = useState([]);

  const [isOpenCreateUserDialog, setIsOpenCreateUserDialog] = useState(false);

  const [reservationDialog, setReservationDialog] = useState({
    isOpen: false,
    data: null,
    search: dayjs().format("YYYY-MM-DD"),
  });

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

  const actions = useMemo(
    () => [
      {
        title: "Show all reservation",
        icon: <Bookmark fontSize="small" />,
        handler: (data) => {
          console.log(data);
          setReservationDialog((state) => ({ ...state, isOpen: true, data: { ...data } }));
        },
      },
    ],
    [],
  );

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

  const onCloseReservationDialog = () => {
    setReservationDialog((state) => ({ ...state, isOpen: false }));
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

  const filterReservations = (reservations) => {
    if (!reservations) return [];
    return reservations.filter((reservation) => reservation.startAt.startsWith(reservationDialog.search));
  };

  const onChangeFilter = (e) => {
    setReservationDialog((state) => ({ ...state, search: dayjs(e.target.value).format("YYYY-MM-DD") }));
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
        <Dialog open={reservationDialog.isOpen} onClose={onCloseReservationDialog} fullWidth maxWidth="md">
          <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography>User Reservations</Typography>
            <OutlinedInput onChange={onChangeFilter} size="small" type="date" value={reservationDialog.search} />
          </DialogTitle>
          <DialogContent>
            {Boolean(filterReservations(reservationDialog?.data?.bills)?.length) ? (
              <DialogContent sx={{ padding: "4px" }}>
                <Grid container>
                  {filterReservations(reservationDialog.data.bills).map((bill) => (
                    <Grid item xs={reservationDialog.data.bills.length > 1 ? 6 : 12} key={bill.id}>
                      <Card elevation={0}>
                        <CardHeader
                          avatar={<Avatar>{reservationDialog.data.name.charAt(0)}</Avatar>}
                          title={reservationDialog.data.name}
                          subheader={reservationDialog.data.phone}
                        />
                        <CardActions
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 16px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexShrink: 0,
                              width: "100%",
                              gap: "8px",
                              flex: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                flexShrink: 0,
                              }}
                            >
                              <PeopleAlt htmlColor="#757575" fontSize="small" />
                              <Typography sx={{ margin: "2px 4px 0" }}>{bill.adults + bill.children}</Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                flexShrink: 0,
                              }}
                            >
                              <TableBar htmlColor="#757575" fontSize="small" />
                              <Typography sx={{ margin: "2px 4px 0" }}>{bill.tableId}</Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              flexShrink: 0,
                              flex: 1,
                              width: "100%",
                            }}
                          >
                            <Typography sx={{ margin: "2px 4px 0" }}>{getStatusOfBill(bill)?.title}</Typography>
                            {getStatusOfBill(bill)?.icon}
                          </Box>
                        </CardActions>
                        <CardContent>
                          <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                              <TableBody>
                                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                  <TableCell component="th" scope="row">
                                    Reservation Start At
                                  </TableCell>
                                  <TableCell align="right">{dayjs(bill.startAt).format("DD/MM/YYYY HH:mm")}</TableCell>
                                </TableRow>
                                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                  <TableCell component="th" scope="row">
                                    Reservation End At
                                  </TableCell>
                                  <TableCell align="right">{dayjs(bill.endAt).format("DD/MM/YYYY HH:mm")}</TableCell>
                                </TableRow>
                                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                  <TableCell component="th" scope="row">
                                    Confirmed At
                                  </TableCell>
                                  <TableCell align="right">
                                    {bill.confirmedAt ? dayjs(bill.confirmedAt).format("DD/MM/YYYY HH:mm") : ""}
                                  </TableCell>
                                </TableRow>
                                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                  <TableCell component="th" scope="row">
                                    User Start At
                                  </TableCell>
                                  <TableCell align="right">
                                    {bill.userStartedAt ? dayjs(bill.userStartedAt).format("DD/MM/YYYY HH:mm") : ""}
                                  </TableCell>
                                </TableRow>
                                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                  <TableCell component="th" scope="row">
                                    Completed At
                                  </TableCell>
                                  <TableCell align="right">
                                    {bill.completedAt ? dayjs(bill.completedAt).format("DD/MM/YYYY HH:mm") : ""}
                                  </TableCell>
                                </TableRow>
                                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                  <TableCell component="th" scope="row">
                                    Cancel At
                                  </TableCell>
                                  <TableCell align="right">
                                    {bill.cancelAt ? dayjs(bill.cancelAt).format("DD/MM/YYYY HH:mm") : ""}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </DialogContent>
            ) : (
              <Typography textAlign="center">
                <i>Empty</i>
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};
