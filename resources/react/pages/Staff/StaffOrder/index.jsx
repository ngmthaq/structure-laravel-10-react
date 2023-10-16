import React, { useState } from "react";
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
import { AdminPanelSettings, KeyboardArrowRight, Remove } from "@mui/icons-material";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { theme } from "../../../plugins/material.plugin";
import { __ } from "../../../plugins/i18n.plugin";
import { DateTimePicker } from "@mui/x-date-pickers";

export const StaffOrder = () => {
  const [payload, setPayload] = useState({
    phone: "",
    user: "",
    startTime: "",
    finishTime: "",
    adults: "",
    children: "",
    table: "",
  });

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const onCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const onChangeUserForm = (e) => {
    setUser((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const onChangePhone = (e, value) => {
    setPayload((state) => ({ ...state, phone: value }));
  };

  const onChangeStartTime = (value) => {
    setPayload((state) => ({ ...state, startTime: value }));
  };

  const onChangeFinishTime = (value) => {
    setPayload((state) => ({ ...state, finishTime: value }));
  };

  const onChangeInput = (e) => {
    setPayload((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

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
              <Autocomplete
                disablePortal
                options={["11111"]}
                sx={{ width: "100%", marginBottom: "16px" }}
                onChange={onChangePhone}
                renderInput={(params) => (
                  <TextField {...params} fullWidth label={capitalize(__("custom.phone-number"))} />
                )}
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
              />
              <TextField
                fullWidth
                sx={{ marginBottom: "16px" }}
                type="number"
                name="children"
                label={__("custom.number-of-children")}
                onChange={onChangeInput}
              />
              <FormControl fullWidth sx={{ marginBottom: "16px" }}>
                <InputLabel id="demo-simple-select-label">{__("custom.select-table")}</InputLabel>
                <Select
                  name="table"
                  onChange={onChangeInput}
                  label={__("custom.select-table")}
                  labelId="demo-simple-select-label"
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <Button fullWidth variant="contained" size="large">
                {__("custom.order")}
              </Button>
            </Grid>
            <Grid item xs={8}>
              <Box
                sx={{
                  margin: "0 160px",
                  padding: "24px",
                  border: "1px solid " + theme.palette.primary.main,
                  boxShadow: "0px 0px 4px 1px grey",
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
                  <strong>{__("custom.customer-phone")}:</strong>
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.customer-name")}:</strong>
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.start-time")}:</strong>
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.finish-time")}:</strong>
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.number-of-adults")}:</strong>
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.number-of-children")}:</strong>
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.selected-table")}:</strong>
                </Typography>
                <Typography sx={{ margin: "16px" }}>
                  <strong>{__("custom.staff-confirmed")}:</strong>
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
