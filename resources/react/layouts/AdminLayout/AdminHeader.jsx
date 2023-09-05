import React from "react";
import { Box } from "@mui/material";

export const HEIGHT = 40;

export const MARGIN = 8;

export const AdminHeader = () => {
    return (
        <Box
            id="admin-header"
            sx={{
                height: HEIGHT,
                margin: MARGIN + "px",
                padding: "8px",
                background: "white",
                borderRadius: "8px",
                boxShadow: "0px 0px 2px 0px gray",
            }}
        >
            Admin header
        </Box>
    );
};
