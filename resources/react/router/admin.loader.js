import { camelizeKeys } from "humps";
import { AuthStaffApi } from "../api/auth.staff.api";
import { API_ENDPOINTS } from "../const/api.const";
import { KEY_STAFF_ACCESS_TOKEN } from "../const/key.const";
import { authRoutes, staffRoutes } from "../const/path.const";
import { StaffModel } from "../models/staff.model";
import {
    closeLinearLoading,
    openLinearLoading,
} from "../helpers/element.helper";

export const adminLoader = async ({ params, request }) => {
    openLinearLoading();

    const token = localStorage.getItem(KEY_STAFF_ACCESS_TOKEN);

    if (token) {
        const api = new AuthStaffApi();
        const response = await api.get(API_ENDPOINTS.getStaffInfo);

        if (response.status === 200) {
            const rawStaff = camelizeKeys(response.data.staff);

            closeLinearLoading();

            const staff = StaffModel(
                rawStaff.id,
                rawStaff.name,
                rawStaff.email,
                rawStaff.phone,
                rawStaff.address,
                rawStaff.dateOfBirth,
                rawStaff.role
            );

            if (staff.isAdmin) {
                return { staff };
            } else {
                location.replace(staffRoutes.tableManagement.path);

                return null;
            }
        } else {
            location.replace(authRoutes.staffLogin.path);

            return null;
        }
    } else {
        location.replace(authRoutes.staffLogin.path);

        return null;
    }
};
