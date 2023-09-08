import React from "react";
import { useRouteError } from "react-router-dom";
import { Box } from "@mui/material";

export const PageError = () => {
    const error = useRouteError();

    console.error(error);

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                component="h1"
                sx={{ margin: "16px", textTransform: "uppercase" }}
            >
                {error.status} {error.statusText}
            </Box>
            <Box component="p" sx={{ margin: "8px" }}>
                {error.data}
            </Box>
        </Box>
    );
};
