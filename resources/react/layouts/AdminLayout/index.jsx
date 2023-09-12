import React, { createContext, useState } from "react";
import { Box } from "@mui/material";
import { AdminSidebar, WIDTH as ADMIN_SIDEBAR_WIDTH } from "./AdminSidebar";
import { AdminHeader, HEIGHT as ADMIN_HEADER_HEIGHT, MARGIN as ADMIN_HEADER_MARGIN } from "./AdminHeader";
import { StaffInfoDialog } from "./StaffInfoDialog";
import { StaffChangePasswordDialog } from "./StaffChangePasswordDialog";

export const AdminLayoutContext = createContext();

export const AdminLayout = ({ children }) => {
  const [isOpenStaffInfoDialog, setIsOpenStaffInfoDialog] = useState(false);

  const [isOpenChangePasswordDialog, setIsOpenChangePasswordDialog] = useState(false);

  const context = {
    isOpenStaffInfoDialog,
    setIsOpenStaffInfoDialog,
    isOpenChangePasswordDialog,
    setIsOpenChangePasswordDialog,
  };

  return (
    <AdminLayoutContext.Provider value={context}>
      <Box
        id="admin-layout"
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `rgba(0, 0, 0, 0.05)`,
        }}
      >
        <AdminSidebar />
        <Box
          sx={{
            height: "100vh",
            width: `calc(100vw - ${ADMIN_SIDEBAR_WIDTH}px)`,
          }}
        >
          <AdminHeader />
          <Box
            id="admin-layout-content"
            sx={{
              height: `calc(100vh - ${ADMIN_HEADER_HEIGHT}px - (${ADMIN_HEADER_MARGIN}px * 2))`,
              margin: "0 8px",
              padding: "8px",
              background: "white",
              borderRadius: "4px 4px 0 0",
              border: `1px solid rgba(0, 0, 0, 0.1)`,
              overflowY: "scroll",
            }}
          >
            {children}
          </Box>
        </Box>
        <StaffInfoDialog />
        <StaffChangePasswordDialog />
      </Box>
    </AdminLayoutContext.Provider>
  );
};
