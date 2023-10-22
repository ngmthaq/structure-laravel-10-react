import React, { useEffect, useState } from "react";
import { Avatar, Box, Card, CardActions, CardHeader, Grid, TextField, Typography } from "@mui/material";
import {
  Check,
  DoneAllSharp,
  PeopleAlt,
  TableBar,
  Cancel,
  RocketLaunch,
  Verified,
  AccessAlarm,
  AdminPanelSettings,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { theme } from "../../../plugins/material.plugin";
import { __ } from "../../../plugins/i18n.plugin";
import { billAsyncActions } from "../../../reducers/bill.reducer";
import dayjs from "dayjs";

export const BillManagement = () => {
  const dispatch = useDispatch();

  const [bills, setBills] = useState([
    {
      id: 1,
      startAt: "20/10/20213 11:00 AM",
      endAt: "20/10/20213 11:00 AM",
      confirmedAt: "",
      userStartedAt: "",
      completedAt: "",
      cancelAt: "",
      adults: 2,
      children: 0,
      user: {
        id: 1,
        name: "Nguyen Manh Thang",
        email: "thangnm@gmail.com",
        phone: "0389884507",
      },
      staff: {
        id: 1,
        name: "Admin",
        email: "admin@gmail.com",
        phone: "0389884507",
      },
      tables: [1],
    },
  ]);

  const [phone, setPhone] = useState("");

  const onChangePhoneInput = (e) => {
    setPhone(e.target.value);
  };

  const getStatusOfBill = (bill) => {
    if (bill.cancelAt) {
      return { title: "Cancel", icon: <Cancel htmlColor="#757575" fontSize="small" /> };
    }

    if (bill.startAt && bill.endAt && new Date(bill.endAt).valueOf() < Date.now() && !bill.userStartedAt) {
      return { title: "Late", icon: <AccessAlarm htmlColor="#757575" fontSize="small" /> };
    }

    if (bill.startAt && bill.endAt && bill.confirmedAt && bill.userStartedAt && bill.completedAt) {
      return { title: "Completed", icon: <Verified htmlColor="#757575" fontSize="small" /> };
    }

    if (bill.startAt && bill.endAt && bill.confirmedAt && bill.userStartedAt) {
      return { title: "In Use", icon: <RocketLaunch htmlColor="#757575" fontSize="small" /> };
    }

    if (bill.startAt && bill.endAt && bill.confirmedAt) {
      return { title: "Confirmed", icon: <DoneAllSharp htmlColor="#757575" fontSize="small" /> };
    }

    if (bill.startAt && bill.endAt) {
      return { title: "Booked", icon: <Check htmlColor="#757575" fontSize="small" /> };
    }
  };

  const filterBills = () => {
    return bills.filter((bill) => bill.user.phone.startsWith(phone));
  };

  useEffect(() => {
    const getBills = async () => {
      const response = await dispatch(billAsyncActions.getAllBills()).unwrap();
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
          sx={{ width: "240px" }}
          onInput={onChangePhoneInput}
        />
      </Box>
      <Grid container spacing={2} sx={{ padding: "8px" }}>
        {filterBills().map((bill) => (
          <Grid item xs={3} key={bill.id}>
            <Card elevation={3} sx={{ cursor: "pointer" }}>
              <CardHeader
                avatar={<Avatar>{bill.user.name.charAt(0)}</Avatar>}
                title={bill.user.name}
                subheader={dayjs(bill.startAt).format("DD/MM/YYYY HH:mm")}
              />
              <CardActions sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                    <Typography sx={{ margin: "2px 4px 0" }}>{bill.tables.join(", ")}</Typography>
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
            </Card>
          </Grid>
        ))}
      </Grid>
    </AdminLayout>
  );
};
