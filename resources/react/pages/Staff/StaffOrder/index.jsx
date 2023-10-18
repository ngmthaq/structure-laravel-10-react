import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AdminPanelSettings, KeyboardArrowRight } from "@mui/icons-material";
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
import { generateRandomString } from "../../../helpers/primitive.helper";

export const StaffOrder = () => {
  const dispatch = useDispatch();

  const [payload, setPayload] = useState({
    phone: "",
    startTime: "",
    finishTime: "",
    adults: 0,
    children: 0,
    tables: [],
    seats: [],
    name: "",
    email: "",
  });

  const [users, setUsers] = useState([]);

  const [tables, setTables] = useState([]);

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const onOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const onCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const onSubmit = () => {
    if (payload.name === "") {
      onOpenDialog();
    } else {
      console.log(payload);
    }
  };

  const onChangeUserForm = (e) => {
    setPayload((state) => ({ ...state, [e.target.name]: e.target.value, tables: [] }));
  };

  const onChangePhone = (e) => {
    const user = users.find((user) => user.phone === e.target.value);
    if (user) {
      setPayload((state) => ({ ...state, name: user.name, email: user.email, phone: user.phone, tables: [] }));
    } else {
      setPayload((state) => ({ ...state, name: "", email: "", phone: e.target.value, tables: [] }));
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
    if (payload.startTime && payload.finishTime && payload.adults + payload.children > 0 && payload.phone) {
      const response = await dispatch(
        tableAsyncActions.staffGetAvailableTables({ ...payload, seats: payload.adults + payload.children }),
      ).unwrap();
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

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    getAvailableTables();
  }, [payload.adults, payload.children, payload.phone, payload.startTime, payload.finishTime]);

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
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
          />
          <TextField
            fullWidth
            label={__("custom.email")}
            name="email"
            onChange={onChangeUserForm}
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button>{__("custom.create")}</Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};
