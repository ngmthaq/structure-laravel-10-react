import React, { Fragment } from "react";
import dayjs from "dayjs";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { Cancel, DoneAll, PeopleAlt, RocketLaunch, TableBar, Verified } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { getStatusOfBill } from "./BillCard";
import { commonActions } from "../../../reducers/common.reducer";
import { billAsyncActions } from "../../../reducers/bill.reducer";
import { PrimaryNotificationModel } from "../../../models/primary.notification.model";
import { useEventBus } from "../../../plugins/bus.plugin";
import { REFRESH_BILLS } from ".";

export const SelectedBillDialog = ({ bill, onClose }) => {
  return (
    <Dialog open={Boolean(bill)} onClose={onClose} fullWidth maxWidth="sm">
      {Boolean(bill) ? (
        <DialogContent sx={{ padding: "4px" }}>
          <Card elevation={0}>
            <CardHeader
              avatar={<Avatar>{bill.user.name.charAt(0)}</Avatar>}
              title={bill.user.name}
              subheader={bill.user.phone}
            />
            <CardActions
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px" }}
            >
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
            <CardContent>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableBody>
                    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        Reservation Start At
                      </TableCell>
                      <TableCell align="right">{dayjs(bill.startAt).format("DD/MM/YYYY HH:mm")}</TableCell>
                    </TableRow>
                    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        Reservation End At
                      </TableCell>
                      <TableCell align="right">{dayjs(bill.endAt).format("DD/MM/YYYY HH:mm")}</TableCell>
                    </TableRow>
                    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        Confirmed At
                      </TableCell>
                      <TableCell align="right">
                        {bill.confirmedAt ? dayjs(bill.confirmedAt).format("DD/MM/YYYY HH:mm") : ""}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        User Start At
                      </TableCell>
                      <TableCell align="right">
                        {bill.userStartedAt ? dayjs(bill.userStartedAt).format("DD/MM/YYYY HH:mm") : ""}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        Completed At
                      </TableCell>
                      <TableCell align="right">
                        {bill.completedAt ? dayjs(bill.completedAt).format("DD/MM/YYYY HH:mm") : ""}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        Cancel At
                      </TableCell>
                      <TableCell align="right">
                        {bill.cancelAt ? dayjs(bill.cancelAt).format("DD/MM/YYYY HH:mm") : ""}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <ButtonContainer bill={bill} onClose={onClose} />
          </Card>
        </DialogContent>
      ) : (
        <Fragment />
      )}
    </Dialog>
  );
};

const ButtonContainer = ({ bill, onClose }) => {
  const dispatch = useDispatch();

  const eventBus = useEventBus();

  const onChangeStatus = async (type) => {
    if (confirm("Do you want to change status of this reservation?")) {
      onHandleChangeStatus(type);
    }
  };

  const onHandleChangeStatus = async (type) => {
    try {
      dispatch(commonActions.openLinearLoading());
      await dispatch(billAsyncActions.changeStatus({ id: bill.id, type: type })).unwrap();
      alert("Change reservation status successfully!");
      dispatch(commonActions.closeLinearLoading());
      eventBus.emit(REFRESH_BILLS);
      onClose();
    } catch (error) {
      console.error(error);
      dispatch(commonActions.closeLinearLoading());
      dispatch(
        commonActions.appendPrimaryNotification(PrimaryNotificationModel("error", __("custom.something-wrong"))),
      );
    }
  };

  if (bill.cancelAt || (bill.startAt && bill.endAt && bill.confirmedAt && bill.userStartedAt && bill.completedAt)) {
    return <Fragment />;
  }

  if (bill.startAt && bill.endAt && bill.confirmedAt && bill.userStartedAt) {
    return (
      <CardActions
        sx={{
          padding: "4px 15px 8px",
        }}
      >
        <ActionButton Icon={Verified} text="Complete" onClick={() => onChangeStatus("completed_at")} />
        <ActionButton Icon={Cancel} text="Cancel" onClick={() => onChangeStatus("cancel_at")} />
      </CardActions>
    );
  }

  if (bill.startAt && bill.endAt && bill.confirmedAt) {
    return (
      <CardActions
        sx={{
          padding: "4px 15px 8px",
        }}
      >
        <ActionButton Icon={RocketLaunch} text="Start" onClick={() => onChangeStatus("user_started_at")} />
        <ActionButton Icon={Cancel} text="Cancel" onClick={() => onChangeStatus("cancel_at")} />
      </CardActions>
    );
  }

  if (bill.startAt && bill.endAt && !bill.confirmedAt) {
    return (
      <CardActions
        sx={{
          padding: "4px 15px 8px",
        }}
      >
        <ActionButton Icon={DoneAll} text="Confirm" onClick={() => onChangeStatus("confirmed_at")} />
        <ActionButton Icon={Cancel} text="Cancel" onClick={() => onChangeStatus("cancel_at")} />
      </CardActions>
    );
  }
};

const ActionButton = ({ Icon, text, onClick }) => {
  return (
    <Button
      variant="contained"
      color={text === "Cancel" ? "error" : "primary"}
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "4px",
      }}
      onClick={onClick}
    >
      <Icon />
      <Typography>{text}</Typography>
    </Button>
  );
};
