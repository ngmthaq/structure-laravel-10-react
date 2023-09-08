import React, { useMemo, useState } from "react";
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
} from "@mui/material";
import { Logout, Password, Person } from "@mui/icons-material";
import { generateRandomColor } from "../../helpers/primitive.helper";
import { __ } from "../../plugins/i18n.plugin";

export const HEIGHT = 40;

export const MARGIN = 8;

export const AdminHeader = () => {
    const color = useMemo(() => generateRandomColor(), []);

    const [avatarElement, setAvatarElement] = useState(null);

    const onClickAvatar = (e) => {
        setAvatarElement(e.currentTarget);
    };

    const onClosePopup = () => {
        setAvatarElement(null);
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
            <Box sx={{ flex: 9 }}></Box>
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "0 16px",
                }}
            >
                <Avatar
                    sx={{
                        width: 24,
                        height: 24,
                        background: color,
                        cursor: "pointer",
                    }}
                    onClick={onClickAvatar}
                >
                    A
                </Avatar>
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
                    <Paper sx={{ width: 200, maxWidth: "100%" }}>
                        <MenuList>
                            <MenuItem>
                                <ListItemIcon>
                                    <Person fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{ textTransform: "capitalize" }}
                                >
                                    {__("custom.profile")}
                                </ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <Password fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{ textTransform: "capitalize" }}
                                >
                                    {__("custom.change-password")}
                                </ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    sx={{ textTransform: "capitalize" }}
                                >
                                    {__("custom.logout")}
                                </ListItemText>
                            </MenuItem>
                        </MenuList>
                    </Paper>
                </Popover>
            </Box>
        </Box>
    );
};
