import React, { Fragment } from "react";
import dayjs from "dayjs";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { PeopleAlt, TableBar } from "@mui/icons-material";
import { getStatusOfBill } from "../../pages/Staff/BillManagement/BillCard";

export const BillsDialog = ({ bills, onClose }) => {
  return (
    <Dialog open={Boolean(bills.length)} onClose={onClose} maxWidth={bills.length > 1 ? "md" : "sm"} fullWidth>
      {Boolean(bills.length) ? (
        <DialogContent sx={{ padding: "4px" }}>
          <Grid container>
            {bills.map((bill) => (
              <Grid item xs={bills.length > 1 ? 6 : 12} key={bill.id}>
                <Card elevation={0}>
                  <CardHeader
                    avatar={<Avatar>{bill.user.name.charAt(0)}</Avatar>}
                    title={bill.user.name}
                    subheader={bill.user.phone}
                  />
                  <CardActions
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 16px",
                    }}
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
                        <Typography sx={{ margin: "2px 4px 0" }}>{bill.tableId}</Typography>
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
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      ) : (
        <Fragment />
      )}
    </Dialog>
  );
};
