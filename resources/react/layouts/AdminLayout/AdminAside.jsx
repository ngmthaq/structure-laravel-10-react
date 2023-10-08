import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useLoaderData } from "react-router-dom";
import { Box, Divider, Typography } from "@mui/material";
import {
  AccountCircle,
  AddBox,
  Bookmark,
  Construction,
  ContentPaste,
  Dashboard,
  History,
  Settings,
  SupervisedUserCircle,
  TableBarRounded,
} from "@mui/icons-material";
import { LOGO_HEIGHT } from "./AdminSidebar";
import { adminRoutes, staffRoutes } from "../../const/path.const";
import { __ } from "../../plugins/i18n.plugin";
import { theme } from "../../plugins/material.plugin";
import { ROLES } from "../../const/app.const";

export const AdminAside = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { staff } = useLoaderData();

  const [items] = useState([
    {
      type: "category",
      title: __("custom.admin-title"),
      role: ROLES.admin,
    },
    {
      type: "route",
      path: adminRoutes.dashboard.path,
      title: __("custom.admin-dashboard-title"),
      Icon: Dashboard,
      role: ROLES.admin,
    },
    {
      type: "route",
      path: adminRoutes.userManagement.path,
      title: __("custom.admin-manage-users-title"),
      Icon: AccountCircle,
      role: ROLES.admin,
    },
    {
      type: "route",
      path: adminRoutes.staffManagement.path,
      title: __("custom.admin-manage-staffs-title"),
      Icon: SupervisedUserCircle,
      role: ROLES.admin,
    },
    {
      type: "route",
      path: adminRoutes.createNewTable.path,
      title: __("custom.admin-tables-create-title"),
      Icon: AddBox,
      role: ROLES.admin,
    },
    {
      type: "route",
      path: adminRoutes.editTableMap.path,
      title: __("custom.admin-tables-edit-title"),
      Icon: Construction,
      role: ROLES.admin,
    },
    {
      type: "route",
      path: adminRoutes.configurations.path,
      title: __("custom.admin-configurations-title"),
      Icon: Settings,
      role: ROLES.admin,
    },
    {
      type: "divider",
      role: ROLES.admin,
    },
    {
      type: "category",
      title: __("custom.staff-title"),
      role: ROLES.staff,
    },
    {
      type: "route",
      path: staffRoutes.tableManagement.path,
      title: __("custom.staff-manage-tables-title"),
      Icon: TableBarRounded,
      role: ROLES.staff,
    },
    {
      type: "route",
      path: staffRoutes.billManagement.path,
      title: __("custom.staff-manage-bills-title"),
      Icon: ContentPaste,
      role: ROLES.staff,
    },
    {
      type: "route",
      path: staffRoutes.order.path,
      title: __("custom.staff-order-title"),
      Icon: Bookmark,
      role: ROLES.staff,
    },
    {
      type: "route",
      path: staffRoutes.orderHistory.path,
      title: __("custom.staff-order-history-title"),
      Icon: History,
      role: ROLES.staff,
    },
  ]);

  const onClick = (path) => {
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  const onFilterNavItems = (item) => {
    if (staff.isAdmin) {
      return true;
    }

    return item.role === staff.role;
  };

  return (
    <Box
      component="aside"
      sx={{
        width: "100%",
        height: `calc(100% - ${LOGO_HEIGHT}px - 16px)`,
        overflowY: "scroll",
        marginTop: "16px",
        position: "relative",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {items.filter(onFilterNavItems).map((item, index) =>
        item.type === "route" ? (
          <Box
            key={index}
            sx={{
              textTransform: "capitalize",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "16px",
              padding: "16px 8px",
              transition: "all 0.1s linear",
              borderRadius: "4px",
              marginBottom: "8px",
              color: theme.palette.grey[800],
              "&:hover": {
                background: `rgba(93,135,255,0.1)`,
                color: theme.palette.primary.main,
              },
              "&.active": {
                background: theme.palette.primary.main,
                color: "white",
              },
            }}
            onClick={() => onClick(item.path)}
            className={location.pathname === item.path ? "active" : ""}
          >
            <item.Icon />
            <Typography>{item.title}</Typography>
          </Box>
        ) : item.type === "divider" ? (
          <Divider key={index} sx={{ marginBottom: "24px" }} />
        ) : (
          <Typography
            key={index}
            sx={{
              textTransform: "capitalize",
              fontWeight: 700,
              marginBottom: "8px",
              color: theme.palette.grey[900],
              position: "sticky",
              top: 0,
              background: "white",
            }}
          >
            {item.title}
          </Typography>
        ),
      )}
    </Box>
  );
};
