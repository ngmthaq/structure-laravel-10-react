import { camelizeKeys } from "humps";
import { AuthStaffApi } from "../api/auth.staff.api";
import { API_ENDPOINTS } from "../const/api.const";
import { KEY_STAFF_ACCESS_TOKEN } from "../const/key.const";
import { authRoutes } from "../const/path.const";
import { StaffModel } from "../models/staff.model";
import { closeLinearLoading, openLinearLoading } from "../helpers/element.helper";

export const staffLoader = async ({ params, request }) => {
  openLinearLoading();

  const token = localStorage.getItem(KEY_STAFF_ACCESS_TOKEN);

  if (token) {
    const api = new AuthStaffApi();
    const response = await api.get(API_ENDPOINTS.getStaffInfo);
    const staff = camelizeKeys(response.data.staff);
    closeLinearLoading();

    return {
      staff: StaffModel(staff.id, staff.name, staff.email, staff.phone, staff.address, staff.dateOfBirth, staff.role),
    };
  } else {
    location.replace(authRoutes.staffLogin.path);

    return null;
  }
};
