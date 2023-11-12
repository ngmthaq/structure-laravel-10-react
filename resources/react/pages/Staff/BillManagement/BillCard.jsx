import React from "react";
import {
  AccessAlarm,
  Cancel,
  Check,
  DoneAllSharp,
  LocalFireDepartment,
  PeopleAlt,
  RocketLaunch,
  TableBar,
  Verified,
} from "@mui/icons-material";
import { Avatar, Box, Card, CardActions, CardHeader, Typography } from "@mui/material";

export const BillCard = ({ bill, onClick }) => {
  const onClickCard = () => {
    if (onClick) onClick(bill);
  };

  return (
    <Card elevation={2} sx={{ cursor: "pointer" }} onClick={onClickCard}>
      <CardHeader
        avatar={<Avatar>{bill.user.name.charAt(0)}</Avatar>}
        title={bill.user.name}
        subheader={bill.user.phone}
      />
      <CardActions sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px" }}>
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
            <Typography sx={{ margin: "2px 4px 0" }}>
              {bill.tables.length > 0 ? bill.tables.join(", ") : "???"}
            </Typography>
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
  );
};

export const getStatusOfBill = (bill) => {
  if (bill.cancelAt) {
    return { title: "Cancel", icon: <Cancel htmlColor="#757575" fontSize="small" /> };
  }

  if (
    bill.startAt &&
    bill.endAt &&
    bill.confirmedAt &&
    new Date(bill.startAt).valueOf() < Date.now() &&
    !bill.userStartedAt
  ) {
    return { title: "Late", icon: <AccessAlarm htmlColor="#757575" fontSize="small" /> };
  }

  if (bill.startAt && bill.endAt && bill.confirmedAt && bill.userStartedAt && bill.completedAt) {
    return { title: "Completed", icon: <Verified htmlColor="#757575" fontSize="small" /> };
  }

  if (
    bill.startAt &&
    bill.endAt &&
    bill.confirmedAt &&
    bill.userStartedAt &&
    new Date(bill.endAt).valueOf() < Date.now()
  ) {
    return { title: "Overstay", icon: <LocalFireDepartment htmlColor="#757575" fontSize="small" /> };
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
