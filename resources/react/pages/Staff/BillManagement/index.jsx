import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { AdminPanelSettings, KeyboardArrowRight, Search } from "@mui/icons-material";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { theme } from "../../../plugins/material.plugin";
import { __ } from "../../../plugins/i18n.plugin";
import { billAsyncActions } from "../../../reducers/bill.reducer";
import { BillCard } from "./BillCard";
import { SelectedBillDialog } from "./SelectedBillDialog";
import { commonActions } from "../../../reducers/common.reducer";

export const BillManagement = () => {
  const dispatch = useDispatch();

  const [bills, setBills] = useState([]);

  const [phone, setPhone] = useState("");

  const [selectedBill, setSelectedBill] = useState(null);

  const onChangePhoneInput = (e) => {
    setPhone(e.target.value);
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

  useEffect(() => {
    const getBills = async () => {
      dispatch(commonActions.openLinearLoading());
      const response = await dispatch(billAsyncActions.getAllBills()).unwrap();
      dispatch(commonActions.closeLinearLoading());
      setBills(response);
    };

    getBills();
  }, []);

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
      <Grid container spacing={2} sx={{ padding: "8px" }}>
        {filterBills().map((bill) => (
          <Grid item xs={3} key={bill.id}>
            <BillCard bill={bill} onClick={onClickBill} />
          </Grid>
        ))}
      </Grid>
      <SelectedBillDialog bill={selectedBill} onClose={onCloseBillDialog} />
    </AdminLayout>
  );
};
