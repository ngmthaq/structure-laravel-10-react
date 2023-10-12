import React, { Fragment } from "react";
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
import { isObjDeepEqual } from "../../../helpers/reference.helper";
import { __ } from "../../../plugins/i18n.plugin";
import { ROLES } from "../../../const/app.const";

export const EditStaffDialog = ({ onClose, onSubmit, onChange, data }) => {
  return (
    <Dialog open={Boolean(data.data)} onClose={onClose}>
      <DialogTitle>{__("custom.show-staff-info")}</DialogTitle>
      <DialogContent sx={{ paddingTop: "16px !important" }}>
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            fullWidth
            disabled
            label="ID"
            value={data?.data?.id || ""}
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
          />
          <TextField
            fullWidth
            disabled
            label={__("custom.email")}
            value={data?.data?.email || ""}
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
          />
          <TextField
            fullWidth
            label={__("custom.name")}
            disabled={!data.isEdit}
            value={data?.data?.name || ""}
            name="name"
            onChange={onChange}
            autoComplete="off"
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
              disabled={!data.isEdit}
              value={data?.data?.role || ""}
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
            disabled={!data.isEdit}
            type="tel"
            name="phone"
            onChange={onChange}
            label={__("custom.phone-number")}
            value={data?.data?.phone || ""}
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
          />
          <TextField
            fullWidth
            disabled={!data.isEdit}
            label={__("custom.date-of-birth")}
            value={data?.data?.dateOfBirth || ""}
            name="dateOfBirth"
            onChange={onChange}
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
            type="date"
          />
          <TextField
            fullWidth
            disabled={!data.isEdit}
            label={__("custom.address")}
            value={data?.data?.address || ""}
            name="address"
            onChange={onChange}
            sx={{
              marginBottom: "16px",
              textTransform: "capitalize",
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        {data.isEdit ? (
          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            disabled={isObjDeepEqual(data.data, data.originalData)}
          >
            {__("custom.update")}
          </Button>
        ) : (
          <Fragment />
        )}
        <Button onClick={onClose} variant="text" fullWidth>
          {__("custom.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
