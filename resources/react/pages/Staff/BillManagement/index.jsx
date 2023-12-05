import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { AdminPanelSettings, KeyboardArrowRight, Refresh, Search } from "@mui/icons-material";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { theme } from "../../../plugins/material.plugin";
import { __ } from "../../../plugins/i18n.plugin";
import { billAsyncActions } from "../../../reducers/bill.reducer";
import { BillCard } from "./BillCard";
import { SelectedBillDialog } from "./SelectedBillDialog";
import { commonActions } from "../../../reducers/common.reducer";
import dayjs from "dayjs";
import { useEventBus } from "../../../plugins/bus.plugin";

export const REFRESH_BILLS = "STAFF_REFRESH_BILL";

export const BillManagement = () => {
  const dispatch = useDispatch();

  const eventBus = useEventBus();

  const [bills, setBills] = useState([]);

  const [phone, setPhone] = useState("");

  const [selectedBill, setSelectedBill] = useState(null);

  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));

  const onChangePhoneInput = (e) => {
    setPhone(e.target.value);
  };

  const onChangeDate = (e) => {
    setDate(e.target.value);
  };

  const filterBills = () => {
    return bills.filter((bill) => bill.user.phone.startsWith(phone));
  };

  const onClickBill = (bill) => {
    setSelectedBill(bill);
  };

  const onCloseBillDialog = () => {
    setSelectedBill(null);
  };

  const getBills = async (selectedDate) => {
    dispatch(commonActions.openLinearLoading());
    const response = await dispatch(billAsyncActions.getAllBills({ date: selectedDate || date })).unwrap();
    dispatch(commonActions.closeLinearLoading());
    setBills(response);
  };

  useEffect(() => {
    getBills();
  }, [date]);

  useEffect(() => {
    const handleEventBus = () => getBills(date);
    eventBus.on(REFRESH_BILLS, handleEventBus);
    return () => {
      eventBus.off(REFRESH_BILLS, handleEventBus);
    };
  });

  return (
    <AdminLayout>
      <Box
        component="form"
        sx={{ padding: "16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h5" sx={{ textTransform: "capitalize", marginBottom: "4px" }}>
            {__("custom.staff-manage-bills-title")}
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
            <Box component="span">{__("custom.staff-manage-bills-title")}</Box>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconButton onClick={getBills} title="Refresh">
            <Refresh />
          </IconButton>
          <TextField
            value={date}
            variant="outlined"
            size="small"
            type="date"
            sx={{ width: "200px" }}
            onInput={onChangeDate}
          />
          <TextField
            label={__("custom.search-bill-with-phone")}
            variant="outlined"
            size="small"
            sx={{ width: "300px" }}
            onInput={onChangePhoneInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ padding: "8px" }}>
        {filterBills().length > 0 ? (
          filterBills().map((bill) => (
            <Grid item xs={3} key={bill.id}>
              <BillCard bill={bill} onClick={onClickBill} />
            </Grid>
          ))
        ) : (
          <Typography sx={{ textAlign: "center", width: "100%", marginTop: "32px" }}>No results were found</Typography>
        )}
      </Grid>
      <SelectedBillDialog bill={selectedBill} onClose={onCloseBillDialog} />
    </AdminLayout>
  );
};
