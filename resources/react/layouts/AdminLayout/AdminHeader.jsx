import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLoaderData, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import { Delete, Logout, Password, Person } from "@mui/icons-material";
import { __ } from "../../plugins/i18n.plugin";
import { theme } from "../../plugins/material.plugin";
import { authAsyncActions } from "../../reducers/auth.reducer";
import { useEventBus } from "../../plugins/bus.plugin";
import { AdminLayoutContext } from "./index";
import { EVENT_BUS } from "../../const/event.const";
import { adminRoutes } from "../../const/path.const";

export const HEIGHT = 48;

export const MARGIN = 16;

export const AdminHeader = () => {
  const dispatch = useDispatch();

  const eventBus = useEventBus();

  const location = useLocation();

  const { staff } = useLoaderData();

  const { setIsOpenStaffInfoDialog, setIsOpenChangePasswordDialog } = useContext(AdminLayoutContext);

  const [avatarElement, setAvatarElement] = useState(null);

  const [editTableMode, setEditTableMode] = useState({ open: false, activeTable: null });

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

  const onDeleteTable = () => {
    if (
      editTableMode.open &&
      editTableMode.activeTable &&
      confirm(__("custom.delete-table-confirm", { table: editTableMode.activeTable }))
    ) {
      // TODO: Delete table
    }
  };

  useEffect(() => {
    const handler = (activeTable) => {
      setEditTableMode((state) => ({ ...state, activeTable: activeTable }));
    };

    if (location.pathname === adminRoutes.editTableMap.path) {
      setEditTableMode((state) => ({ ...state, open: true }));
      eventBus.on(EVENT_BUS.activeTable, handler);
    }

    return () => {
      eventBus.off(EVENT_BUS.activeTable, handler);
    };
  }, [location]);

  return (
    <Box
      id="admin-header"
      sx={{
        height: HEIGHT,
        margin: MARGIN + "px",
        marginRight: "14px",
        padding: "8px",
        background: "white",
        borderRadius: "4px",
        border: `1px solid rgba(0, 0, 0, 0.1)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ flex: 8 }}>
        {editTableMode.open && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            {editTableMode.activeTable ? (
              <Button variant="contained" size="small" color="error" onClick={onDeleteTable}>
                <Delete fontSize="small" />
                <Typography marginLeft="8px" variant="p">
                  {__("custom.delete-table")}
                </Typography>
              </Button>
            ) : (
              <Typography sx={{ padding: "0 8px" }}>{__("custom.no-table-selected")}</Typography>
            )}
          </Box>
        )}
      </Box>
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
        <Typography>{__("custom.welcome") + " " + staff.name}</Typography>
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
              <ListItemText sx={{ textTransform: "capitalize" }}>{__("custom.profile")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={onClickChangePassword}>
              <ListItemIcon>
                <Password fontSize="small" />
              </ListItemIcon>
              <ListItemText sx={{ textTransform: "capitalize" }}>{__("custom.change-password")}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onClickLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText sx={{ textTransform: "capitalize" }}>{__("custom.logout")}</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      </Popover>
    </Box>
  );
};
