import React from "react";
import { Box } from "@mui/material";
import { AdminSidebar, WIDTH as ADMIN_SIDEBAR_WIDTH } from "./AdminSidebar";
import {
    AdminHeader,
    HEIGHT as ADMIN_HEADER_HEIGHT,
    MARGIN as ADMIN_HEADER_MARGIN,
} from "./AdminHeader";

export const AdminLayout = ({ children }) => {
    return (
        <Box
            id="admin-layout"
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `rgba(0, 0, 0, 0.025)`,
            }}
        >
            <AdminSidebar />
            <Box
                sx={{
                    height: "100vh",
                    width: `calc(100vw - ${ADMIN_SIDEBAR_WIDTH}px)`,
                }}
            >
                <AdminHeader />
                <Box
                    id="admin-layout-content"
                    sx={{
                        height: `calc(100vh - ${ADMIN_HEADER_HEIGHT}px - (${ADMIN_HEADER_MARGIN}px * 2) - 8px)`,
                        margin: "8px",
                        padding: "8px",
                        background: "white",
                        borderRadius: "8px",
                        boxShadow: "0px 0px 2px 0px gray",
                        overflowY: "scroll",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};
