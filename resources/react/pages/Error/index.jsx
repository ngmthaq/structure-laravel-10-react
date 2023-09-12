import React, { useEffect, useState } from "react";
import { useRouteError } from "react-router-dom";
import { Box } from "@mui/material";
import { AxiosError } from "axios";
import { authRoutes } from "../../const/path.const";
import { __ } from "../../plugins/i18n.plugin";

export const PageError = () => {
  const error = useRouteError();

  const [status, setStatus] = useState("");

  const [statusText, setStatusText] = useState("");

  const [data, setData] = useState("");

  useEffect(() => {
    if (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (error.response.status === 401) {
          alert(__("custom.login-expired"));
          localStorage.clear();
          location.href = authRoutes.staffLogin.path;
        } else if (error.response.status === 403) {
          setStatus(403);
          setStatusText(__("custom.forbidden"));
          setData(__("custom.access-deny"));
        } else {
          setStatus(500);
          setStatusText("");
          setData(__("custom.something-wrong"));
        }
      } else {
        setStatus(error.status);
        setStatusText(error.statusText);
        setData(error.data);
      }
    }
  }, [error]);

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
      <Box component="h1" sx={{ margin: "16px", textTransform: "uppercase" }}>
        {status} {statusText}
      </Box>
      <Box component="p" sx={{ margin: "8px" }}>
        {data}
      </Box>
    </Box>
  );
};
