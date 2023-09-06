import React from "react";
import { useDispatch } from "react-redux";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
    capitalize,
} from "@mui/material";
import { __ } from "../../../plugins/i18n.plugin";
import { theme } from "../../../plugins/material.plugin";
import { convertHex2Rgba } from "../../../helpers/primitive.helper";

export const PageStaffLogin = () => {
    const dispatch = useDispatch();

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: convertHex2Rgba(theme.palette.primary.light, 0.25),
            }}
        >
            <Box
                component="form"
                sx={{
                    width: 480,
                    maxWidth: "100%",
                    margin: "8px",
                    boxShadow: "0px 0px 8px 0px grey",
                    padding: "64px 24px",
                    borderRadius: "4px",
                    background: "white",
                }}
            >
                <Typography variant="h3" textAlign="center" marginBottom="40px">
                    {__("custom.welcome-back")}
                </Typography>
                <TextField
                    required={true}
                    label={capitalize(__("custom.email"))}
                    variant="outlined"
                    sx={{ width: "100%", marginBottom: "16px" }}
                />
                <TextField
                    type="password"
                    required={true}
                    label={capitalize(__("custom.password"))}
                    variant="outlined"
                    sx={{ width: "100%", marginBottom: "16px" }}
                />
                <FormControlLabel
                    control={<Checkbox />}
                    label={capitalize(__("custom.remember-me"))}
                    labelPlacement="end"
                    sx={{ userSelect: "none", marginBottom: "16px" }}
                />
                <Box sx={{ marginBottom: "16px" }}>
                    <Button variant="contained" fullWidth={true} size="large">
                        {__("custom.login").toUpperCase()}
                    </Button>
                </Box>
                <Typography
                    sx={{
                        color: theme.palette.primary.main,
                        textDecoration: "underline",
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                >
                    {__("custom.forgot-password-login-text")}
                </Typography>
            </Box>
        </Box>
    );
};
