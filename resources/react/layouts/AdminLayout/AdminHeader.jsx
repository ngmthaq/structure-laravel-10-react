import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useLoaderData } from "react-router-dom";
import {
    Avatar,
    Box,
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popover,
    Typography,
} from "@mui/material";
import { Logout, Password, Person } from "@mui/icons-material";
import { __ } from "../../plugins/i18n.plugin";
import { theme } from "../../plugins/material.plugin";
import { authAsyncActions } from "../../reducers/auth.reducer";
import { AdminLayoutContext } from ".";

export const HEIGHT = 40;

export const MARGIN = 8;

export const AdminHeader = () => {
    const dispatch = useDispatch();

    const { staff } = useLoaderData();

    const { setIsOpenStaffInfoDialog, setIsOpenChangePasswordDialog } =
        useContext(AdminLayoutContext);

    const [avatarElement, setAvatarElement] = useState(null);

    const onClickAvatar = (e) => {
        setAvatarElement(e.currentTarget);
    };

    const onClosePopup = () => {
        setAvatarElement(null);
    };

    const onClickLogout = () => {
        dispatch(authAsyncActions.staffLogout());
    };

    const onClickStaffInfo = () => {
        setIsOpenStaffInfoDialog(true);
        onClosePopup();
    };

    const onClickChangePassword = () => {
        setIsOpenChangePasswordDialog(true);
        onClosePopup();
    };

    return (
        <Box
            id="admin-header"
            sx={{
                height: HEIGHT,
                margin: MARGIN + "px",
                padding: "8px",
                background: "white",
                borderRadius: "4px",
                border: `1px solid rgba(0, 0, 0, 0.1)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box sx={{ flex: 8 }}></Box>
            <Box
                sx={{
                    flex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "0 16px",
                    cursor: "pointer",
                }}
                onClick={onClickAvatar}
            >
                <Typography>
                    {__("custom.welcome") + " " + staff.name}
                </Typography>
                <Avatar
                    sx={{
                        width: 24,
                        height: 24,
                        background: theme.palette.primary.main,
                        marginLeft: "8px",
                    }}
                >
                    {staff.name.charAt(0)}
                </Avatar>
            </Box>
            <Popover
                open={Boolean(avatarElement)}
                anchorEl={avatarElement}
                onClose={onClosePopup}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{ marginTop: "8px" }}
            >
                <Paper sx={{ width: "100%" }}>
                    <MenuList>
                        <MenuItem onClick={onClickStaffInfo}>
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>
                            <ListItemText sx={{ textTransform: "capitalize" }}>
                                {__("custom.profile")}
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={onClickChangePassword}>
                            <ListItemIcon>
                                <Password fontSize="small" />
                            </ListItemIcon>
                            <ListItemText sx={{ textTransform: "capitalize" }}>
                                {__("custom.change-password")}
                            </ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={onClickLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            <ListItemText sx={{ textTransform: "capitalize" }}>
                                {__("custom.logout")}
                            </ListItemText>
                        </MenuItem>
                    </MenuList>
                </Paper>
            </Popover>
        </Box>
    );
};
