import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AdminPanelSettings, KeyboardArrowRight, Refresh } from "@mui/icons-material";
import dayjs from "dayjs";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { theme } from "../../../plugins/material.plugin";
import { __ } from "../../../plugins/i18n.plugin";
import { userAsyncActions } from "../../../reducers/user.reducer";
import { OrderForm } from "./OrderForm";
import {
  FloorMap,
  STATE_BLOCKED,
  STATE_ORDERED,
  STATE_ORDER_AVAILABLE,
  STATE_ORDER_BLOCKED,
  STATE_ORDER_IN_USE,
} from "../../../components/FloorMap";
import { tableAsyncActions } from "../../../reducers/table.reducer";
import { CircleTable } from "../../../components/FloorMap/CircleTable";
import { SquareTable } from "../../../components/FloorMap/SquareTable";
import { TABLE_TYPE } from "../../../const/app.const";
import { commonActions } from "../../../reducers/common.reducer";
import { billAsyncActions } from "../../../reducers/bill.reducer";
import { PrimaryNotificationModel } from "../../../models/primary.notification.model";
import { generateRandomString } from "../../../helpers/primitive.helper";

export const StaffOrder = () => {
  const dispatch = useDispatch();

  const sessionId = useMemo(() => generateRandomString(), []);

  const [payload, setPayload] = useState({
    phone: "",
    startTime: dayjs().format("YYYY-MM-DD hh:mm A"),
    finishTime: dayjs().add(1, "hour").format("YYYY-MM-DD hh:mm A"),
    adults: 0,
    children: 0,
    tables: [],
    seats: [],
    name: "",
    email: "",
    id: "",
  });

  const [users, setUsers] = useState([]);

  const [tables, setTables] = useState([]);

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const isOpenLoading = useRef(false);

  const onOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const onCloseDialog = () => {
    if (payload.name !== "" && confirm(__("custom.confirm-lost-changed"))) {
      setIsOpenDialog(false);
      setPayload((state) => ({ ...state, name: "" }));
    } else if (payload.name === "") {
      setIsOpenDialog(false);
    }
  };

  const onSubmit = () => {
    if (payload.id === "") {
      onOpenDialog();
    } else {
      onCreateOrder();
    }
  };

  const onCreateOrder = async () => {
    try {
      dispatch(commonActions.openLinearLoading());
      const availableSeats = tables.reduce((array, currentTable) => {
        if (payload.tables.includes(currentTable.id)) {
          const seats = currentTable.seats.filter((seat) => seat.isSeated === false).map((seat) => seat.id);
          array = array.concat(seats);
        }
        return array;
      }, []);
      await dispatch(
        billAsyncActions.staffOrder({
          userId: payload.id,
          startAt: payload.startTime,
          endAt: payload.finishTime,
          adults: payload.adults,
          children: payload.children,
          availableSeats: availableSeats,
          sessionId: sessionId,
        }),
      ).unwrap();
      dispatch(commonActions.closeLinearLoading());
      alert(__("custom.create-order-success"));
      setTables([]);
      setPayload({
        phone: "",
        startTime: dayjs().format("YYYY-MM-DD hh:mm A"),
        finishTime: dayjs().add(1, "hour").format("YYYY-MM-DD hh:mm A"),
        adults: 0,
        children: 0,
        tables: [],
        seats: [],
        name: "",
        email: "",
        id: "",
      });
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

  const onQuickCreateUser = async () => {
    try {
      dispatch(commonActions.openLinearLoading());
      const response = await dispatch(userAsyncActions.staffQuickCreateUser(payload)).unwrap();
      setPayload((state) => ({ ...state, id: response.id }));
      dispatch(commonActions.closeLinearLoading());
      setIsOpenDialog(false);
      alert(__("custom.quick-create-user-success"));
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

  const onChangeUserForm = (e) => {
    setPayload((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const onChangePhone = (e) => {
    const user = users.find((user) => user.phone === e.target.value);
    if (user) {
      setPayload((state) => ({
        ...state,
        name: user.name,
        email: user.email,
        phone: user.phone,
        id: user.id,
      }));
    } else {
      setPayload((state) => ({ ...state, name: "", email: "", phone: e.target.value, id: "" }));
    }
  };

  const onChangeStartTime = (value) => {
    setPayload((state) => ({ ...state, startTime: value.format("YYYY-MM-DD hh:mm A"), tables: [] }));
  };

  const onChangeFinishTime = (value) => {
    setPayload((state) => ({ ...state, finishTime: value.format("YYYY-MM-DD hh:mm A"), tables: [] }));
  };

  const onChangeInput = (e) => {
    const key = e.target.name;
    const value = key === "adults" || key === "children" ? Number(e.target.value) : e.target.value;
    setPayload((state) => ({ ...state, [key]: value, tables: [] }));
  };

  const onSelectTable = (id) => {
    const table = payload.tables.find((table) => table === id);
    if (table) {
      setPayload((state) => ({ ...state, tables: state.tables.filter((table) => table !== id) }));
    } else {
      setPayload((state) => ({ ...state, tables: [...state.tables, id] }));
    }
  };

  const getUsers = async (phone = null) => {
    const response = await dispatch(userAsyncActions.staffGetUsers({ phone })).unwrap();
    setUsers(response);
  };

  const getAvailableTables = async () => {
    if (payload.startTime && payload.finishTime) {
      isOpenLoading.current = true;
      const response = await dispatch(
        tableAsyncActions.staffGetAvailableTables({ ...payload, seats: payload.adults + payload.children }),
      ).unwrap();
      isOpenLoading.current = false;
      setTables(
        response.map((table) => {
          const seatNumber = table.seats.length;
          const seatedNumber = table.seats.filter((seat) => seat.isSeated).length;
          const state = table.isBlock
            ? STATE_BLOCKED.value
            : seatNumber === seatedNumber
            ? STATE_ORDER_BLOCKED.value
            : seatedNumber > 0
            ? STATE_ORDER_IN_USE.value
            : STATE_ORDER_AVAILABLE.value;

          return {
            ...table,
            seatNumber,
            seatedNumber,
            state,
          };
        }),
      );
    }
  };

  const onRefresh = (e = null) => {
    if (e && e.detail && e.detail !== sessionId) {
      alert("New reservation created, refresh current resercation");
    }

    setPayload((state) => ({
      ...state,
      startTime: dayjs().format("YYYY-MM-DD hh:mm A"),
      finishTime: dayjs().add(1, "hour").format("YYYY-MM-DD hh:mm A"),
      tables: [],
    }));
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    getAvailableTables();
  }, [payload.adults, payload.children, payload.startTime, payload.finishTime]);

  useEffect(() => {
    window.addEventListener("reservation-created-event", onRefresh);
    return () => {
      window.removeEventListener("reservation-created-event", onRefresh);
    };
  });

  const isEnableSubmit = Boolean(
    payload.startTime &&
      payload.finishTime &&
      payload.adults + payload.children > 0 &&
      payload.phone &&
      payload.tables.length > 0,
  );

  return (
    <AdminLayout>
      <Box sx={{ padding: "16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" sx={{ textTransform: "capitalize", marginBottom: "4px" }}>
              {__("custom.staff-order-title")}
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
              <Box component="span">{__("custom.staff-role")}</Box>
              <KeyboardArrowRight fontSize="small" />
              <Box component="span">{__("custom.staff-order-title")}</Box>
            </Typography>
          </Box>
          <IconButton title="Refresh Available Tables" onClick={() => onRefresh()}>
            <Refresh />
          </IconButton>
        </Box>
        <Box component="form" sx={{ paddingTop: "24px" }}>
          <Grid container>
            <Grid item xs={4} sx={{ height: "100%" }}>
              <OrderForm
                onChangeFinishTime={onChangeFinishTime}
                onChangeStartTime={onChangeStartTime}
                onChangeInput={onChangeInput}
                onChangePhone={onChangePhone}
                onSubmit={onSubmit}
                payload={payload}
                isEnableSubmit={isEnableSubmit}
              />
            </Grid>
            <Grid item xs={8} sx={{ height: "100%" }}>
              <Box
                sx={{
                  marginLeft: "32px",
                  border: "1px solid " + theme.palette.primary.main,
                  height: "600px",
                  borderRadius: "2px",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    zIndex: "10",
                    display: isOpenLoading.current ? "flex" : "none",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CircularProgress />
                </Box>
                <FloorMap zoom={false}>
                  {tables.map((table) =>
                    table.type === TABLE_TYPE.circle ? (
                      <CircleTable
                        key={table.id}
                        id={table.id}
                        position={[table.positionX, table.positionY]}
                        state={payload.tables.includes(table.id) ? STATE_ORDERED.value : table.state}
                        usage={0}
                        seats={table.seatNumber}
                        seated={table.seatedNumber}
                        onReservation={onSelectTable}
                      />
                    ) : (
                      <SquareTable
                        key={table.id}
                        id={table.id}
                        position={[table.positionX, table.positionY]}
                        state={payload.tables.includes(table.id) ? STATE_ORDERED.value : table.state}
                        usage={0}
                        seats={table.seatNumber}
                        seated={table.seatedNumber}
                        dir={table.direction}
                        onReservation={onSelectTable}
                      />
                    ),
                  )}
                </FloorMap>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Dialog open={isOpenDialog} onClose={onCloseDialog}>
        <DialogTitle>{__("custom.create-new-user")}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "24px" }}>{__("custom.tmp-create-user-msg")}</DialogContentText>
          <TextField
            fullWidth
            label={__("custom.name")}
            name="name"
            onChange={onChangeUserForm}
            value={payload.name}
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onQuickCreateUser}>{__("custom.create")}</Button>
          <Button onClick={onCloseDialog}>{__("custom.close")}</Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};
