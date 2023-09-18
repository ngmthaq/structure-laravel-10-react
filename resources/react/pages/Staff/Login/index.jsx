import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, TextField, Typography, capitalize } from "@mui/material";
import { __ } from "../../../plugins/i18n.plugin";
import { theme } from "../../../plugins/material.plugin";
import { convertHex2Rgba } from "../../../helpers/primitive.helper";
import { commonActions } from "../../../reducers/common.reducer";
import { PrimaryNotificationModel } from "../../../models/primary.notification.model";
import { authAsyncActions } from "../../../reducers/auth.reducer";

export const PageStaffLogin = () => {
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const onClickForgotPassword = () => {
    dispatch(
      commonActions.appendPrimaryNotification(PrimaryNotificationModel("info", __("custom.contact-your-admin"))),
    );
  };

  const onChangeEmail = (e) => {
    setCredentials((state) => ({ ...state, email: e.target.value }));
  };

  const onChangePassword = (e) => {
    setCredentials((state) => ({ ...state, password: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(credentials);
    dispatch(authAsyncActions.staffLogin(credentials));
  };

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
        onSubmit={onSubmit}
      >
        <Typography variant="h3" textAlign="center" marginBottom="40px">
          {__("custom.welcome-back")}
        </Typography>
        <TextField
          label={capitalize(__("custom.email"))}
          variant="outlined"
          sx={{ width: "100%", marginBottom: "16px" }}
          onChange={onChangeEmail}
        />
        <TextField
          type="password"
          label={capitalize(__("custom.password"))}
          variant="outlined"
          sx={{ width: "100%", marginBottom: "16px" }}
          onChange={onChangePassword}
        />
        <Box sx={{ marginBottom: "16px" }}>
          <Button variant="contained" fullWidth={true} size="large" type="submit">
            {__("custom.login").toUpperCase()}
          </Button>
        </Box>
        <Typography
          sx={{
            color: theme.palette.primary.main,
            textDecoration: "underline",
            textAlign: "center",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={onClickForgotPassword}
        >
          {__("custom.forgot-password-login-text")}
        </Typography>
      </Box>
    </Box>
  );
};
