import React, { Fragment, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLoaderData, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Input,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { Logout, Password, Person, Sync } from "@mui/icons-material";
import { __ } from "../../plugins/i18n.plugin";
import { theme } from "../../plugins/material.plugin";
import { authAsyncActions } from "../../reducers/auth.reducer";
import { AdminLayoutContext } from "./index";
import { staffRoutes } from "../../const/path.const";
import dayjs from "dayjs";
import { useEventBus } from "../../plugins/bus.plugin";
import { EVENT_BUS } from "../../const/event.const";

export const HEIGHT = 48;

export const MARGIN = 8;

export const AdminHeader = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  const eventBus = useEventBus();

  const { staff } = useLoaderData();

  const { setIsOpenStaffInfoDialog, setIsOpenChangePasswordDialog } = useContext(AdminLayoutContext);

  const [avatarElement, setAvatarElement] = useState(null);

  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD hh:mm:ss"));

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

  const onRefresh = () => {
    const date = dayjs().format("YYYY-MM-DD hh:mm:ss");
    setDate(date);
    eventBus.emit(EVENT_BUS.refreshGetAvailableTable, date);
  };

  const onChangeDatetime = (e) => {
    setDate(e.target.value || dayjs().format("YYYY-MM-DD hh:mm:ss"));
    eventBus.emit(EVENT_BUS.refreshGetAvailableTable, e.target.value || dayjs().format("YYYY-MM-DD hh:mm:ss"));
  };

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
        {location.pathname === staffRoutes.tableManagement.path && (
          <Box display="flex" alignItems="center">
            <TextField
              type="datetime-local"
              variant="outlined"
              size="small"
              onChange={onChangeDatetime}
              sx={{ width: "30%" }}
              value={date}
            />
            <Button variant="outlined" title="Refresh" onClick={onRefresh} sx={{ height: 40, marginLeft: "4px" }}>
              <Sync fontSize="small" />
            </Button>
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
