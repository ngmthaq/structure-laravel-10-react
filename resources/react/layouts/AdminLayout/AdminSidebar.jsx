import React from "react";
import { Box, Typography } from "@mui/material";
import { AdminAside } from "./AdminAside";

export const WIDTH = 320;

export const LOGO_HEIGHT = 60;

export const AdminSidebar = () => {
    return (
        <Box
            id="admin-sidebar"
            sx={{
                width: WIDTH,
                height: "100vh",
                background: "white",
                borderRight: `1px solid rgba(0, 0, 0, 0.1)`,
                padding: "8px 16px",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: LOGO_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    component="img"
                    src="/apple-touch-icon.png"
                    sx={{
                        width: "auto",
                        height: 30,
                        objectFit: "contain",
                        marginRight: "8px",
                    }}
                />
                <Typography
                    sx={{
                        fontWeight: "bold",
                        fontSize: 16,
                        lineHeight: "30px",
                    }}
                >
                    SEAT MANAGEMENT
                </Typography>
            </Box>
            <AdminAside />
        </Box>
    );
};
