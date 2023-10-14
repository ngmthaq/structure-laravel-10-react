import React from "react";
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
import { Circle, East, South } from "@mui/icons-material";
import { __ } from "../../../plugins/i18n.plugin";
import { TABLE_DIR, TABLE_TYPE } from "../../../const/app.const";

export const DataTableDialog = ({ open, onClose, tables, onClickAction }) => {
  const onClick = (table) => {
    if (onClickAction) onClickAction(table);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{__("custom.show-all-tables")}</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ maxHeight: 660 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>{__("custom.table-type")}</TableCell>
                <TableCell>{__("custom.table-dir")}</TableCell>
                <TableCell>{__("custom.seats")}</TableCell>
                <TableCell>{__("custom.active")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>{table.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "8px" }}>
                      <Typography>
                        {table.type === TABLE_TYPE.circle ? __("custom.circle") : __("custom.square")}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "8px" }}>
                      <Typography>
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
                  <TableCell>{table.seats ? table.seats.length : 0}</TableCell>
                  <TableCell>
                    <Switch checked={table.deletedAt === null} onClick={() => onClick(table)} />
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
  );
};
