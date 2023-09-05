import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Box, Divider, Typography } from "@mui/material";
import {
    AccountCircle,
    AddBox,
    Bookmark,
    Construction,
    ContentPaste,
    Dashboard,
    History,
    SupervisedUserCircle,
    TableBarRounded,
} from "@mui/icons-material";
import { LOGO_HEIGHT } from "./AdminSidebar";
import { adminRoutes, staffRoutes } from "../../const/path.const";
import { __ } from "../../plugins/i18n.plugin";
import { theme } from "../../plugins/material.plugin";

export const AdminAside = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [items] = useState([
        {
            type: "category",
            title: __("custom.admin.title"),
        },
        {
            type: "route",
            path: adminRoutes.dashboard.path,
            title: __("custom.admin.dashboard.title"),
            Icon: Dashboard,
        },
        {
            type: "route",
            path: adminRoutes.userManagement.path,
            title: __("custom.admin.manage.users.title"),
            Icon: AccountCircle,
        },
        {
            type: "route",
            path: adminRoutes.staffManagement.path,
            title: __("custom.admin.manage.staffs.title"),
            Icon: SupervisedUserCircle,
        },
        {
            type: "route",
            path: adminRoutes.createNewTable.path,
            title: __("custom.admin.tables.create.title"),
            Icon: AddBox,
        },
        {
            type: "route",
            path: adminRoutes.editTableMap.path,
            title: __("custom.admin.tables.edit.title"),
            Icon: Construction,
        },
        {
            type: "divider",
        },
        {
            type: "category",
            title: __("custom.staff.title"),
        },
        {
            type: "route",
            path: staffRoutes.tableManagement.path,
            title: __("custom.staff.manage.tables.title"),
            Icon: TableBarRounded,
        },
        {
            type: "route",
            path: staffRoutes.billManagement.path,
            title: __("custom.staff.manage.bills.title"),
            Icon: ContentPaste,
        },
        {
            type: "route",
            path: staffRoutes.order.path,
            title: __("custom.staff.order.title"),
            Icon: Bookmark,
        },
        {
            type: "route",
            path: staffRoutes.orderHistory.path,
            title: __("custom.staff.order.history.title"),
            Icon: History,
        },
    ]);

    const onClick = (path) => {
        navigate(path);
    };

    return (
        <Box
            component="aside"
            sx={{
                width: "100%",
                height: `calc(100% - ${LOGO_HEIGHT}px - 16px)`,
                overflowY: "scroll",
                marginTop: "16px",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
            }}
        >
            {items.map((item, index) =>
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
                        className={
                            location.pathname === item.path ? "active" : ""
                        }
                    >
                        <item.Icon />
                        <Typography>{item.title}</Typography>
                    </Box>
                ) : item.type === "divider" ? (
                    <Divider sx={{ marginBottom: "24px" }} />
                ) : (
                    <Typography
                        sx={{
                            textTransform: "capitalize",
                            fontWeight: 700,
                            marginBottom: "8px",
                            color: theme.palette.grey[900],
                        }}
                    >
                        {item.title}
                    </Typography>
                )
            )}
        </Box>
    );
};
