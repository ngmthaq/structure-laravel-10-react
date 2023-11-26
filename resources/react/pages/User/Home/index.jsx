import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Typography, TextField, Grid, Button } from "@mui/material";
import { CircularProgress, IconButton } from "@mui/material";
import {
  FloorMap,
  STATE_ORDERED,
  STATE_ORDER_AVAILABLE,
  STATE_ORDER_BLOCKED,
  STATE_ORDER_IN_USE,
} from "../../../components/FloorMap";
import dayjs from "dayjs";
import { GenericApi } from "../../../api/generic.api";
import { API_ENDPOINTS } from "../../../const/api.const";
import { commonActions } from "../../../reducers/common.reducer";
import { PrimaryNotificationModel } from "../../../models/primary.notification.model";
import { __ } from "../../../plugins/i18n.plugin";
import { theme } from "../../../plugins/material.plugin";
import { CircleTable } from "../../../components/FloorMap/CircleTable";
import { SquareTable } from "../../../components/FloorMap/SquareTable";
import { TABLE_TYPE } from "../../../const/app.const";
import { tableAsyncActions } from "../../../reducers/table.reducer";
import { Refresh } from "@mui/icons-material";
import { generateRandomString } from "../../../helpers/primitive.helper";
import { billAsyncActions } from "../../../reducers/bill.reducer";

export const PageUserHome = () => {
  const dispatch = useDispatch();

  const sessionId = useMemo(() => generateRandomString(), []);

  const isOpenLoading = useRef(false);

  const [payload, setPayload] = useState({
    id: "",
    phone: "",
    email: "",
    name: "",
    adults: 0,
    children: 0,
    startTime: dayjs().format("YYYY-MM-DDTHH:mm"),
    finishTime: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
    status: "new",
    tables: [],
  });

  const [tables, setTables] = useState([]);

  const active = Boolean(
    payload.phone &&
      payload.name &&
      payload.adults + payload.children > 0 &&
      payload.status !== "blocked" &&
      payload.tables.length > 0,
  );

  const onChangeInput = (e) => {
    if (e.target.name === "phone") {
      setPayload((state) => ({
        ...state,
        phone: e.target.value,
        email: "",
        name: "",
        adults: 0,
        children: 0,
        startTime: dayjs().format("YYYY-MM-DDTHH:mm"),
        finishTime: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
        status: "new",
        tables: [],
      }));
    } else {
      setPayload((state) => ({ ...state, [e.target.name]: e.target.value }));
    }
  };

  const onFindUser = async () => {
    try {
      const api = new GenericApi();
      const response = await api.get(API_ENDPOINTS.findUserByPhone, { phone: payload.phone });
      if (response.data.user) {
        const user = response.data.user;
        setPayload((state) => ({
          ...state,
          status: "existed",
          email: user.email || "",
          name: user.name || "",
          id: user.id || "",
        }));
      } else {
        setPayload((state) => ({ ...state, status: "new" }));
      }
    } catch (error) {
      if (error.response.status && error.response.status === 422) {
        setPayload((state) => ({ ...state, status: "blocked" }));
        const notifications = Object.values(error.response.data.errors).map((e) =>
          PrimaryNotificationModel("error", e[0]),
        );
        dispatch(commonActions.appendPrimaryNotification(JSON.stringify(notifications)));
      } else {
        dispatch(
          commonActions.appendPrimaryNotification(PrimaryNotificationModel("error", __("custom.something-wrong"))),
        );
      }
    }
  };

  const onRefresh = (e = null) => {
    if (e && e.detail && e.detail !== sessionId) {
      alert("New reservation created, refresh current resercation");
    }

    setPayload((state) => ({
      ...state,
      startTime: dayjs().format("YYYY-MM-DDTHH:mm"),
      finishTime: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
      tables: [],
    }));
  };

  const onSelectTable = (id) => {
    const table = payload.tables.find((table) => table === id);
    if (table) {
      setPayload((state) => ({ ...state, tables: state.tables.filter((table) => table !== id) }));
    } else {
      setPayload((state) => ({ ...state, tables: [...state.tables, id] }));
    }
  };

  const getAvailableTables = async () => {
    dispatch(commonActions.openLinearLoading());
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
    dispatch(commonActions.closeLinearLoading());
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
        billAsyncActions.userOrder({
          userId: payload.id,
          startAt: payload.startTime,
          endAt: payload.finishTime,
          adults: payload.adults,
          children: payload.children,
          availableSeats: availableSeats,
          sessionId: sessionId,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
        }),
      ).unwrap();
      dispatch(commonActions.closeLinearLoading());
      alert(__("custom.create-order-success"));
      window.location.reload();
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
    if (payload.phone) {
      onFindUser();
    }
  }, [payload.phone]);

  useEffect(() => {
    getAvailableTables();
  }, [payload.adults, payload.children, payload.startTime, payload.finishTime]);

  useEffect(() => {
    window.addEventListener("reservation-created-event", onRefresh);
    return () => {
      window.removeEventListener("reservation-created-event", onRefresh);
    };
  });

  return (
    <Box sx={{ background: "#1d1f1e", height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", maxWidth: 900, margin: "0 auto", minHeight: "100vh", background: "#fff" }}>
        <Box component="img" src="/img/banner.jpg" sx={{ width: "100%", height: "auto" }} />
        <Typography variant="h2" textAlign="center" marginTop="16px">
          Welcome back
        </Typography>
        <Typography textAlign="center">
          Please fill the following application form to complete the reservation
        </Typography>
        <form style={{ padding: "56px 24px" }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                InputLabelProps={{ shrink: true }}
                label="What is your phone number?"
                placeholder="Your phone number"
                required={true}
                variant="outlined"
                fullWidth
                value={payload.phone}
                onChange={onChangeInput}
                name="phone"
              />
              {payload.phone ? (
                <Fragment />
              ) : (
                <Typography variant="caption">
                  <i>Please fill your phone number first</i>
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                InputLabelProps={{ shrink: true }}
                label="What is your email?"
                placeholder="Your email"
                required={false}
                variant="outlined"
                fullWidth
                type="email"
                onChange={onChangeInput}
                name="email"
                value={payload.email}
                disabled={payload.phone === "" || payload.status === "blocked"}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                InputLabelProps={{ shrink: true }}
                label="What is your name?"
                placeholder="Your name"
                required={true}
                variant="outlined"
                fullWidth
                onChange={onChangeInput}
                name="name"
                value={payload.name}
                disabled={payload.phone === "" || payload.status === "blocked"}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                InputLabelProps={{ shrink: true }}
                label="How many adults?"
                placeholder="Adults"
                required={true}
                variant="outlined"
                fullWidth
                type="number"
                onChange={onChangeInput}
                name="adults"
                value={payload.adults}
                disabled={payload.phone === "" || payload.status === "blocked"}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                InputLabelProps={{ shrink: true }}
                label="How many children?"
                placeholder="Children"
                required={true}
                variant="outlined"
                fullWidth
                type="number"
                onChange={onChangeInput}
                name="children"
                value={payload.children}
                disabled={payload.phone === "" || payload.status === "blocked"}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="When will you come here?"
                required={true}
                variant="outlined"
                fullWidth
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                onChange={onChangeInput}
                name="startTime"
                value={payload.startTime}
                disabled={payload.phone === "" || payload.status === "blocked"}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="When do you want to leave?"
                required={true}
                variant="outlined"
                fullWidth
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                onChange={onChangeInput}
                name="finishTime"
                value={payload.finishTime}
                disabled={payload.phone === "" || payload.status === "blocked"}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="subtitle2">Which table(s) do you want to use? *</Typography>
                <IconButton size="small" onClick={() => onRefresh()}>
                  <Refresh fontSize="small" />
                </IconButton>
              </Box>
              <Box
                sx={{
                  border: "1px solid " + theme.palette.primary.main,
                  height: "500px",
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
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button variant="contained" size="large" disabled={!active} onClick={onCreateOrder}>
                  Complete the reservation
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};
