import React, { Fragment } from "react";
import dayjs from "dayjs";
import { Avatar, Box, Button, Card, CardActions, CardHeader, Dialog, DialogContent, Typography } from "@mui/material";
import { Cancel, DoneAll, PeopleAlt, RocketLaunch, TableBar, Verified } from "@mui/icons-material";
import { getStatusOfBill } from "./BillCard";

export const SelectedBillDialog = ({ bill, onClose }) => {
  return (
    <Dialog open={Boolean(bill)} onClose={onClose} fullWidth maxWidth="xs">
      {Boolean(bill) ? (
        <DialogContent sx={{ padding: "4px" }}>
          <Card elevation={0}>
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
            <ButtonContainer bill={bill} />
          </Card>
        </DialogContent>
      ) : (
        <Fragment />
      )}
    </Dialog>
  );
};

const ButtonContainer = ({ bill }) => {
  if (bill.cancelAt) {
    return <Fragment />;
  }

  if (bill.startAt && bill.endAt && bill.confirmedAt && bill.userStartedAt) {
    return (
      <CardActions>
        <ActionButton Icon={Verified} text="Complete" />
        <ActionButton Icon={Cancel} text="Cancel" />
      </CardActions>
    );
  }

  if (bill.startAt && bill.endAt && bill.confirmedAt) {
    return (
      <CardActions>
        <ActionButton Icon={RocketLaunch} text="Start" />
        <ActionButton Icon={Cancel} text="Cancel" />
      </CardActions>
    );
  }

  if (bill.startAt && bill.endAt && !bill.confirmedAt) {
    return (
      <CardActions>
        <ActionButton Icon={DoneAll} text="Confirm" />
        <ActionButton Icon={Cancel} text="Cancel" />
      </CardActions>
    );
  }
};

const ActionButton = ({ Icon, text }) => {
  return (
    <Button
      variant="contained"
      color={text === "Cancel" ? "error" : "primary"}
      sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
    >
      <Typography>
        <Icon />
      </Typography>
      <Typography>{text}</Typography>
    </Button>
  );
};
