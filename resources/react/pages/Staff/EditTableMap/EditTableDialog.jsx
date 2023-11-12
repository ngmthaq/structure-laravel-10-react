import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { __ } from "../../../plugins/i18n.plugin";
import { isObjDeepEqual } from "../../../helpers/reference.helper";
import { TABLE_DIR, TABLE_TYPE } from "../../../const/app.const";

export const EditTableDialog = ({ open, onClose, onSubmit, table }) => {
  const [payload, setPayload] = useState(table);

  const onSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(payload);
  };

  const onCloseDialog = () => {
    if (!payload) {
      onClose();
    } else if (isObjDeepEqual(payload, table)) {
      onClose();
      setPayload(table);
    } else if (confirm(__("custom.confirm-lost-changed"))) {
      onClose();
      setPayload(table);
    }
  };

  const onChange = (e) => {
    setPayload((state) => ({ ...state, [e.target.name]: Number(e.target.value) || null }));
  };

  const onChangeStatus = (e) => {
    setPayload((state) => ({ ...state, isBlock: e.target.value }));
  };

  useEffect(() => {
    setPayload(table);
  }, [table]);

  return (
    <Dialog open={open} onClose={onCloseDialog} fullWidth>
      {payload && (
        <Box component="form" onSubmit={onSubmitForm}>
          <DialogTitle>{__("custom.admin-tables-edit-title")}</DialogTitle>
          <DialogContent sx={{ paddingTop: "16px !important" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <FormControl sx={{ width: "48%" }}>
                <InputLabel id="demo-simple-select-label">{__("custom.table-type")}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={payload.type}
                  label={__("custom.table-type")}
                  size="small"
                  name="type"
                  onChange={onChange}
                >
                  {Object.entries(TABLE_TYPE).map(([type, value]) => (
                    <MenuItem key={value} value={value}>
                      {__("custom." + type)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <InputLabel id="demo-simple-select-label-2">{__("custom.table-dir")}</InputLabel>
                <Select
                  labelId="demo-simple-select-label-2"
                  value={payload.direction}
                  label={__("custom.table-dir")}
                  size="small"
                  name="dir"
                  onChange={onChange}
                >
                  {Object.entries(TABLE_DIR).map(([dir, value]) => (
                    <MenuItem key={value} value={value}>
                      {__("custom." + dir)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <TextField
                  id="outlined-basic"
                  label={__("custom.seat-number")}
                  size="small"
                  variant="outlined"
                  value={payload.seats.length}
                  type="number"
                  name="seats"
                  onChange={onChange}
                />
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <InputLabel id="demo-simple-select-label">Available</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={payload.isBlock}
                  label="Available"
                  size="small"
                  name="isBlock"
                  onChange={onChangeStatus}
                >
                  <MenuItem value={true}>Unavailable</MenuItem>
                  <MenuItem value={false}>Available</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseDialog}>{__("custom.close")}</Button>
            <Button type="submit">{__("custom.update")}</Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};
