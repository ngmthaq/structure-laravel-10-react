import React from "react";
import { Box } from "@mui/material";

export const WIDTH = 240;

export const AdminSidebar = () => {
    return (
        <Box
            id="admin-sidebar"
            sx={{
                width: WIDTH,
                height: "100vh",
                background: "white",
                borderRight: `1px solid rgba(0, 0, 0, 0.1)`,
                padding: "8px",
            }}
        >
            Admin sidebar
        </Box>
    );
};
