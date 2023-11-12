import React, { memo } from "react";
import { useLoaderData } from "react-router-dom";
import dayjs from "dayjs";
import { Box, Button, TextField, Typography, capitalize } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { theme } from "../../../plugins/material.plugin";
import { __ } from "../../../plugins/i18n.plugin";

export const OrderForm = memo(
  ({ onChangePhone, onChangeStartTime, onChangeFinishTime, onChangeInput, payload, isEnableSubmit, onSubmit }) => {
    const { staff } = useLoaderData();

    return (
      <Box
        sx={{
          padding: "16px",
          border: "1px solid " + theme.palette.primary.main,
          borderRadius: "2px",
          marginBottom: "16px",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              borderBottom: "1px solid " + theme.palette.primary.main,
              color: theme.palette.primary.dark,
              marginBottom: "16px",
              paddingBottom: "16px",
            }}
          >
            {__("custom.bill-receipt")}
          </Typography>
          <TextField
            fullWidth
            sx={{ width: "100%", marginBottom: "16px" }}
            label={capitalize(__("custom.phone-number"))}
            onChange={onChangePhone}
            value={payload.phone}
          />
          <DateTimePicker
            onChange={onChangeStartTime}
            sx={{ width: "100%", marginBottom: "16px" }}
            label={__("custom.start-time")}
            views={["year", "month", "day", "hours", "minutes"]}
            value={dayjs(payload.startTime)}
          />
          <DateTimePicker
            onChange={onChangeFinishTime}
            sx={{ width: "100%", marginBottom: "16px" }}
            label={__("custom.finish-time")}
            views={["year", "month", "day", "hours", "minutes"]}
            value={dayjs(payload.finishTime)}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <TextField
              fullWidth
              sx={{ marginBottom: "16px" }}
              type="number"
              name="adults"
              label={__("custom.number-of-adults")}
              onChange={onChangeInput}
              value={payload.adults}
            />
            <TextField
              fullWidth
              sx={{ marginBottom: "16px" }}
              type="number"
              name="children"
              label={__("custom.number-of-children")}
              onChange={onChangeInput}
              value={payload.children}
            />
          </Box>
          <Typography sx={{ marginBottom: "16px" }}>
            <strong>{__("custom.customer-name")}:</strong> {payload.name || __("custom.user-not-found")}
          </Typography>
          <Typography sx={{ marginBottom: "16px" }}>
            <strong>{__("custom.staff-confirmed")}:</strong> {staff.name}
          </Typography>
          <Typography sx={{ marginBottom: "16px" }}>
            <strong>{__("custom.created-at")}:</strong> {dayjs().format("YYYY/MM/DD")}
          </Typography>
          <Typography sx={{ marginBottom: "16px" }}>
            <strong>{__("custom.selected-table")}:</strong>{" "}
            {payload.tables.length > 0 ? payload.tables.join(", ") : __("custom.no-table-selected")}
          </Typography>
        </Box>
        <Button fullWidth variant="contained" size="large" disabled={!isEnableSubmit} onClick={onSubmit}>
          {__("custom.order")}
        </Button>
      </Box>
    );
  },
);
