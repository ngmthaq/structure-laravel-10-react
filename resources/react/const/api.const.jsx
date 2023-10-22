export const API_ENDPOINTS = {
  staffLogin: "/v1/staff/login",
  staffLogout: "/v1/staff/logout",
  getStaffInfo: "/v1/staff/info",
  updateStaffInfo: "/v1/staff/info/update",
  staffChangePassword: "/v1/staff/password/change",
  adminGetAllUsers: "/v1/admin/users",
  adminBlockUser: "/v1/admin/users/:userId/block",
  adminUnBlockUser: "/v1/admin/users/:userId/unblock",
  adminCreateUser: "/v1/admin/users/create",
  adminGetAllStaffs: "/v1/admin/staffs",
  adminBlockStaff: "/v1/admin/staffs/:staffId/block",
  adminUnBlockStaff: "/v1/admin/staffs/:staffId/unblock",
  adminUpdateStaffInfo: "/v1/admin/staffs/:staffId/update",
  adminCreateStaff: "/v1/admin/staffs/create",
  adminResetStaffPassword: "/v1/admin/staffs/:staffId/password/reset",
  adminGetConfigurations: "/v1/configurations/get",
  adminSetConfigurations: "/v1/configurations/set",
  adminCreateTable: "/v1/admin/tables/create",
  adminChangeTablePosition: "/v1/admin/tables/:tableId/position/update",
  adminGetTables: "/v1/admin/tables",
  adminDeleteTable: "/v1/admin/tables/:tableId/delete",
  adminRestoreTable: "/v1/admin/tables/:tableId/restore",
  staffGetActiveUsers: "/v1/staffs/users/filter",
  staffQuickCreateUser: "/v1/staffs/users/create",
  staffGetAvailableTables: "/v1/staffs/tables/available",
  staffOrder: "/v1/staffs/reservations/create",
  getAllBills: "/v1/staffs/bills",
};
