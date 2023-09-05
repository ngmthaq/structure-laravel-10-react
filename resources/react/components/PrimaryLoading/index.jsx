import React from "react";
import { useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";

export const PrimaryLoadingComponent = () => {
    const isPrimaryLoading = useSelector(
        (state) => state.common.isPrimaryLoading
    );

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: isPrimaryLoading ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0, 0, 0, 0.25)",
                zIndex: 10,
            }}
        >
            <CircularProgress />
        </Box>
    );
};
