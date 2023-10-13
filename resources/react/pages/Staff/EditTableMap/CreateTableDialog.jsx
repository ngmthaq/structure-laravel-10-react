import React, { useState } from "react";
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

const initPayload = {
  dir: TABLE_DIR.horizontal,
  type: TABLE_TYPE.square,
  seats: 1,
};

export const CreateTableDialog = ({ open, onClose, onSubmit }) => {
  const [payload, setPayload] = useState({ ...initPayload });

  const onSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(payload);
  };

  const onCloseDialog = () => {
    if (isObjDeepEqual(payload, initPayload)) {
      onClose();
      setPayload(initPayload);
    } else if (confirm(__("custom.confirm-lost-changed"))) {
      onClose();
      setPayload(initPayload);
    }
  };

  const onChange = (e) => {
    setPayload((state) => ({ ...state, [e.target.name]: Number(e.target.value) || null }));
  };

  return (
    <Dialog open={open} onClose={onCloseDialog} fullWidth>
      <Box component="form" onSubmit={onSubmitForm}>
        <DialogTitle>{__("custom.admin-tables-create-title")}</DialogTitle>
        <DialogContent sx={{ paddingTop: "16px !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{__("custom.table-type")}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                defaultValue={TABLE_TYPE.square}
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label-2">{__("custom.table-dir")}</InputLabel>
              <Select
                labelId="demo-simple-select-label-2"
                defaultValue={TABLE_DIR.horizontal}
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
            <FormControl fullWidth>
              <TextField
                id="outlined-basic"
                label={__("custom.seat-number")}
                size="small"
                variant="outlined"
                defaultValue={1}
                type="number"
                name="seats"
                onChange={onChange}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog}>{__("custom.close")}</Button>
          <Button type="submit">{__("custom.create")}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
