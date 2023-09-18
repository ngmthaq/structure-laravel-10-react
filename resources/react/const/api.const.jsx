export const API_ENDPOINTS = {
  staffLogin: "/v1/staff/login",
  staffLogout: "/v1/staff/logout",
  getStaffInfo: "/v1/staff/info",
  updateStaffInfo: "/v1/staff/info/update",
  staffChangePassword: "/v1/staff/password/change",
  adminGetAllUsers: "/v1/admin/users",
  adminBlockUser: "/v1/admin/users/:userId/block",
  adminUnBlockUser: "/v1/admin/users/:userId/unblock",
  adminGetAllStaffs: "/v1/admin/staffs",
  adminBlockStaff: "/v1/admin/staffs/:staffId/block",
  adminUnBlockStaff: "/v1/admin/staffs/:staffId/unblock",
};
