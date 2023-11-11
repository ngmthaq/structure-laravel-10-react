import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { AdminAside } from "./AdminAside";
import { useLoaderData } from "react-router-dom";

export const WIDTH = 260;

export const LOGO_HEIGHT = 60;

export const AdminSidebar = () => {
  const { conf } = useLoaderData();

  const logo = useMemo(() => {
    const data = conf.find((config) => config.key === "SPA_LOGO_KEY");
    if (data) return data.value;
    return "";
  }, [conf]);

  const name = useMemo(() => {
    const data = conf.find((config) => config.key === "SPA_NAME_KEY");
    if (data) return data.value;
    return "";
  }, [conf]);

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
          src={logo}
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
          {name}
        </Typography>
      </Box>
      <AdminAside />
    </Box>
  );
};
