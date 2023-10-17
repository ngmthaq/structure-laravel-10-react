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
import { FloorMap } from "../../../components/FloorMap";

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

  const onCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const onChangeUserForm = (e) => {
    setPayload((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const onChangePhone = (e) => {
    const user = users.find((user) => user.phone === e.target.value);
    if (user) {
      setPayload((state) => ({ ...state, name: user.name, email: user.email, phone: user.phone }));
    } else {
      setPayload((state) => ({ ...state, name: "", email: "", phone: e.target.value }));
    }
  };

  const onChangeStartTime = (value) => {
    setPayload((state) => ({ ...state, startTime: value.format("YYYY-MM-DD hh:mm A") }));
  };

  const onChangeFinishTime = (value) => {
    setPayload((state) => ({ ...state, finishTime: value.format("YYYY-MM-DD hh:mm A") }));
  };

  const onChangeInput = (e) => {
    setPayload((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const getUsers = async (phone = null) => {
    const response = await dispatch(userAsyncActions.staffGetUsers({ phone })).unwrap();
    setUsers(response);
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (payload.startTime && payload.finishTime && payload.adults + payload.children > 0 && payload.phone) {
    }
  }, [payload]);

  const isEnableTableDropDown = Boolean(
    payload.startTime && payload.finishTime && payload.adults + payload.children > 0 && payload.phone,
  );

  const isEnableSubmit = Boolean(
    payload.startTime && payload.finishTime && payload.adults + payload.children > 0 && payload.phone && payload.table,
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
                }}
              >
                <FloorMap zoom={false}></FloorMap>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Dialog open={isOpenDialog}>
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
