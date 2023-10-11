import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { __ } from "../../../plugins/i18n.plugin";

export const CreateUserDialog = ({ open, onClose, onSubmit }) => {
  const [isFocusDob, setIsFocusDob] = useState(false);

  const [payload, setPayload] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
  });

  const onChange = (e) => {
    setPayload((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box component="form" onSubmit={onSubmitForm}>
        <DialogTitle>{__("custom.create-new-user")}</DialogTitle>
        <DialogContent>
          <DialogContentText marginBottom="16px">{__("custom.create-new-user-subtitle")}</DialogContentText>
          <TextField
            fullWidth
            label={__("custom.name")}
            name="name"
            onChange={onChange}
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
          />
          <TextField
            fullWidth
            label={__("custom.email")}
            name="email"
            onChange={onChange}
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
          />
          <TextField
            fullWidth
            type="tel"
            label={__("custom.phone-number")}
            name="phone"
            onChange={onChange}
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
          />
          <TextField
            fullWidth
            label={__("custom.date-of-birth")}
            name="dateOfBirth"
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
            onChange={onChange}
            onFocus={() => setIsFocusDob(true)}
            onBlur={() => setIsFocusDob(payload.dateOfBirth !== "")}
            type={isFocusDob ? "date" : "text"}
          />
          <TextField
            fullWidth
            label={__("custom.address")}
            name="address"
            onChange={onChange}
            sx={{
              textTransform: "capitalize",
            }}
          />
        </DialogContent>
        <DialogActions sx={{ margin: "0 16px", flexDirection: "column" }}>
          <Button fullWidth size="large" variant="contained" type="submit" sx={{ marginBottom: "8px" }}>
            {__("custom.create")}
          </Button>
          <Button fullWidth size="large" onClick={onClose} sx={{ marginLeft: "0px !important" }}>
            {__("custom.close")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
