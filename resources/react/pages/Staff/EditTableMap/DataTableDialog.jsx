import React, { Fragment, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Circle, East, Edit, South } from "@mui/icons-material";
import { __ } from "../../../plugins/i18n.plugin";
import { TABLE_DIR, TABLE_TYPE } from "../../../const/app.const";
import { EditTableDialog } from "./EditTableDialog";
import { REFRESH_TABLES } from ".";
import { useEventBus } from "../../../plugins/bus.plugin";
import { tableAsyncActions } from "../../../reducers/table.reducer";
import { useDispatch } from "react-redux";
import { commonActions } from "../../../reducers/common.reducer";

export const DataTableDialog = ({ open, onClose, tables, onClickAction }) => {
  const eventBus = useEventBus();

  const dispatch = useDispatch();

  const [selectedTable, setSelectedTable] = useState(null);

  const onClick = (table) => {
    if (onClickAction) onClickAction(table);
  };

  const onCloseEditDialog = () => {
    setSelectedTable(null);
  };

  const onOpenEditDialog = (table) => {
    setSelectedTable({ ...table });
  };

  const onSubmit = async (payload) => {
    try {
      dispatch(commonActions.openLinearLoading());
      await dispatch(tableAsyncActions.updateTable(payload)).unwrap();
      alert("Edit table successfully!");
      dispatch(commonActions.closeLinearLoading());
      onCloseEditDialog();
      eventBus.emit(REFRESH_TABLES);
    } catch (error) {
      console.error(error);
      dispatch(commonActions.closeLinearLoading());
      dispatch(
        commonActions.appendPrimaryNotification(PrimaryNotificationModel("error", __("custom.something-wrong"))),
      );
    }
  };

  return (
    <Fragment>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>{__("custom.show-all-tables")}</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ maxHeight: 660 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">{__("custom.table-type")}</TableCell>
                  <TableCell align="center">{__("custom.table-dir")}</TableCell>
                  <TableCell align="center">{__("custom.seats")}</TableCell>
                  <TableCell align="center">{__("custom.available")}</TableCell>
                  <TableCell align="center">{__("custom.show")}</TableCell>
                  <TableCell align="center">{__("custom.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell align="center">{table.id}</TableCell>
                    <TableCell align="center">
                      {table.type === TABLE_TYPE.circle ? __("custom.circle") : __("custom.square")}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <Typography sx={{ fontSize: "0.875rem" }}>
                          {table.type === TABLE_TYPE.circle
                            ? __("custom.circle")
                            : table.direction === TABLE_DIR.horizontal
                            ? __("custom.horizontal")
                            : __("custom.vertical")}
                        </Typography>
                        <IconButton disabled>
                          {table.type === TABLE_TYPE.circle ? (
                            <Circle />
                          ) : table.direction === TABLE_DIR.horizontal ? (
                            <South />
                          ) : (
                            <East />
                          )}
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{table.seats ? table.seats.length : 0}</TableCell>
                    <TableCell align="center">{table.isBlock ? "No" : "Yes"}</TableCell>
                    <TableCell align="center">
                      <Switch
                        title="Toggle Show Table"
                        checked={table.deletedAt === null}
                        onClick={() => onClick(table)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton title="Edit Table Data" onClick={() => onOpenEditDialog(table)}>
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{__("custom.close")}</Button>
        </DialogActions>
      </Dialog>
      <EditTableDialog
        open={Boolean(selectedTable)}
        table={selectedTable}
        onClose={onCloseEditDialog}
        onSubmit={onSubmit}
      />
    </Fragment>
  );
};
