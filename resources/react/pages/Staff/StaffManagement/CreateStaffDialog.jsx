import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { __ } from "../../../plugins/i18n.plugin";
import { isObjDeepEqual } from "../../../helpers/reference.helper";
import { ROLES } from "../../../const/app.const";
import { useEventBus } from "../../../plugins/bus.plugin";
import { CLEAR_FORM } from ".";

const initPayload = {
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  role: ROLES.staff,
};

export const CreateStaffDialog = ({ open, onClose, onSubmit }) => {
  const eventBus = useEventBus();

  const [isFocusDob, setIsFocusDob] = useState(false);

  const [payload, setPayload] = useState({ ...initPayload });

  const onChange = (e) => {
    setPayload((state) => ({ ...state, [e.target.name]: e.target.value }));
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

  const onSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(payload);
  };

  const onClearForm = () => {
    setPayload(initPayload);
  };

  useEffect(() => {
    eventBus.on(CLEAR_FORM, onClearForm);

    return () => {
      eventBus.off(CLEAR_FORM, onClearForm);
    };
  }, []);

  return (
    <Dialog open={open} onClose={onCloseDialog}>
      <Box component="form" onSubmit={onSubmitForm}>
        <DialogTitle>{__("custom.create-new-staff")}</DialogTitle>
        <DialogContent>
          <DialogContentText marginBottom="16px">{__("custom.create-new-staff-subtitle")}</DialogContentText>
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
          <FormControl fullWidth>
            <InputLabel id="role-select-label">{__("custom.role")}</InputLabel>
            <Select
              fullWidth
              labelId="role-select-label"
              defaultValue={initPayload.role}
              label={__("custom.role")}
              name="role"
              onChange={onChange}
              sx={{
                marginBottom: "16px",
                textTransform: "capitalize",
              }}
            >
              <MenuItem value={ROLES.admin}>{__("custom.admin-role")}</MenuItem>
              <MenuItem value={ROLES.staff}>{__("custom.staff-role")}</MenuItem>
            </Select>
          </FormControl>
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
          <Button
            fullWidth
            size="large"
            variant="contained"
            type="submit"
            sx={{ marginBottom: "8px" }}
            disabled={isObjDeepEqual(payload, initPayload)}
          >
            {__("custom.create")}
          </Button>
          <Button fullWidth size="large" onClick={onCloseDialog} sx={{ marginLeft: "0px !important" }}>
            {__("custom.close")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
