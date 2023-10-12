import React from "react";
import { Dialog } from "@mui/material";
import { __ } from "../../../plugins/i18n.plugin";

export const DataTableDialog = ({ open, onClose }) => {
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
    Xin chao
  </Dialog>;
};
