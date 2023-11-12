import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, TextField, Typography } from "@mui/material";
import { AdminPanelSettings, KeyboardArrowRight } from "@mui/icons-material";
import { decamelize } from "humps";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { theme } from "../../../plugins/material.plugin";
import { __ } from "../../../plugins/i18n.plugin";
import { commonActions, commonAsyncActions } from "../../../reducers/common.reducer";
import { PrimaryNotificationModel } from "../../../models/primary.notification.model";

export const Configurations = () => {
  const dispatch = useDispatch();

  const [configurations, setConfigurations] = useState({
    title: "",
    password: "",
    favicon: "",
    name: "",
    logo: "",
    roomWidth: "",
    roomHeight: "",
  });
  const [files, setFiles] = useState({ favicon: null, logo: null });

  const fetchConfigurations = async () => {
    try {
      dispatch(commonActions.openLinearLoading());
      const response = await dispatch(commonAsyncActions.getConfigurations()).unwrap();
      dispatch(commonActions.closeLinearLoading());

      const newConfigurations = response.reduce((cur, conf) => {
        if (conf.key === "DEFAULT_STAFF_PASSWORD_KEY") {
          cur.password = conf.value;
        }

        if (conf.key === "SPA_DOCUMENT_TITLE_KEY") {
          cur.title = conf.value;
        }

        if (conf.key === "SPA_DOCUMENT_FAVICON_KEY") {
          cur.favicon = conf.value;
        }

        if (conf.key === "SPA_LOGO_KEY") {
          cur.logo = conf.value;
        }

        if (conf.key === "SPA_NAME_KEY") {
          cur.name = conf.value;
        }

        if (conf.key === "ROOM_WIDTH_KEY") {
          cur.roomWidth = conf.value;
        }

        if (conf.key === "ROOM_HEIGHT_KEY") {
          cur.roomHeight = conf.value;
        }

        return cur;
      }, {});

      setConfigurations(newConfigurations);
    } catch (error) {
      dispatch(commonActions.closeLinearLoading());
      dispatch(
        commonActions.appendPrimaryNotification(PrimaryNotificationModel("error", __("custom.something-wrong"))),
      );
    }
  };

  const onChangeTextField = (e) => {
    setConfigurations((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const onChangeFavicon = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles((state) => ({ ...state, favicon: file }));
      setConfigurations((state) => ({ ...state, favicon: URL.createObjectURL(file) }));
    }
  };

  const onChangeLogo = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles((state) => ({ ...state, logo: file }));
      setConfigurations((state) => ({ ...state, logo: URL.createObjectURL(file) }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(commonActions.openLinearLoading());
      const formData = new FormData();
      formData.append(decamelize("defaultPassword"), configurations.password);
      formData.append(decamelize("appTitle"), configurations.title);
      formData.append(decamelize("appName"), configurations.name);
      formData.append(decamelize("roomWidth"), configurations.roomWidth);
      formData.append(decamelize("roomHeight"), configurations.roomHeight);
      formData.append("_method", "PUT");
      if (files.favicon) formData.append(decamelize("appFavicon"), files.favicon);
      if (files.logo) formData.append(decamelize("appLogo"), files.logo);
      await dispatch(commonAsyncActions.setConfigurations(formData)).unwrap();
      location.reload();
    } catch (error) {
      dispatch(commonActions.closeLinearLoading());
      if (error.status && error.status === 422) {
        const notifications = Object.values(error.data.errors).map((e) => PrimaryNotificationModel("error", e[0]));
        dispatch(commonActions.appendPrimaryNotification(JSON.stringify(notifications)));
      } else {
        dispatch(
          commonActions.appendPrimaryNotification(PrimaryNotificationModel("error", __("custom.something-wrong"))),
        );
      }
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  return (
    <AdminLayout>
      <Box sx={{ padding: "16px" }}>
        <Typography variant="h5" sx={{ textTransform: "capitalize", marginBottom: "4px" }}>
          {__("custom.admin-configurations-title")}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            textTransform: "capitalize",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: theme.palette.grey[600],
            "& span:last-child": {
              color: theme.palette.grey[400],
            },
          }}
        >
          <AdminPanelSettings fontSize="small" />
          <KeyboardArrowRight fontSize="small" />
          <Box component="span">{__("custom.admin-role")}</Box>
          <KeyboardArrowRight fontSize="small" />
          <Box component="span">{__("custom.admin-configurations-title")}</Box>
        </Typography>
      </Box>
      <Box sx={{ padding: "16px", width: "480px" }}>
        <Box component="form" onSubmit={onSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box>
              <TextField
                fullWidth
                value={configurations.password}
                label={__("custom.default-password-label")}
                sx={{ marginBottom: "16px" }}
                name="password"
                onChange={onChangeTextField}
              />
              <TextField
                fullWidth
                value={configurations.title}
                label={__("custom.document-title")}
                sx={{ marginBottom: "16px" }}
                name="title"
                onChange={onChangeTextField}
              />
              <TextField
                fullWidth
                value={configurations.name}
                label={__("custom.app-name")}
                sx={{ marginBottom: "16px" }}
                name="name"
                onChange={onChangeTextField}
              />
              <TextField
                fullWidth
                value={configurations.roomWidth}
                label={__("custom.room-width")}
                sx={{ marginBottom: "16px" }}
                name="roomWidth"
                onChange={onChangeTextField}
              />
              <TextField
                fullWidth
                value={configurations.roomHeight}
                label={__("custom.room-height")}
                sx={{ marginBottom: "16px" }}
                name="roomHeight"
                onChange={onChangeTextField}
              />
            </Box>
            <Box sx={{ display: "flex", marginBottom: "16px" }}>
              <Box
                sx={{
                  width: "56px",
                  height: "56px",
                  padding: "8px",
                  border: "1px solid " + theme.palette.primary.main,
                  borderRadius: "4px 0 0 4px",
                }}
              >
                <Box
                  component="img"
                  src={configurations.favicon}
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Box>
              <Box
                component="label"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: theme.palette.primary.main,
                  fontSize: "14px",
                  cursor: "pointer",
                  width: "100%",
                  paddingLeft: "16px",
                  border: "1px solid " + theme.palette.primary.main,
                  borderLeft: "none",
                  borderRadius: "0 4px 4px 0",
                  fontWeight: "500",
                }}
                htmlFor="favicon"
              >
                {__("custom.upload-favicon")}
              </Box>
              <Box component="input" type="file" display="none" id="favicon" onChange={onChangeFavicon} />
            </Box>
            <Box sx={{ display: "flex", marginBottom: "16px" }}>
              <Box
                sx={{
                  width: "56px",
                  height: "56px",
                  padding: "8px",
                  border: "1px solid " + theme.palette.primary.main,
                  borderRadius: "4px 0 0 4px",
                }}
              >
                <Box
                  component="img"
                  src={configurations.logo}
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Box>
              <Box
                component="label"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: theme.palette.primary.main,
                  fontSize: "14px",
                  cursor: "pointer",
                  width: "100%",
                  paddingLeft: "16px",
                  border: "1px solid " + theme.palette.primary.main,
                  borderLeft: "none",
                  borderRadius: "0 4px 4px 0",
                  fontWeight: "500",
                }}
                htmlFor="logo"
              >
                {__("custom.upload-logo")}
              </Box>
              <Box component="input" type="file" display="none" id="logo" onChange={onChangeLogo} />
            </Box>
          </Box>
          <Box>
            <Button variant="contained" size="large" type="submit" fullWidth>
              {__("custom.submit")}
            </Button>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
};
