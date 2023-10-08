import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, TextField, Typography } from "@mui/material";
import { AdminPanelSettings, KeyboardArrowRight } from "@mui/icons-material";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { theme } from "../../../plugins/material.plugin";
import { __ } from "../../../plugins/i18n.plugin";
import { commonActions, commonAsyncActions } from "../../../reducers/common.reducer";

export const Configurations = () => {
  const dispatch = useDispatch();

  const [configurations, setConfigurations] = useState({ title: "", password: "", favicon: "" });
  const [files, setFiles] = useState({ favicon: null });

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

        return cur;
      }, {});

      setConfigurations(newConfigurations);
    } catch (error) {
      dispatch(commonActions.openLinearLoading());
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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(commonActions.openLinearLoading());
      const formData = new FormData();
      formData.append("app_title", configurations.title);
      formData.append("default_password", configurations.password);
      formData.append("_method", "PUT");
      if (files.favicon) formData.append("app_favicon", files.favicon);
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
      <Box sx={{ padding: "16px" }}>
        <Box component="form" sx={{ width: "500px", maxWidth: "100vw" }} onSubmit={onSubmit}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
            <Box sx={{ marginRight: "16px" }}>
              <Box
                sx={{
                  width: "100px",
                  height: "100px",
                  border: "1px solid grey",
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
                  display: "block",
                  textAlign: "center",
                  color: theme.palette.primary.main,
                  fontSize: "14px",
                  marginTop: "8px",
                  cursor: "pointer",
                }}
                htmlFor="favicon"
              >
                {__("custom.upload")}
              </Box>
              <Box component="input" type="file" display="none" id="favicon" onChange={onChangeFavicon} />
            </Box>
            <Box sx={{ width: "100%" }}>
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
            </Box>
          </Box>
          <Button fullWidth variant="contained" size="large" type="submit">
            {__("custom.submit")}
          </Button>
        </Box>
      </Box>
    </AdminLayout>
  );
};
