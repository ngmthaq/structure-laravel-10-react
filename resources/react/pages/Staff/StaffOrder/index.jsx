import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  capitalize,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useDispatch } from "react-redux";
import { AdminPanelSettings, KeyboardArrowRight } from "@mui/icons-material";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { theme } from "../../../plugins/material.plugin";
import { __ } from "../../../plugins/i18n.plugin";
import { userAsyncActions } from "../../../reducers/user.reducer";
import { useLoaderData } from "react-router-dom";
import dayjs from "dayjs";

export const StaffOrder = () => {
  const dispatch = useDispatch();

  const { staff } = useLoaderData();

  const [payload, setPayload] = useState({
    phone: "",
    startTime: "",
    finishTime: "",
    adults: 0,
    children: 0,
    table: "",
    name: "",
    email: "",
  });

  const [users, setUsers] = useState([]);

  const [phones, setPhones] = useState([]);

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
    setPhones(response.map((user) => user.phone));
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

  console.log(isEnableTableDropDown, payload);

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
            <Grid item xs={4}>
              <TextField
                fullWidth
                sx={{ width: "100%", marginBottom: "16px" }}
                label={capitalize(__("custom.phone-number"))}
                onInput={onChangePhone}
              />
              <DateTimePicker
                onChange={onChangeStartTime}
                sx={{ width: "100%", marginBottom: "16px" }}
                label={__("custom.start-time")}
                views={["year", "month", "day", "hours", "minutes"]}
              />
              <DateTimePicker
                onChange={onChangeFinishTime}
                sx={{ width: "100%", marginBottom: "16px" }}
                label={__("custom.finish-time")}
                views={["year", "month", "day", "hours", "minutes"]}
              />
              <TextField
                fullWidth
                sx={{ marginBottom: "16px" }}
                type="number"
                name="adults"
                label={__("custom.number-of-adults")}
                onChange={onChangeInput}
                defaultValue={0}
              />
              <TextField
                fullWidth
                sx={{ marginBottom: "16px" }}
                type="number"
                name="children"
                label={__("custom.number-of-children")}
                onChange={onChangeInput}
                defaultValue={0}
              />
              <FormControl fullWidth sx={{ marginBottom: "16px" }}>
                <InputLabel id="demo-simple-select-label">{__("custom.select-table")}</InputLabel>
                <Select
                  name="table"
                  onChange={onChangeInput}
                  label={__("custom.select-table")}
                  labelId="demo-simple-select-label"
                  defaultValue=""
                  disabled={!isEnableTableDropDown}
                >
                  <MenuItem value="">{__("custom.select-table")}</MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <Button fullWidth variant="contained" size="large" disabled={!isEnableSubmit}>
                {__("custom.order")}
              </Button>
            </Grid>
            <Grid item xs={8}>
              <Box
                sx={{
                  padding: "24px",
                  marginLeft: "64px",
                  height: "100%",
                  width: "600px",
                  border: "1px solid " + theme.palette.primary.main,
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "center",
                    borderBottom: "1px solid " + theme.palette.primary.main,
                    color: theme.palette.primary.dark,
                  }}
                >
                  {__("custom.bill-receipt")}
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.customer-phone")}:</strong> {payload.phone}
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.customer-name")}:</strong> {payload.name}
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.start-time")}:</strong> {payload.startTime}
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.finish-time")}:</strong> {payload.finishTime}
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.number-of-adults")}:</strong> {payload.adults}
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.number-of-children")}:</strong> {payload.children}
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.selected-table")}:</strong>
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.staff-confirmed")}:</strong> {staff.name}
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.created-at")}:</strong> {dayjs().format("YYYY/MM/DD")}
                </Typography>
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
