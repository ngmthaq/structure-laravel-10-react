import React from "react";
import { useSelector } from "react-redux";
import { Box, LinearProgress } from "@mui/material";

export const LINEAR_LOADING_ID = "linear-loading-id";

export const LinearLoadingComponent = () => {
    const isOpenLinearLoading = useSelector(
        (state) => state.common.isOpenLinearLoading
    );

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: isOpenLinearLoading ? "block" : "none",
                background: "rgba(0, 0, 0, 0.001)",
                zIndex: 10,
            }}
            id={LINEAR_LOADING_ID}
        >
            <LinearProgress sx={{ height: 4 }} />
        </Box>
    );
};
